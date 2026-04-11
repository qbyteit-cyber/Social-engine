import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { extractContent } from "@/lib/ai/extract"
import { repurposeContent } from "@/lib/ai/repurpose"
import { getPlatformsForPlan } from "@/lib/stripe/plans"
import type { Plan } from "@/types/user"
import type { BrandVoice } from "@/types/user"

const schema = z.object({
  token: z.string().min(1),
  content: z.string().min(1),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

/**
 * Obsidian plugin calls this endpoint with a Bearer token.
 * Authentication is token-based (no Clerk cookie needed).
 */
export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  const supabase = await createServiceClient()

  // Look up user by token
  const { data: tokenRow } = await supabase
    .from("obsidian_tokens")
    .select("user_id")
    .eq("token", body.data.token)
    .single()

  if (!tokenRow) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })

  const { data: user } = await supabase
    .from("users").select("id, plan, brand_voice").eq("id", tokenRow.user_id).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  // Create job
  const { data: job, error: jobError } = await supabase
    .from("content_jobs")
    .insert({ user_id: user.id, input_type: "text", input_raw: body.data.content, status: "generating" })
    .select("id").single()

  if (jobError || !job) return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 })

  try {
    const extracted = await extractContent("text", body.data.content)
    if (body.data.title) extracted.title = body.data.title

    const platforms = getPlatformsForPlan(user.plan as Plan)
    const variants = await repurposeContent(extracted, platforms, user.brand_voice as BrandVoice)

    const variantRows = Object.entries(variants.platforms).map(([platform, content]) => ({
      job_id: job.id, platform, content, status: "draft",
    }))

    await supabase.from("platform_variants").insert(variantRows)
    await supabase.from("content_jobs").update({ status: "ready", extracted }).eq("id", job.id)

    return NextResponse.json({
      success: true,
      data: {
        job_id: job.id,
        review_url: `${process.env.NEXT_PUBLIC_APP_URL}/review/${job.id}`,
        variants_count: variantRows.length,
      },
    })
  } catch (err) {
    await supabase.from("content_jobs").update({ status: "failed" }).eq("id", job.id)
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed" }, { status: 500 })
  }
}
