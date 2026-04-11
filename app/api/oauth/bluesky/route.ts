import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"

const connectSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
})

// POST — connect Bluesky with app password
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const body = connectSchema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  try {
    // Verify the credentials work
    const sessionRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: body.data.identifier, password: body.data.password }),
    })

    if (!sessionRes.ok) {
      const err = await sessionRes.json() as { message?: string }
      return NextResponse.json({ success: false, error: err.message ?? "Invalid credentials" }, { status: 401 })
    }

    const session = await sessionRes.json() as { did: string; handle: string }

    const supabase = await createServiceClient()
    const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single()
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

    // Store identifier::password as access_token (used at publish time to create session)
    await supabase.from("platform_connections").upsert(
      {
        user_id: user.id,
        platform: "bluesky",
        access_token: `${body.data.identifier}::${body.data.password}`,
        platform_user_id: session.did,
        platform_username: session.handle,
      },
      { onConflict: "user_id,platform" }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "Connection failed" }, { status: 500 })
  }
}

// DELETE — disconnect
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  await supabase.from("platform_connections")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", "bluesky")

  return NextResponse.json({ success: true })
}
