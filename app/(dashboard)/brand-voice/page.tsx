import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { BrandVoiceClient } from "@/components/dashboard/BrandVoiceClient"
import type { BrandVoice } from "@/types/user"

export const metadata = { title: "Brand Voice" }

export default async function BrandVoicePage() {
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users")
    .select("id, plan, brand_voice")
    .eq("clerk_id", userId!)
    .single()

  const { data: samples } = await supabase
    .from("brand_voice_samples")
    .select("platform, created_at, approved")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(20)

  const isPaid = user?.plan !== "free"

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Brand Voice</h1>
        <p className="text-muted-foreground">
          Define how you sound. Claude uses this profile to tailor every generated post.
        </p>
      </div>

      {!isPaid && (
        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Brand voice requires a Creator or Agency plan.{" "}
          <a href="/settings" className="font-medium underline">Upgrade →</a>
        </div>
      )}

      <BrandVoiceClient
        initial={(user?.brand_voice as BrandVoice) ?? {}}
        samples={samples ?? []}
        disabled={!isPaid}
      />
    </div>
  )
}
