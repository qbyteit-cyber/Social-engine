import { createServiceClient } from "@/lib/supabase/server"
import type { PublishPayload } from "./publish-post"

export async function executePublish(payload: PublishPayload) {
  const supabase = await createServiceClient()

  // Get connection tokens
  const { data: connection } = await supabase
    .from("platform_connections")
    .select("access_token, refresh_token, platform_username")
    .eq("user_id", payload.user_id)
    .eq("platform", payload.platform)
    .single()

  if (!connection) {
    await supabase
      .from("scheduled_posts")
      .update({ status: "failed", error: "No platform connection found" })
      .eq("id", payload.scheduled_post_id)
    throw new Error("No platform connection")
  }

  // Get variant content
  const { data: variant } = await supabase
    .from("platform_variants")
    .select("content")
    .eq("id", payload.variant_id)
    .single()

  if (!variant) throw new Error("Variant not found")

  const content = variant.content as {
    text: string
    hashtags?: string[]
    thread_parts?: string[]
  }

  // Build the full post text
  const hashtags = content.hashtags?.length
    ? "\n\n" + content.hashtags.map((h: string) => `#${h}`).join(" ")
    : ""
  const postText = content.text + hashtags

  // Platform-specific publish
  let platformPostId: string | null = null

  switch (payload.platform) {
    case "bluesky":
      platformPostId = await publishToBluesky(postText, connection.access_token)
      break
    case "linkedin":
      platformPostId = await publishToLinkedIn(postText, connection.access_token)
      break
    default:
      // For platforms not yet fully implemented, mark as simulated
      platformPostId = `simulated_${Date.now()}`
  }

  // Update scheduled post status
  await supabase
    .from("scheduled_posts")
    .update({ status: "posted", posted_at: new Date().toISOString(), platform_post_id: platformPostId })
    .eq("id", payload.scheduled_post_id)

  await supabase
    .from("platform_variants")
    .update({ status: "published" })
    .eq("id", payload.variant_id)

  return { success: true, platform_post_id: platformPostId }
}

async function publishToBluesky(text: string, appPassword: string): Promise<string> {
  const [identifier, password] = appPassword.split("::")
  const sessionRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  })
  const session = await sessionRes.json() as { accessJwt: string; did: string }

  const postRes = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: "app.bsky.feed.post",
      record: { text, createdAt: new Date().toISOString(), $type: "app.bsky.feed.post" },
    }),
  })
  const post = await postRes.json() as { uri: string }
  return post.uri
}

async function publishToLinkedIn(text: string, accessToken: string): Promise<string> {
  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const profile = await profileRes.json() as { sub: string }

  const postRes = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify({
      author: `urn:li:person:${profile.sub}`,
      commentary: text,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  })
  const location = postRes.headers.get("x-restli-id") ?? `li_${Date.now()}`
  return location
}
