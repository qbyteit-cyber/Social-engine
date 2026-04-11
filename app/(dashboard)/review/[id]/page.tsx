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
    .from("users").select("id").eq("clerk_id", userId!).single()

  const { data: job } = await supabase
    .from("content_jobs")
    .select("id, input_type, extracted, status")
    .eq("id", id)
    .eq("user_id", user?.id ?? "")
    .single()

  if (!job) notFound()

  const { data: variants } = await supabase
    .from("platform_variants")
    .select("platform, content, id")
    .eq("job_id", id)

  const variantsOutput: PlatformVariantsOutput = {
    platforms: Object.fromEntries(
      (variants ?? []).map((v) => [v.platform as PlatformKey, v.content])
    ),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Review variants</h1>
        <p className="text-muted-foreground">
          Edit any platform&apos;s copy, then copy or schedule to post.
        </p>
      </div>
      <VariantsEditor jobId={id} initial={variantsOutput} />
    </div>
  )
}
