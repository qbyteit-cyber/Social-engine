"use client"

import { useState } from "react"
import { PlatformCard } from "./PlatformCard"
import type { PlatformVariantsOutput, PlatformVariant } from "@/types/content"
import type { PlatformKey } from "@/types/platforms"

interface VariantRow {
  id: string
  content: PlatformVariant
}

interface Props {
  jobId: string
  initial: PlatformVariantsOutput
  variantIds: Record<string, string>          // platform → variant DB row id
  connectedPlatforms: string[]
  canSchedule: boolean
}

export function VariantsEditor({ jobId: _jobId, initial, variantIds, connectedPlatforms, canSchedule }: Props) {
  const [variants, setVariants] = useState<Record<string, VariantRow>>(() => {
    const map: Record<string, VariantRow> = {}
    for (const [platform, content] of Object.entries(initial.platforms)) {
      map[platform] = { id: variantIds[platform] ?? "", content: content as PlatformVariant }
    }
    return map
  })

  function handleUpdate(platform: PlatformKey, updated: PlatformVariant) {
    setVariants((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], content: updated },
    }))
  }

  const entries = Object.entries(variants) as [PlatformKey, VariantRow][]

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-muted-foreground">No variants found for this job.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map(([platform, row]) => (
        <PlatformCard
          key={platform}
          platform={platform}
          variantId={row.id}
          variant={row.content}
          isConnected={connectedPlatforms.includes(platform)}
          canSchedule={canSchedule}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}
