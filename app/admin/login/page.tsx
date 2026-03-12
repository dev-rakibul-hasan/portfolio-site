"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const next = params.get("redirectedFrom") ?? "/admin";
    router.push(next);
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8">
        <h1 className="text-3xl">Admin Login</h1>
        <div className="mt-5 space-y-3">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </form>
    </section>
  );
}
