import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { SettingsClient } from "@/components/dashboard/SettingsClient"

export const metadata = { title: "Settings" }

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ billing?: string }> }) {
  const sp = await searchParams
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users").select("id, email, plan").eq("clerk_id", userId!).single()

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>
      {sp.billing === "success" && (
        <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Subscription updated successfully!
        </div>
      )}
      <SettingsClient user={user ?? { id: "", email: "", plan: "free" }} />
    </div>
  )
}
