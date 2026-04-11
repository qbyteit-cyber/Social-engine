import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"

const OAUTH_CONFIGS: Record<string, { tokenUrl: string; clientId: string; clientSecret: string }> = {
  linkedin: {
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
  },
  facebook: {
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    clientId: process.env.META_APP_ID ?? "",
    clientSecret: process.env.META_APP_SECRET ?? "",
  },
  instagram: {
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    clientId: process.env.META_APP_ID ?? "",
    clientSecret: process.env.META_APP_SECRET ?? "",
  },
  threads: {
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    clientId: process.env.META_APP_ID ?? "",
    clientSecret: process.env.META_APP_SECRET ?? "",
  },
  youtube: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: process.env.YOUTUBE_CLIENT_ID ?? "",
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET ?? "",
  },
  pinterest: {
    tokenUrl: "https://api.pinterest.com/v5/oauth/token",
    clientId: process.env.PINTEREST_CLIENT_ID ?? "",
    clientSecret: process.env.PINTEREST_CLIENT_SECRET ?? "",
  },
  tiktok: {
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    clientId: process.env.TIKTOK_CLIENT_ID ?? "",
    clientSecret: process.env.TIKTOK_CLIENT_SECRET ?? "",
  },
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/connections?error=${encodeURIComponent(error)}`, req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/connections?error=missing_code", req.url))
  }

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  const config = OAUTH_CONFIGS[platform]
  if (!config) {
    return NextResponse.redirect(new URL("/connections?error=unknown_platform", req.url))
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin}/api/oauth/${platform}`

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    })

    const tokens = await tokenRes.json() as {
      access_token: string
      refresh_token?: string
      expires_in?: number
    }

    if (!tokens.access_token) throw new Error("No access token returned")

    const supabase = await createServiceClient()
    const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single()
    if (!user) throw new Error("User not found")

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null

    await supabase.from("platform_connections").upsert(
      {
        user_id: user.id,
        platform,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        expires_at: expiresAt,
      },
      { onConflict: "user_id,platform" }
    )

    return NextResponse.redirect(new URL("/connections?success=1", req.url))
  } catch (err) {
    const msg = err instanceof Error ? err.message : "oauth_error"
    return NextResponse.redirect(new URL(`/connections?error=${encodeURIComponent(msg)}`, req.url))
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  await supabase.from("platform_connections")
    .delete().eq("user_id", user.id).eq("platform", platform)

  return NextResponse.json({ success: true })
}
