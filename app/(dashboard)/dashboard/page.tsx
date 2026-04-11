import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, FileText, Clock } from "lucide-react"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const { userId } = await auth()

  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users")
    .select("id, plan, email")
    .eq("clerk_id", userId!)
    .single()

  const { data: recentJobs } = await supabase
    .from("content_jobs")
    .select("id, input_type, status, created_at, extracted")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: usage } = await supabase
    .from("user_monthly_usage")
    .select("repurpose_count")
    .eq("user_id", user?.id ?? "")
    .eq("month", new Date().toISOString().slice(0, 7) + "-01")
    .single()

  const usageCount = usage?.repurpose_count ?? 0
  const usageLimit = user?.plan === "free" ? 5 : null

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground">Welcome back</p>
        </div>
        <Button asChild>
          <Link href="/create"><PlusCircle className="mr-2 h-4 w-4" />New repurpose</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">This month</p>
          <p className="mt-1 text-3xl font-bold">{usageCount}</p>
          <p className="text-sm text-muted-foreground">
            {usageLimit ? `of ${usageLimit} repurposes` : "repurposes"}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="mt-1 text-3xl font-bold capitalize">{user?.plan ?? "free"}</p>
          {user?.plan === "free" && (
            <Link href="/settings" className="text-sm text-primary hover:underline">Upgrade →</Link>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total jobs</p>
          <p className="mt-1 text-3xl font-bold">{recentJobs?.length ?? 0}</p>
          <p className="text-sm text-muted-foreground">recent</p>
        </Card>
      </div>

      {/* Recent jobs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent repurposes</h2>
        {!recentJobs || recentJobs.length === 0 ? (
          <Card className="flex flex-col items-center gap-4 p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No repurposes yet</p>
              <p className="text-sm text-muted-foreground">Create your first one to see it here</p>
            </div>
            <Button asChild><Link href="/create">Get started</Link></Button>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {recentJobs.map((job) => (
              <Card key={job.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {(job.extracted as { title?: string })?.title ?? `${job.input_type} input`}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={job.status === "ready" ? "default" : job.status === "failed" ? "destructive" : "secondary"}>
                    {job.status}
                  </Badge>
                  {job.status === "ready" && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/review/${job.id}`}>View</Link>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
