"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, go onboarding
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/onboarding");
    });
  }, [router, supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;

        setMsg("Signup successful! Check your email to confirm your account.");
        // Don't redirect immediately - wait for email confirmation
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        router.push("/onboarding");
      }
    } catch (err: any) {
      setMsg(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>The Most Popular™</h1>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        {mode === "signup" ? "Create your account" : "Log in"}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button 
          onClick={() => setMode("signup")} 
          disabled={mode === "signup"}
          style={{
            padding: "8px 16px",
            background: mode === "signup" ? "#B8860B" : "#333",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Sign up
        </button>
        <button 
          onClick={() => setMode("login")} 
          disabled={mode === "login"}
          style={{
            padding: "8px 16px",
            background: mode === "login" ? "#B8860B" : "#333",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Log in
        </button>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{
            padding: "10px",
            background: "#222",
            border: "1px solid #333",
            color: "white",
            borderRadius: 4
          }}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={6}
          style={{
            padding: "10px",
            background: "#222",
            border: "1px solid #333",
            color: "white",
            borderRadius: 4
          }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: "12px",
            background: "#B8860B",
            color: "black",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "..." : mode === "signup" ? "Create Account" : "Log In"}
        </button>

        {msg && <p style={{ color: "#ff6b6b", marginTop: 10 }}>{msg}</p>}
      </form>
    </main>
  );
}