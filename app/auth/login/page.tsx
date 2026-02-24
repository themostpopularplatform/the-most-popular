'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/gate'
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-tmp-card border border-tmp-line rounded-tmp">
      <h1 className="text-2xl font-black mb-6 text-white">Log In</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-tmp-muted mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-tmp-muted mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tmp-gold text-black font-black py-3 rounded-tmp hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-sm text-tmp-muted text-center">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-tmp-gold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
