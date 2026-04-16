import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const clerkId = subscription.metadata?.clerk_id
      if (!clerkId) break

      const plan = event.type === 'customer.subscription.deleted'
        ? 'free'
        : subscription.status === 'active'
          ? (subscription.metadata?.plan ?? 'free')
          : 'free'

      await supabase.from('users').update({ plan }).eq('clerk_id', clerkId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
