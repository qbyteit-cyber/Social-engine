import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  await supabase.from("platform_connections")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", platform)

  return NextResponse.json({ success: true })
}
