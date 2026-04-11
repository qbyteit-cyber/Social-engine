import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { extractContent } from '@/lib/ai/extract'
import { repurposeContent } from '@/lib/ai/repurpose'
import { createServiceClient } from '@/lib/supabase/server'
import { getPlatformsForPlan } from '@/lib/stripe/plans'
import { ApiResponse } from '@/types/content'

const schema = z.object({
  input_type: z.enum(['url', 'text', 'doc']),
  input_raw: z.string().min(1),
})

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = schema.safeParse(await req.json())
  if (!body.success) {
    return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Fetch user + enforce limits
  const { data: user } = await supabase
    .from('users')
    .select('id, plan, brand_voice')
    .eq('clerk_id', userId)
    .single()

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  // Check monthly usage for free plan
  if (user.plan === 'free') {
    const { data: usage } = await supabase
      .from('user_monthly_usage')
      .select('repurpose_count')
      .eq('user_id', user.id)
      .eq('month', new Date().toISOString().slice(0, 7) + '-01')
      .single()

    if (usage && usage.repurpose_count >= 5) {
      return NextResponse.json(
        { success: false, error: 'Monthly limit reached. Upgrade to continue.' },
        { status: 429 }
      )
    }
  }

  // Create job record
  const { data: job, error: jobError } = await supabase
    .from('content_jobs')
    .insert({
      user_id: user.id,
      input_type: body.data.input_type,
      input_raw: body.data.input_raw,
      status: 'generating',
    })
    .select('id')
    .single()

  if (jobError || !job) {
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 500 })
  }

  try {
    const extracted = await extractContent(body.data.input_type, body.data.input_raw)
    const platforms = getPlatformsForPlan(user.plan)
    const variants = await repurposeContent(extracted, platforms, user.brand_voice)

    // Persist variants
    const variantRows = Object.entries(variants.platforms).map(([platform, content]) => ({
      job_id: job.id,
      platform,
      content,
      status: 'draft',
    }))

    await supabase.from('platform_variants').insert(variantRows)
    await supabase.from('content_jobs').update({ status: 'ready', extracted }).eq('id', job.id)

    return NextResponse.json({ success: true, data: { job_id: job.id, variants } })
  } catch (err) {
    await supabase.from('content_jobs').update({ status: 'failed' }).eq('id', job.id)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
