import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  // Only team owner can remove members
  const { data: member } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("id", id)
    .single()

  if (!member || member.role === "owner") {
    return NextResponse.json({ success: false, error: "Cannot remove team owner" }, { status: 400 })
  }

  const { data: team } = await supabase
    .from("teams").select("owner_id").eq("id", member.team_id).single()

  if (team?.owner_id !== user.id) {
    return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 })
  }

  await supabase.from("team_members").delete().eq("id", id)
  return NextResponse.json({ success: true })
}
