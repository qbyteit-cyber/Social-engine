import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { ApiResponse } from "@/types/content"

const schema = z.object({
  variant_id: z.string().uuid(),
  scheduled_for: z.string().datetime().optional(),
})

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users").select("id, plan").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  // Scheduling requires creator+ plan
  if (body.data.scheduled_for && user.plan === "free") {
    return NextResponse.json({ success: false, error: "Scheduling requires a paid plan" }, { status: 403 })
  }

  const { data: variant } = await supabase
    .from("platform_variants")
    .select("id, platform, job_id")
    .eq("id", body.data.variant_id)
    .single()
  if (!variant) return NextResponse.json({ success: false, error: "Variant not found" }, { status: 404 })

  const scheduledFor = body.data.scheduled_for ?? new Date().toISOString()

  const { data: post, error } = await supabase
    .from("scheduled_posts")
    .insert({
      variant_id: variant.id,
      user_id: user.id,
      platform: variant.platform,
      scheduled_for: scheduledFor,
      status: "queued",
    })
    .select("id")
    .single()

  if (error || !post) return NextResponse.json({ success: false, error: "Failed to queue post" }, { status: 500 })

  // If immediate publish, trigger the task
  if (!body.data.scheduled_for) {
    try {
      const { tasks } = await import("@trigger.dev/sdk/v3")
      await tasks.trigger("publish-post", {
        scheduled_post_id: post.id,
        variant_id: variant.id,
        platform: variant.platform,
        user_id: user.id,
      })
    } catch {
      // Trigger.dev not configured — mark as queued for manual processing
    }
  }

  return NextResponse.json({ success: true, data: { scheduled_post_id: post.id } })
}
