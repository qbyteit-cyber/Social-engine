"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, Pencil, Send, Calendar } from "lucide-react"
import type { PlatformVariant } from "@/types/content"
import type { PlatformKey } from "@/types/platforms"

interface Props {
  platform: PlatformKey
  variantId: string
  variant: PlatformVariant
  isConnected: boolean
  canSchedule: boolean
  onUpdate?: (platform: PlatformKey, updated: PlatformVariant) => void
}

const DISPLAY_NAME: Record<PlatformKey, string> = {
  linkedin: "LinkedIn", twitter: "X / Twitter", instagram: "Instagram",
  facebook: "Facebook", threads: "Threads", youtube: "YouTube",
  pinterest: "Pinterest", bluesky: "Bluesky", tiktok: "TikTok", newsletter: "Newsletter",
}

export function PlatformCard({ platform, variantId, variant, isConnected, canSchedule, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(variant.text)
  const [copied, setCopied] = useState(false)
  const [publishState, setPublishState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [publishMsg, setPublishMsg] = useState("")

  function handleSave() {
    onUpdate?.(platform, { ...variant, text })
    setEditing(false)
  }

  async function handleCopy() {
    const tags = variant.hashtags?.length ? "\n\n" + variant.hashtags.map((h) => `#${h}`).join(" ") : ""
    await navigator.clipboard.writeText(text + tags)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handlePublish() {
    setPublishState("loading")
    setPublishMsg("")
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: variantId }),
      })
      const json = await res.json()
      if (json.success) {
        setPublishState("done")
        setPublishMsg("Published!")
      } else {
        setPublishState("error")
        setPublishMsg(json.error ?? "Failed")
      }
    } catch {
      setPublishState("error")
      setPublishMsg("Network error")
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold">{DISPLAY_NAME[platform]}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)} title="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Body */}
      {editing ? (
        <div className="flex flex-col gap-2">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[140px] text-sm" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setText(variant.text); setEditing(false) }}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{text}</p>
      )}

      {/* Hashtags */}
      {variant.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {variant.hashtags.slice(0, 8).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
          ))}
        </div>
      )}

      {/* Hook */}
      {variant.hook && (
        <p className="border-t pt-3 text-xs text-muted-foreground">
          <span className="font-medium">Hook: </span>{variant.hook}
        </p>
      )}

      {/* Publish actions */}
      {publishState === "done" ? (
        <p className="flex items-center gap-1 text-sm text-green-600"><Check className="h-4 w-4" />{publishMsg}</p>
      ) : publishState === "error" ? (
        <p className="text-sm text-destructive">{publishMsg}</p>
      ) : isConnected ? (
        <div className="flex gap-2 border-t pt-3">
          <Button size="sm" variant="default" onClick={handlePublish} disabled={publishState === "loading"} className="flex-1">
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {publishState === "loading" ? "Publishing..." : "Publish now"}
          </Button>
          {canSchedule && (
            <Button size="sm" variant="outline" disabled title="Schedule — coming soon">
              <Calendar className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ) : (
        <p className="border-t pt-3 text-xs text-muted-foreground">
          <a href="/connections" className="text-primary hover:underline">Connect {DISPLAY_NAME[platform]}</a> to publish
        </p>
      )}
    </Card>
  )
}
