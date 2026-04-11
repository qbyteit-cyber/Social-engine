import { auth } from "@clerk/nextjs/server"
import { createServiceClient } from "@/lib/supabase/server"
import { TeamClient } from "@/components/dashboard/TeamClient"

export const metadata = { title: "Team" }

export default async function TeamPage() {
  const { userId } = await auth()
  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users").select("id, plan, email").eq("clerk_id", userId!).single()

  const isAgency = user?.plan === "agency"

  const { data: team } = await supabase
    .from("teams")
    .select("id, name")
    .eq("owner_id", user?.id ?? "")
    .single()

  const { data: members } = team ? await supabase
    .from("team_members")
    .select("id, role, user_id, users(email)")
    .eq("team_id", team.id) : { data: [] }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-bold">Team workspace</h1>

      {!isAgency && (
        <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Team workspaces require an Agency plan (up to 10 members).{" "}
          <a href="/settings" className="font-medium underline">Upgrade →</a>
        </div>
      )}

      <TeamClient
        userId={user?.id ?? ""}
        team={team ?? null}
        members={(members ?? []).map((m) => ({
          id: m.id,
          role: m.role,
          email: (m.users as { email?: string } | null)?.email ?? "",
        }))}
        disabled={!isAgency}
      />
    </div>
  )
}
