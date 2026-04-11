"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, Pencil } from "lucide-react"
import type { PlatformVariant } from "@/types/content"
import type { PlatformKey } from "@/types/platforms"

interface Props {
  platform: PlatformKey
  variant: PlatformVariant
  onUpdate?: (platform: PlatformKey, updated: PlatformVariant) => void
}

export function PlatformCard({ platform, variant, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(variant.text)
  const [copied, setCopied] = useState(false)

  function handleSave() {
    onUpdate?.(platform, { ...variant, text })
    setEditing(false)
  }

  async function handleCopy() {
    const full = [text, ...(variant.hashtags.length ? [variant.hashtags.map((h) => `#${h}`).join(" ")] : [])].join("\n\n")
    await navigator.clipboard.writeText(full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayName: Record<PlatformKey, string> = {
    linkedin: "LinkedIn", twitter: "X / Twitter", instagram: "Instagram",
    facebook: "Facebook", threads: "Threads", youtube: "YouTube",
    pinterest: "Pinterest", bluesky: "Bluesky", tiktok: "TikTok", newsletter: "Newsletter",
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{displayName[platform]}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-col gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[140px] text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setText(variant.text); setEditing(false) }}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{text}</p>
      )}

      {variant.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {variant.hashtags.slice(0, 8).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
          ))}
        </div>
      )}

      {variant.hook && (
        <p className="border-t pt-3 text-xs text-muted-foreground">
          <span className="font-medium">Hook: </span>{variant.hook}
        </p>
      )}
    </Card>
  )
}
