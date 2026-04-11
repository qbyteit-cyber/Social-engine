"use client"

import { useState } from "react"
import { PlatformCard } from "./PlatformCard"
import type { PlatformVariantsOutput, PlatformVariant } from "@/types/content"
import type { PlatformKey } from "@/types/platforms"

interface Props {
  jobId: string
  initial: PlatformVariantsOutput
}

export function VariantsEditor({ jobId: _jobId, initial }: Props) {
  const [variants, setVariants] = useState(initial.platforms)

  function handleUpdate(platform: PlatformKey, updated: PlatformVariant) {
    setVariants((prev) => ({ ...prev, [platform]: updated }))
  }

  const entries = Object.entries(variants) as [PlatformKey, PlatformVariant][]

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-muted-foreground">No variants found for this job.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map(([platform, variant]) => (
        <PlatformCard
          key={platform}
          platform={platform}
          variant={variant}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}
