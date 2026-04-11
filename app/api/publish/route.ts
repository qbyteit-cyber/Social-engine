import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { ApiResponse } from "@/types/content"

const schema = z.object({
  variant_id: z.string().uuid(),
})

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ success: false, error: body.error.message }, { status: 400 })

  const supabase = await createServiceClient()

  const { data: user } = await supabase
    .from("users").select("id").eq("clerk_id", userId).single()
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })

  // Delegate to schedule route as immediate publish
  const scheduleRes = await fetch(new URL("/api/schedule", req.url).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: req.headers.get("cookie") ?? "" },
    body: JSON.stringify({ variant_id: body.data.variant_id }),
  })

  const result = await scheduleRes.json()
  return NextResponse.json(result, { status: scheduleRes.status })
}
