import Anthropic from '@anthropic-ai/sdk'
import { ExtractedContent, PlatformVariantsOutput } from '@/types/content'
import { PlatformKey, PLATFORM_CONSTRAINTS } from '@/types/platforms'
import { BrandVoice } from '@/types/user'

const client = new Anthropic()

export async function repurposeContent(
  extracted: ExtractedContent,
  platforms: PlatformKey[],
  brandVoice?: BrandVoice
): Promise<PlatformVariantsOutput> {
  // Pass 1 (Haiku): extract key message and bullets
  const summaryMessage = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: 'You are a content strategist. Extract the core message from the provided content.',
    messages: [
      {
        role: 'user',
        content: `Extract from this content:
- Key message (1 sentence)
- 5 bullet points
- Emotional hook
- CTA suggestion

Content: ${extracted.body.slice(0, 3000)}

Reply in JSON: { "key_message": "", "bullets": [], "hook": "", "cta": "" }`,
      },
    ],
  })

  const summaryText = summaryMessage.content[0].type === 'text'
    ? summaryMessage.content[0].text
    : '{}'
  let summary: { key_message: string; bullets: string[]; hook: string; cta: string }
  try {
    summary = JSON.parse(summaryText)
  } catch {
    summary = { key_message: extracted.title, bullets: extracted.key_points, hook: '', cta: '' }
  }

  // Pass 2 (Sonnet): generate all platform variants
  const constraintsText = platforms
    .map((p) => {
      const c = PLATFORM_CONSTRAINTS[p]
      return `- ${p}: max ${c.maxChars} chars, threads: ${c.supportsThread}, hashtags: ${c.maxHashtags}`
    })
    .join('\n')

  const brandVoiceText = brandVoice
    ? `Brand voice: tone=${brandVoice.tone ?? 'neutral'}, style=${brandVoice.style ?? 'default'}, keywords=${(brandVoice.keywords ?? []).join(', ')}`
    : 'Brand voice: professional and engaging'

  const variantsMessage = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: `You are an expert social media content creator. Generate platform-optimized posts.
${brandVoiceText}
Platform constraints:
${constraintsText}
Always return valid JSON matching the PlatformVariantsOutput schema.`,
    messages: [
      {
        role: 'user',
        content: `Repurpose this content for the platforms listed.

Key message: ${summary.key_message}
Bullets: ${summary.bullets.join('; ')}
Hook: ${summary.hook}
CTA: ${summary.cta}
Original title: ${extracted.title}

Return JSON:
{
  "platforms": {
    "<platform>": {
      "text": "",
      "thread_parts": [],
      "hashtags": [],
      "media_suggestion": "",
      "hook": "",
      "cta": ""
    }
  }
}`,
      },
    ],
  })

  const variantsText = variantsMessage.content[0].type === 'text'
    ? variantsMessage.content[0].text
    : '{}'

  try {
    const jsonMatch = variantsText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    return JSON.parse(jsonMatch[0]) as PlatformVariantsOutput
  } catch {
    return { platforms: {} }
  }
}
