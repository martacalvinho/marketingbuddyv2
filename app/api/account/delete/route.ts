import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader?.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = userData.user.id

    // Delete auth user
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 })
    }

    // Best-effort cleanup of subscription rows (ignore errors)
    try {
      await supabaseAdmin.from("subscriptions").delete().eq("user_id", userId)
    } catch (e) {
      console.warn("Subscriptions cleanup skipped:", e)
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Delete account failed:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
