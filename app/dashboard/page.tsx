"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardView from "@/components/dashboard-view"
import { supabase } from "@/lib/supabase"

type UserLike = {
  id: string
  email?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserLike | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!isMounted) return
      if (!user) {
        router.replace("/login")
        return
      }
      setUser({ id: user.id, email: user.email ?? undefined })
      setLoading(false)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/login")
      } else {
        setUser({ id: session.user.id, email: session.user.email ?? undefined })
      }
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      <div className="p-4 flex justify-end">
        <button
          className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
          onClick={async () => {
            await supabase.auth.signOut()
            router.replace("/login")
          }}
        >
          Sign out
        </button>
      </div>
      <DashboardView user={user as any} />
    </div>
  )
}
