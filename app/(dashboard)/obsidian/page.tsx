import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { ObsidianClient } from "@/components/dashboard/ObsidianClient"

export const metadata = { title: "Obsidian Sync" }

export default async function ObsidianPage() {
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase.from("users").select("id").eq("clerk_id", userId!).single()

  const { data: tokenRow } = await supabase
    .from("obsidian_tokens")
    .select("token, vault_name")
    .eq("user_id", user?.id ?? "")
    .single()

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Obsidian Sync</h1>
        <p className="text-muted-foreground">
          Push notes directly from your Obsidian vault to Repurpose Engine with one command.
        </p>
      </div>
      <ObsidianClient
        existingToken={tokenRow?.token ?? null}
        vaultName={tokenRow?.vault_name ?? null}
        ingestUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/obsidian/ingest`}
      />
    </div>
  )
}
