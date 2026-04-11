"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import type { InputType } from "@/types/content"

export function CreateForm() {
  const router = useRouter()
  const [tab, setTab] = useState<InputType>("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let input_raw = ""

      if (tab === "url") {
        input_raw = url.trim()
      } else if (tab === "text") {
        input_raw = text.trim()
      } else if (tab === "doc" && file) {
        const buf = await file.arrayBuffer()
        input_raw = Buffer.from(buf).toString("base64")
      }

      if (!input_raw) {
        setError("Please provide content to repurpose.")
        return
      }

      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_type: tab, input_raw }),
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Generation failed")

      router.push(`/review/${json.data.job_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as InputType)}>
        <TabsList className="w-full">
          <TabsTrigger value="url" className="flex-1">URL</TabsTrigger>
          <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
          <TabsTrigger value="doc" className="flex-1">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-4">
          <Label htmlFor="url">Article or page URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/my-blog-post"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1.5"
          />
        </TabsContent>

        <TabsContent value="text" className="mt-4">
          <Label htmlFor="text">Paste your content</Label>
          <Textarea
            id="text"
            placeholder="Paste your blog post, newsletter, script, or any text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1.5 min-h-[220px]"
          />
        </TabsContent>

        <TabsContent value="doc" className="mt-4">
          <Label htmlFor="doc">Upload a PDF or Word document</Label>
          <Input
            id="doc"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1.5"
          />
          {file && <p className="mt-2 text-sm text-muted-foreground">Selected: {file.name}</p>}
        </TabsContent>
      </Tabs>

      {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <p className="text-center text-sm text-muted-foreground">
            Extracting content and generating 10 platform variants...
          </p>
        </div>
      ) : (
        <Button type="submit" size="lg" className="w-full">
          <Loader2 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : "hidden"}`} />
          Generate all 10 variants
        </Button>
      )}
    </form>
  )
}
