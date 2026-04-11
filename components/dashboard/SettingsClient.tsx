"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PLANS } from "@/lib/stripe/plans"
import type { Plan } from "@/types/user"

interface Props {
  user: { id: string; email: string; plan: string }
}

export function SettingsClient({ user }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function upgrade(plan: "creator" | "agency") {
    setLoading(plan)
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
    const json = await res.json()
    if (json.success && json.data?.url) window.location.href = json.data.url
    else setLoading(null)
  }

  async function openPortal() {
    setLoading("portal")
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    const json = await res.json()
    if (json.success && json.data?.url) window.location.href = json.data.url
    else setLoading(null)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Account */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Account</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current plan</span>
            <Badge className="capitalize">{user.plan}</Badge>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Billing &amp; plans</h2>
        <div className="flex flex-col gap-4">
          {(["creator", "agency"] as ("creator" | "agency")[]).map((plan) => {
            const config = PLANS[plan]
            const isCurrent = user.plan === plan
            return (
              <div key={plan} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium capitalize">{plan}</p>
                  <p className="text-sm text-muted-foreground">${config.price}/mo — {plan === "creator" ? "unlimited repurposes, all platforms" : "everything + 10 team members"}</p>
                </div>
                {isCurrent ? (
                  <Badge>Current plan</Badge>
                ) : (
                  <Button size="sm" onClick={() => upgrade(plan)} disabled={loading === plan}>
                    {loading === plan ? "Redirecting..." : `Upgrade to ${plan}`}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
        <Separator className="my-4" />
        {user.plan !== "free" && (
          <Button variant="outline" size="sm" onClick={openPortal} disabled={loading === "portal"}>
            {loading === "portal" ? "Opening..." : "Manage subscription"}
          </Button>
        )}
      </Card>
    </div>
  )
}
