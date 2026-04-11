"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Link2, Unlink } from "lucide-react"
import { getOAuthUrl } from "@/lib/platforms/oauth-urls"
import type { PlatformKey } from "@/types/platforms"

const PLATFORM_NAMES: Record<PlatformKey, string> = {
  linkedin: "LinkedIn", twitter: "X / Twitter", instagram: "Instagram",
  facebook: "Facebook", threads: "Threads", youtube: "YouTube",
  pinterest: "Pinterest", bluesky: "Bluesky", tiktok: "TikTok", newsletter: "Newsletter",
}

interface Props {
  platforms: PlatformKey[]
  connected: Record<string, { username?: string; connected_at: string }>
}

export function ConnectionsClient({ platforms, connected }: Props) {
  const [blueskyId, setBlueskyId] = useState("")
  const [blueskyPwd, setBlueskyPwd] = useState("")
  const [blueskyLoading, setBlueskyLoading] = useState(false)
  const [blueskyMsg, setBlueskyMsg] = useState("")

  async function connectBluesky() {
    setBlueskyLoading(true)
    setBlueskyMsg("")
    try {
      const res = await fetch("/api/oauth/bluesky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: blueskyId, password: blueskyPwd }),
      })
      const json = await res.json()
      if (json.success) {
        setBlueskyMsg("Connected!")
        window.location.reload()
      } else {
        setBlueskyMsg(json.error ?? "Failed")
      }
    } catch {
      setBlueskyMsg("Network error")
    } finally {
      setBlueskyLoading(false)
    }
  }

  async function disconnect(platform: PlatformKey) {
    await fetch(`/api/oauth/${platform}`, { method: "DELETE" })
    window.location.reload()
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {platforms.map((platform) => {
        const isConnected = !!connected[platform]
        const info = connected[platform]
        const oauthUrl = getOAuthUrl(platform)

        return (
          <Card key={platform} className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{PLATFORM_NAMES[platform]}</span>
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                </Badge>
              ) : (
                <Badge variant="secondary">Not connected</Badge>
              )}
            </div>

            {isConnected && info.username && (
              <p className="text-sm text-muted-foreground">@{info.username}</p>
            )}

            {platform === "bluesky" && !isConnected && (
              <div className="flex flex-col gap-2">
                <div>
                  <Label className="text-xs">Handle or email</Label>
                  <Input placeholder="you.bsky.social" value={blueskyId} onChange={(e) => setBlueskyId(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">App password</Label>
                  <Input type="password" placeholder="xxxx-xxxx-xxxx-xxxx" value={blueskyPwd} onChange={(e) => setBlueskyPwd(e.target.value)} className="mt-1" />
                </div>
                {blueskyMsg && <p className="text-xs text-muted-foreground">{blueskyMsg}</p>}
                <Button size="sm" onClick={connectBluesky} disabled={blueskyLoading}>
                  {blueskyLoading ? "Connecting..." : "Connect Bluesky"}
                </Button>
              </div>
            )}

            {platform !== "bluesky" && platform !== "newsletter" && (
              isConnected ? (
                <Button variant="outline" size="sm" onClick={() => disconnect(platform)}>
                  <Unlink className="mr-2 h-3.5 w-3.5" /> Disconnect
                </Button>
              ) : oauthUrl ? (
                <Button size="sm" asChild>
                  <a href={oauthUrl}><Link2 className="mr-2 h-3.5 w-3.5" /> Connect with OAuth</a>
                </Button>
              ) : (
                <Button size="sm" disabled variant="outline">Coming soon</Button>
              )
            )}

            {platform === "newsletter" && (
              <Button size="sm" disabled variant="outline">API key — coming soon</Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}
