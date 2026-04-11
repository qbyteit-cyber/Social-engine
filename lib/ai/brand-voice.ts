import Anthropic from "@anthropic-ai/sdk"
import { createServiceClient } from "@/lib/supabase/server"
import type { BrandVoice } from "@/types/user"

const client = new Anthropic()

/**
 * Called after a user approves or edits a variant.
 * Analyses the sample to evolve the stored brand voice profile.
 */
export async function learnFromSample(
  userId: string,
  platform: string,
  originalText: string,
  editedText: string,
  currentVoice: BrandVoice
): Promise<BrandVoice> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: "You are a brand voice analyst. Given an original AI draft and the human-edited version, extract tone/style signals and update the brand voice profile. Return only valid JSON.",
    messages: [
      {
        role: "user",
        content: `Platform: ${platform}
Original draft:
${originalText}

Human-edited version:
${editedText}

Current brand voice profile:
${JSON.stringify(currentVoice)}

Analyse the difference. What does the edit reveal about the user's preferred tone, style, and vocabulary?
Return updated brand voice JSON: { "tone": "", "style": "", "keywords": [], "examples": [] }
Keep existing keywords unless the edit contradicts them. Add at most 3 new keywords per call.`,
      },
    ],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : "{}"
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return currentVoice
    const updated = JSON.parse(match[0]) as BrandVoice

    // Deduplicate keywords
    if (updated.keywords && currentVoice.keywords) {
      updated.keywords = [...new Set([...currentVoice.keywords, ...updated.keywords])].slice(0, 20)
    }
    if (updated.examples && currentVoice.examples) {
      updated.examples = [...new Set([...currentVoice.examples, ...(updated.examples ?? [])])].slice(0, 10)
    }

    return updated
  } catch {
    return currentVoice
  }
}

/**
 * Persist brand voice sample and trigger async learning.
 */
export async function recordApproval(
  userId: string,
  variantId: string,
  originalText: string,
  editedText: string
) {
  const supabase = await createServiceClient()

  const { data: variant } = await supabase
    .from("platform_variants")
    .select("platform, job_id")
    .eq("id", variantId)
    .single()

  if (!variant) return

  // Save sample
  await supabase.from("brand_voice_samples").insert({
    user_id: userId,
    platform: variant.platform,
    original_text: originalText,
    edited_text: editedText,
    approved: true,
  })

  // Update variant status to approved
  await supabase.from("platform_variants").update({ status: "approved" }).eq("id", variantId)

  // Load current brand voice and evolve it
  const { data: user } = await supabase
    .from("users")
    .select("id, brand_voice")
    .eq("id", userId)
    .single()

  if (!user) return

  const currentVoice: BrandVoice = (user.brand_voice as BrandVoice) ?? {}
  const updatedVoice = await learnFromSample(
    userId,
    variant.platform,
    originalText,
    editedText,
    currentVoice
  )

  await supabase.from("users").update({ brand_voice: updatedVoice }).eq("id", userId)
}
