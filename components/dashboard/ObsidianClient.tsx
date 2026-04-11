"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Check, RefreshCw, BookOpen } from "lucide-react"

interface Props {
  existingToken: string | null
  vaultName: string | null
  ingestUrl: string
}

export function ObsidianClient({ existingToken, vaultName: initialVaultName, ingestUrl }: Props) {
  const [token, setToken] = useState(existingToken)
  const [vaultName, setVaultName] = useState(initialVaultName ?? "")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function generateToken() {
    setGenerating(true)
    const res = await fetch("/api/obsidian/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vault_name: vaultName || null }),
    })
    const json = await res.json()
    if (json.success) setToken(json.data.token)
    setGenerating(false)
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const pluginCode = token ? `
// Obsidian QuickAdd macro — paste into a JS script in the QuickAdd plugin
const REPURPOSE_TOKEN = "${token}";
const INGEST_URL = "${ingestUrl}";

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) { new Notice("No active file"); return; }

  const content = await app.vault.read(activeFile);
  const title = activeFile.basename;

  const res = await fetch(INGEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: REPURPOSE_TOKEN, content, title }),
  });

  const json = await res.json();
  if (json.success) {
    new Notice("✓ Sent to Repurpose Engine! Opening review...");
    window.open(json.data.review_url, "_blank");
  } else {
    new Notice("Error: " + json.error);
  }
};`.trim() : ""

  return (
    <div className="flex flex-col gap-6">
      {/* Setup */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">1. Generate your sync token</h2>
        <div className="mb-4">
          <Label>Vault name (optional)</Label>
          <Input
            className="mt-1.5"
            placeholder="My Vault"
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
          />
        </div>
        <Button onClick={generateToken} disabled={generating}>
          <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
          {token ? "Regenerate token" : "Generate token"}
        </Button>

        {token && (
          <div className="mt-4">
            <Label>Your token</Label>
            <div className="mt-1.5 flex gap-2">
              <Input value={token} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="sm" onClick={() => copy(token, "token")}>
                {copied === "token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Keep this secret. Regenerating invalidates the old token.
            </p>
          </div>
        )}
      </Card>

      {token && (
        <>
          <Card className="p-6">
            <h2 className="mb-2 text-lg font-semibold">2. Install the QuickAdd plugin</h2>
            <p className="text-sm text-muted-foreground">
              In Obsidian, go to <strong>Settings → Community plugins → Browse</strong> and install <strong>QuickAdd</strong>.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="mb-2 text-lg font-semibold">3. Add the macro script</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              In QuickAdd, create a new <strong>Macro</strong>, add a <strong>Script</strong> step, and paste this code:
            </p>
            <div className="relative rounded-md bg-muted p-4">
              <pre className="overflow-x-auto text-xs">{pluginCode}</pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => copy(pluginCode, "code")}
              >
                {copied === "code" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-2 text-lg font-semibold">4. Run it</h2>
            <p className="text-sm text-muted-foreground">
              Open any note, trigger the QuickAdd macro (via the command palette or a hotkey),
              and your note will be sent to Repurpose Engine. A browser tab will open to the review page.
            </p>
            <Separator className="my-4" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">
                API endpoint: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{ingestUrl}</code>
              </p>
            </div>
          </Card>
        </>
      )}

      {/* Status */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant={token ? "default" : "secondary"}>
          {token ? "Connected" : "Not set up"}
        </Badge>
        {vaultName && <span>Vault: {vaultName}</span>}
      </div>
    </div>
  )
}
