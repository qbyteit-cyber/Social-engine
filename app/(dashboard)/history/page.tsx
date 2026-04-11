import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, TrendingUp, Clock } from "lucide-react"

export const metadata = { title: "Post History" }

const PLATFORM_NAMES: Record<string, string> = {
  linkedin: "LinkedIn", twitter: "X / Twitter", instagram: "Instagram",
  facebook: "Facebook", threads: "Threads", youtube: "YouTube",
  pinterest: "Pinterest", bluesky: "Bluesky", tiktok: "TikTok", newsletter: "Newsletter",
}

export default async function HistoryPage() {
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId!).single()

  const { data: jobs } = await supabase
    .from("content_jobs")
    .select(`
      id, input_type, status, created_at, extracted,
      platform_variants (
        id, platform, status, likes, comments, shares, impressions, content
      )
    `)
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(30)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Post History</h1>
        <p className="text-muted-foreground">All your repurposes and their performance.</p>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No history yet</p>
            <p className="text-sm text-muted-foreground">Your repurposes will appear here.</p>
          </div>
          <Button asChild><Link href="/create">Create your first</Link></Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => {
            const extracted = job.extracted as { title?: string } | null
            const variants = job.platform_variants ?? []
            const published = variants.filter((v) => v.status === "published").length
            const totalEngagement = variants.reduce((sum, v) => sum + (v.likes ?? 0) + (v.comments ?? 0) + (v.shares ?? 0), 0)

            return (
              <Card key={job.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {extracted?.title ?? `${job.input_type} content`}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(job.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>

                    {/* Platform chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {variants.map((v) => (
                        <Badge
                          key={v.id}
                          variant={v.status === "published" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {PLATFORM_NAMES[v.platform] ?? v.platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span>{published}/{variants.length} published</span>
                      {totalEngagement > 0 && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-primary" />
                          {totalEngagement} engagements
                        </span>
                      )}
                    </div>
                    {job.status === "ready" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/review/${job.id}`}>View</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
