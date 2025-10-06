"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function DebugOnboardingPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [row, setRow] = useState<any>(null)

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: { user }, error: uErr } = await supabase.auth.getUser()
        if (uErr) throw uErr
        if (!user) {
          setLoading(false)
          return
        }
        setUserId(user.id)
        const { data, error } = await supabase
          .from("onboarding")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()
        if (error) throw error
        if (!alive) return
        setRow(data)
      } catch (e: any) {
        setError(e?.message ?? String(e))
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => { alive = false }
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">/debug/onboarding</h1>
        <p className="mt-2 text-gray-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">/debug/onboarding</h1>

      {!userId ? (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">You are not signed in.</p>
          <p className="text-sm text-yellow-800 mt-1">
            Go to <Link href="/login" className="underline text-blue-600">/login</Link> to sign in, then return here.
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          <div className="text-sm text-red-700 font-medium">Error</div>
          <pre className="text-xs mt-1 whitespace-pre-wrap break-all">{error}</pre>
        </div>
      ) : null}

      <div>
        <div className="text-sm text-gray-700">Signed in user_id:</div>
        <div className="font-mono text-sm">{userId ?? "<none>"}</div>
      </div>

      <div>
        <div className="text-sm text-gray-700">Onboarding row:</div>
        <pre className="text-xs bg-gray-50 rounded p-3 overflow-auto border border-gray-200">
{JSON.stringify(row, null, 2)}
        </pre>
      </div>
    </div>
  )
}
