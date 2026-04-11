import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"

const schema = z.object({ name: z.string().min(1) })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id, plan").eq("clerk_id", userId).single()

  if (!user || user.plan !== "agency") {
    return NextResponse.json({ success: false, error: "Agency plan required" }, { status: 403 })
  }

  const { data: team, error } = await supabase
    .from("teams")
    .insert({ owner_id: user.id, name: body.data.name })
    .select("id, name")
    .single()

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  // Add owner as first member
  await supabase.from("team_members").insert({ team_id: team.id, user_id: user.id, role: "owner" })

  return NextResponse.json({ success: true, data: team })
}
