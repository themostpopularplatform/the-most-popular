'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PhoneVerifyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleVerify = async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ phone_status: 'verified' })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
    } else {
      router.push('/gate')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-tmp-card border border-tmp-line rounded-tmp">
      <h1 className="text-2xl font-black mb-6 text-white">Phone Verification</h1>
      <p className="text-sm text-tmp-muted mb-6">
        Verify your phone number to unlock additional features.
      </p>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-tmp-gold text-black font-black py-3 rounded-tmp hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Mark as Verified (Demo)'}
      </button>
      <p className="mt-4 text-xs text-tmp-muted text-center">
        This is a placeholder. In production, you would enter an SMS code.
      </p>
    </div>
  )
}
