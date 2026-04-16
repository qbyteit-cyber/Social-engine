import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe/client"

const PRICE_IDS: Record<string, string> = {
  creator: process.env.STRIPE_CREATOR_PRICE_ID ?? "",
  agency: process.env.STRIPE_AGENCY_PRICE_ID ?? "",
}

const schema = z.object({ plan: z.enum(["creator", "agency"]) })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: user } = await supabase.from("users").select("id, email").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  const priceId = PRICE_IDS[body.data.plan]
  if (!priceId) return NextResponse.json({ success: false, error: "Plan not configured" }, { status: 400 })

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { clerk_id: userId, plan: body.data.plan },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?billing=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?billing=cancel`,
  })

  return NextResponse.json({ success: true, data: { url: session.url } })
}
