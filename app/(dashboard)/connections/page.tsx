import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { ConnectionsClient } from "@/components/dashboard/ConnectionsClient"
import type { PlatformKey } from "@/types/platforms"

export const metadata = { title: "Connections" }

export default async function ConnectionsPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const sp = await searchParams
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId!).single()

  const { data: connections } = await supabase
    .from("platform_connections")
    .select("platform, platform_username, connected_at")
    .eq("user_id", user?.id ?? "")

  const connectedMap: Record<string, { username?: string; connected_at: string }> = {}
  for (const c of connections ?? []) {
    connectedMap[c.platform] = { username: c.platform_username ?? undefined, connected_at: c.connected_at }
  }

  const platforms: PlatformKey[] = [
    "linkedin", "twitter", "instagram", "facebook", "threads",
    "youtube", "pinterest", "bluesky", "tiktok", "newsletter",
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Platform connections</h1>
        <p className="text-muted-foreground">Connect your accounts to publish directly from Repurpose Engine.</p>
      </div>
      {sp.success && (
        <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Platform connected successfully!
        </div>
      )}
      {sp.error && (
        <div className="mb-6 rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          Connection failed: {sp.error}
        </div>
      )}
      <ConnectionsClient platforms={platforms} connected={connectedMap} />
    </div>
  )
}
