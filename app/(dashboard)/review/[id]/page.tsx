import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { VariantsEditor } from "@/components/editor/VariantsEditor"
import type { PlatformVariantsOutput } from "@/types/content"
import type { PlatformKey } from "@/types/platforms"

export const metadata = { title: "Review variants" }

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users").select("id, plan").eq("clerk_id", userId!).single()

  const { data: job } = await supabase
    .from("content_jobs")
    .select("id, input_type, extracted, status")
    .eq("id", id)
    .eq("user_id", user?.id ?? "")
    .single()

  if (!job) notFound()

  const { data: variants } = await supabase
    .from("platform_variants")
    .select("id, platform, content")
    .eq("job_id", id)

  const { data: connections } = await supabase
    .from("platform_connections")
    .select("platform")
    .eq("user_id", user?.id ?? "")

  const connectedPlatforms = (connections ?? []).map((c) => c.platform)

  const variantsOutput: PlatformVariantsOutput = {
    platforms: Object.fromEntries(
      (variants ?? []).map((v) => [v.platform as PlatformKey, v.content])
    ),
  }

  const variantIds: Record<string, string> = Object.fromEntries(
    (variants ?? []).map((v) => [v.platform, v.id])
  )

  const extracted = job.extracted as { title?: string } | null

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Review variants</h1>
        {extracted?.title && <p className="text-muted-foreground">{extracted.title}</p>}
      </div>
      <VariantsEditor
        jobId={id}
        initial={variantsOutput}
        variantIds={variantIds}
        connectedPlatforms={connectedPlatforms}
        canSchedule={user?.plan !== "free"}
      />
    </div>
  )
}
