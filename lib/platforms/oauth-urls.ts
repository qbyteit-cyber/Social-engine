import type { PlatformKey } from "@/types/platforms"

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export function getOAuthUrl(platform: PlatformKey): string | null {
  const redirect = encodeURIComponent(`${BASE}/api/oauth/${platform}`)

  switch (platform) {
    case "linkedin":
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${redirect}&scope=openid%20profile%20email%20w_member_social`

    case "facebook":
    case "instagram":
    case "threads":
      return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${redirect}&scope=pages_manage_posts%2Cpages_read_engagement%2Cinstagram_basic%2Cinstagram_content_publish%2Cthreads_basic%2Cthreads_content_publish&response_type=code`

    case "youtube":
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube&access_type=offline`

    case "pinterest":
      return `https://www.pinterest.com/oauth/?client_id=${process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=boards:read,pins:read,pins:write`

    case "tiktok":
      return `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=user.info.basic%2Cvideo.publish%2Cvideo.upload`

    case "bluesky":
      return null // App-password based, handled in UI

    case "newsletter":
      return null // API key based

    default:
      return null
  }
}
