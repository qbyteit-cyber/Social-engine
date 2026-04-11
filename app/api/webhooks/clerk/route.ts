import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

interface ClerkUserCreated {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string; id: string }>
    primary_email_address_id: string
  }
}

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as ClerkUserCreated

  if (payload.type !== "user.created") {
    return NextResponse.json({ received: true })
  }

  const { id, email_addresses, primary_email_address_id } = payload.data
  const email = email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ?? ""

  const supabase = await createServiceClient()

  const { error } = await supabase.from("users").upsert(
    { clerk_id: id, email, plan: "free" },
    { onConflict: "clerk_id" }
  )

  if (error) {
    console.error("Clerk webhook: failed to upsert user", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
