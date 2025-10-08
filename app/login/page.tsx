"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      // After auth, decide where to go based on onboarding
      const redirect = searchParams.get("redirect") ?? undefined;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: onboarding, error } = await supabase
          .from("onboarding")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .maybeSingle();
        const incomplete = !!(error || !onboarding || onboarding.onboarding_completed !== true);
        const desired = redirect ?? "/dashboard";
        if (incomplete) {
          router.replace(`/onboarding?redirect=${encodeURIComponent(desired)}`);
        } else {
          router.replace(desired);
        }
      } else {
        const desired = redirect ?? "/dashboard";
        router.replace(`/onboarding?redirect=${encodeURIComponent(desired)}`);
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow p-6">
        <h1 className="text-2xl font-semibold mb-1">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === "signin" ? "Use your email and password" : "Register with email and password"}
        </p>
        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          {mode === "signin" ? (
            <button className="text-indigo-600 hover:underline" onClick={() => setMode("signup")}>New here? Create an account</button>
          ) : (
            <button className="text-indigo-600 hover:underline" onClick={() => setMode("signin")}>Have an account? Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
