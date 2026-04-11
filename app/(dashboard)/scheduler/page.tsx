import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

export const metadata = { title: "Scheduler" }

const STATUS_COLORS: Record<string, string> = {
  queued: "secondary",
  posted: "default",
  failed: "destructive",
}

const PLATFORM_NAMES: Record<string, string> = {
  linkedin: "LinkedIn", twitter: "X / Twitter", instagram: "Instagram",
  facebook: "Facebook", threads: "Threads", youtube: "YouTube",
  pinterest: "Pinterest", bluesky: "Bluesky", tiktok: "TikTok", newsletter: "Newsletter",
}

export default async function SchedulerPage() {
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase.from("users").select("id, plan").eq("clerk_id", userId!).single()

  const { data: posts } = await supabase
    .from("scheduled_posts")
    .select("id, platform, scheduled_for, posted_at, status, error, platform_post_id, variant_id")
    .eq("user_id", user?.id ?? "")
    .order("scheduled_for", { ascending: false })
    .limit(50)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Scheduler</h1>
        <p className="text-muted-foreground">All your queued and published posts.</p>
      </div>

      {user?.plan === "free" && (
        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Scheduling requires a Creator or Agency plan. You can still publish immediately from the review page.
        </div>
      )}

      {!posts || posts.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No posts scheduled yet</p>
            <p className="text-sm text-muted-foreground">Publish or schedule from the review page after generating variants.</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">{PLATFORM_NAMES[post.platform] ?? post.platform}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.posted_at
                      ? `Posted ${new Date(post.posted_at).toLocaleString()}`
                      : `Scheduled for ${new Date(post.scheduled_for).toLocaleString()}`}
                  </p>
                  {post.error && <p className="text-xs text-destructive">{post.error}</p>}
                </div>
              </div>
              <Badge variant={(STATUS_COLORS[post.status] ?? "secondary") as "default" | "secondary" | "destructive"}>
                {post.status}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
