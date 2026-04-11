"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { X, Plus, CheckCircle2, Brain } from "lucide-react"
import type { BrandVoice } from "@/types/user"

const TONES = ["Professional", "Conversational", "Authoritative", "Friendly", "Bold", "Witty", "Empathetic", "Inspirational"]
const STYLES = ["Long-form", "Short & punchy", "Story-driven", "Data-led", "Question-based", "List-style", "Personal narrative"]

interface Props {
  initial: BrandVoice
  samples: { platform: string; created_at: string; approved: boolean }[]
  disabled: boolean
}

export function BrandVoiceClient({ initial, samples, disabled }: Props) {
  const [voice, setVoice] = useState<BrandVoice>(initial)
  const [newKeyword, setNewKeyword] = useState("")
  const [newExample, setNewExample] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/brand-voice", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voice),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }

  function addKeyword() {
    const kw = newKeyword.trim()
    if (!kw) return
    setVoice((v) => ({ ...v, keywords: [...(v.keywords ?? []), kw] }))
    setNewKeyword("")
  }

  function removeKeyword(kw: string) {
    setVoice((v) => ({ ...v, keywords: (v.keywords ?? []).filter((k) => k !== kw) }))
  }

  function addExample() {
    const ex = newExample.trim()
    if (!ex) return
    setVoice((v) => ({ ...v, examples: [...(v.examples ?? []), ex] }))
    setNewExample("")
  }

  function removeExample(i: number) {
    setVoice((v) => ({ ...v, examples: (v.examples ?? []).filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tone & Style */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Tone &amp; style</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Primary tone</Label>
            <Select value={voice.tone ?? ""} onValueChange={(v) => setVoice((prev) => ({ ...prev, tone: v }))} disabled={disabled}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select tone" /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Writing style</Label>
            <Select value={voice.style ?? ""} onValueChange={(v) => setVoice((prev) => ({ ...prev, style: v }))} disabled={disabled}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select style" /></SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Keywords */}
      <Card className="p-6">
        <h2 className="mb-1 text-lg font-semibold">Power keywords</h2>
        <p className="mb-4 text-sm text-muted-foreground">Words and phrases Claude should weave into your posts.</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {(voice.keywords ?? []).map((kw) => (
            <Badge key={kw} variant="secondary" className="gap-1 pr-1">
              {kw}
              {!disabled && (
                <button onClick={() => removeKeyword(kw)} className="ml-0.5 rounded hover:bg-muted-foreground/20">
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
        {!disabled && (
          <div className="flex gap-2">
            <Input placeholder="Add keyword..." value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()} />
            <Button variant="outline" size="sm" onClick={addKeyword}><Plus className="h-4 w-4" /></Button>
          </div>
        )}
      </Card>

      {/* Example posts */}
      <Card className="p-6">
        <h2 className="mb-1 text-lg font-semibold">Example posts</h2>
        <p className="mb-4 text-sm text-muted-foreground">Paste 2–3 of your best posts so Claude can match your voice.</p>
        <div className="flex flex-col gap-3">
          {(voice.examples ?? []).map((ex, i) => (
            <div key={i} className="relative rounded-md border bg-muted/30 p-3 text-sm">
              <p className="whitespace-pre-wrap pr-6">{ex}</p>
              {!disabled && (
                <button onClick={() => removeExample(i)} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {!disabled && (
          <div className="mt-3 flex flex-col gap-2">
            <Textarea placeholder="Paste an example post..." value={newExample} onChange={(e) => setNewExample(e.target.value)} className="min-h-[100px]" />
            <Button variant="outline" size="sm" className="self-start" onClick={addExample}>Add example</Button>
          </div>
        )}
      </Card>

      {/* Save */}
      {!disabled && (
        <Button onClick={handleSave} disabled={saving} className="self-start">
          {saved ? <><CheckCircle2 className="mr-2 h-4 w-4" />Saved</> : saving ? "Saving..." : "Save brand voice"}
        </Button>
      )}

      <Separator />

      {/* AI learning log */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI learning log</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Every time you edit or approve a generated post, Claude extracts tone signals and updates your brand voice automatically.
        </p>
        {samples.length === 0 ? (
          <p className="text-sm text-muted-foreground">No learning events yet. Approve your first variant to start.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {samples.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">{s.platform}</Badge>
                  <span className="text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
                <Badge variant={s.approved ? "default" : "secondary"} className="text-xs">
                  {s.approved ? "Approved" : "Edited"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
