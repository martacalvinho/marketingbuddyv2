"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Rocket, Loader2, Chrome, Twitter } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    const redirect = searchParams.get("redirect") || "/onboarding"
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setMessage(error.message)
    } else if (data.session) {
      router.push(redirect)
      return
    } else {
      setMessage("Account created. Please check your email to confirm, then log in.")
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleXSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-40" />

      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Rocket className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your Marketing Buddy account</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-950 border-slate-800 text-white h-12 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950 border-slate-800 text-white h-12 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-slate-950 hover:bg-indigo-50 font-bold rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign up with Email"}
          </Button>

          {message && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-300 text-center">
              {message}
            </div>
          )}
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignup}
            className="w-full h-12 bg-transparent border-slate-700 text-slate-200 hover:bg-white/5 hover:text-white"
          >
            <Chrome className="w-4 h-4 mr-2" /> Sign up with Google
          </Button>
          <Button
            variant="outline"
            onClick={handleXSignup}
            className="w-full h-12 bg-transparent border-slate-700 text-slate-200 hover:bg-white/5 hover:text-white"
          >
            <Twitter className="w-4 h-4 mr-2" /> Sign up with X
          </Button>
        </div>
      </Card>
    </div>
  )
}
