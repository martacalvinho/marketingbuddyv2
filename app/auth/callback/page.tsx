"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const redirect = searchParams.get("redirect") || "/dashboard"

      // If Supabase already has a session, just redirect
      const { data: existingSession } = await supabase.auth.getSession()
      if (existingSession.session) {
        router.replace(redirect)
        return
      }

      if (!code) {
        setError("Missing OAuth code. Please try signing in again.")
        return
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        setError(exchangeError.message)
        return
      }

      router.replace(redirect)
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020604] text-white">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold">Authentication error</h1>
          <p className="text-sm text-neutral-300">{error}</p>
          <button
            className="px-4 py-2 rounded-md bg-lime-500 text-black font-semibold"
            onClick={() => router.replace("/login")}
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020604] text-white">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-lime-400" />
        <p className="text-sm text-neutral-300">Finalizing sign-in…</p>
      </div>
    </div>
  )
}
