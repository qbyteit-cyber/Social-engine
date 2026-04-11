import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"
import { createServiceClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase
    .from("users").select("id, email").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  // Find Stripe customer by email
  const customers = await stripe.customers.list({ email: user.email, limit: 1 })
  const customer = customers.data[0]
  if (!customer) return NextResponse.json({ success: false, error: "No billing account found" }, { status: 404 })

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  })

  return NextResponse.json({ success: true, data: { url: session.url } })
}
