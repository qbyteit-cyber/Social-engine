import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  team_id: z.string().uuid(),
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id, email").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  // Verify the requesting user owns the team
  const { data: team } = await supabase
    .from("teams").select("id, name").eq("id", body.data.team_id).eq("owner_id", user.id).single()
  if (!team) return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 })

  // Check member limit
  const { count } = await supabase
    .from("team_members").select("*", { count: "exact", head: true }).eq("team_id", team.id)
  if ((count ?? 0) >= 10) {
    return NextResponse.json({ success: false, error: "Team is full (10 members max)" }, { status: 400 })
  }

  // Find or note the invitee
  const { data: invitee } = await supabase
    .from("users").select("id").eq("email", body.data.email).single()

  let member = null
  if (invitee) {
    const { data: m } = await supabase
      .from("team_members")
      .upsert({ team_id: team.id, user_id: invitee.id, role: "member" }, { onConflict: "team_id,user_id" })
      .select("id, role")
      .single()
    member = m
  }

  // Send invite email
  await resend.emails.send({
    from: "Repurpose Engine <team@repurposeengine.com>",
    to: body.data.email,
    subject: `You've been invited to join ${team.name} on Repurpose Engine`,
    html: `
      <p>Hi,</p>
      <p>${user.email} has invited you to join the <strong>${team.name}</strong> workspace on Repurpose Engine.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-up" style="background:#0A2463;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px">Accept invitation</a></p>
      <p style="margin-top:16px;color:#64748B;font-size:12px">If you already have an account, sign in and you'll be added automatically.</p>
    `,
  })

  return NextResponse.json({ success: true, data: member })
}
