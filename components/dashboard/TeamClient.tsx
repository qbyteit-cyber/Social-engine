"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, UserPlus, Trash2 } from "lucide-react"

interface Member { id: string; role: string; email: string }
interface Team { id: string; name: string }

interface Props {
  userId: string
  team: Team | null
  members: Member[]
  disabled: boolean
}

export function TeamClient({ team: initialTeam, members: initialMembers, disabled }: Props) {
  const [team, setTeam] = useState<Team | null>(initialTeam)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [teamName, setTeamName] = useState(initialTeam?.name ?? "")
  const [inviteEmail, setInviteEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  async function createTeam() {
    if (!teamName.trim()) return
    setLoading(true)
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    })
    const json = await res.json()
    if (json.success) setTeam(json.data)
    setLoading(false)
  }

  async function inviteMember() {
    if (!inviteEmail.trim() || !team) return
    setLoading(true)
    setMsg("")
    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_id: team.id, email: inviteEmail }),
    })
    const json = await res.json()
    if (json.success) {
      setMsg(`Invite sent to ${inviteEmail}`)
      setInviteEmail("")
      if (json.data) setMembers((prev) => [...prev, json.data])
    } else {
      setMsg(json.error ?? "Failed")
    }
    setLoading(false)
  }

  async function removeMember(memberId: string) {
    await fetch(`/api/team/members/${memberId}`, { method: "DELETE" })
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  if (disabled) {
    return (
      <Card className="flex flex-col items-center gap-4 p-12 text-center">
        <Users className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Upgrade to Agency to create a team workspace.</p>
      </Card>
    )
  }

  if (!team) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Create your workspace</h2>
        <Label>Workspace name</Label>
        <Input className="mt-1.5" placeholder="My Agency" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        <Button className="mt-4" onClick={createTeam} disabled={loading}>
          {loading ? "Creating..." : "Create workspace"}
        </Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <h2 className="mb-1 text-lg font-semibold">{team.name}</h2>
        <p className="text-sm text-muted-foreground">{members.length}/10 members</p>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Members</h2>
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">{m.email}</p>
                <Badge variant="secondary" className="mt-0.5 text-xs capitalize">{m.role}</Badge>
              </div>
              {m.role !== "owner" && (
                <Button variant="ghost" size="sm" onClick={() => removeMember(m.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex gap-2">
          <Input placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && inviteMember()} />
          <Button onClick={inviteMember} disabled={loading || members.length >= 10}>
            <UserPlus className="mr-2 h-4 w-4" />Invite
          </Button>
        </div>
        {msg && <p className="mt-2 text-sm text-muted-foreground">{msg}</p>}
      </Card>
    </div>
  )
}
