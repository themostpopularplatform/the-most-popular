import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import VerifiedCheck from '@/components/badges/VerifiedCheck'

export default async function GatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const hasProfile = profile?.username && profile?.civic_city_id && profile?.primary_role_id
  const emailVerified = true
  const phoneVerified = profile?.phone_status === 'verified'

  const canEnter = hasProfile && emailVerified

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-tmp-card border border-tmp-line rounded-tmp">
      <h1 className="text-2xl font-black mb-6 text-white">Enter TMP</h1>
      <p className="text-sm text-tmp-muted mb-6">
        Complete these steps to access the network.
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-black/40 rounded-tmp">
          <div>
            <p className="font-semibold text-white">Profile</p>
            <p className="text-xs text-tmp-muted">Username + city + role</p>
          </div>
          <span className={hasProfile ? 'text-green-400' : 'text-yellow-400'}>
            {hasProfile ? '✓ Complete' : 'Required'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-black/40 rounded-tmp">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">Email</p>
            <VerifiedCheck className="h-4 w-4" />
          </div>
          <span className="text-green-400">Verified</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-black/40 rounded-tmp">
          <div>
            <p className="font-semibold text-white">Phone</p>
            <p className="text-xs text-tmp-muted">Optional</p>
          </div>
          <span className={phoneVerified ? 'text-green-400' : 'text-tmp-muted'}>
            {phoneVerified ? 'Verified' : 'Not verified'}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        {!hasProfile && (
          <Link
            href="/onboarding"
            className="flex-1 text-center bg-tmp-gold text-black font-black py-3 rounded-tmp hover:bg-yellow-600 transition"
          >
            Complete Profile
          </Link>
        )}
        {hasProfile && !phoneVerified && (
          <Link
            href="/verify/phone"
            className="flex-1 text-center border border-white/15 bg-white/5 text-white py-3 rounded-tmp hover:bg-white/10 transition"
          >
            Verify Phone
          </Link>
        )}
        {canEnter && (
          <Link
            href="/cities"
            className="flex-1 text-center bg-tmp-gold text-black font-black py-3 rounded-tmp hover:bg-yellow-600 transition"
          >
            Enter Cities
          </Link>
        )}
      </div>
    </div>
  )
}
