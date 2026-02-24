'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface City {
  id: number
  city_name: string
  slug: string
  state_code: string
}

interface Role {
  id: number
  key: string
  label: string
}

export default function OnboardingPage() {
  const [cities, setCities] = useState<City[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [cityId, setCityId] = useState<number | ''>('')
  const [roleId, setRoleId] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndLoadData()
  }, [])

  async function checkUserAndLoadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const [{ data: citiesData }, { data: rolesData }] = await Promise.all([
      supabase.from('cities').select('id, city_name, slug, state_code').order('city_name'),
      supabase.from('roles').select('id, key, label').order('label')
    ])

    setCities(citiesData || [])
    setRoles(rolesData || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        display_name: displayName,
        civic_city_id: cityId || null,
        primary_role_id: roleId || null,
      })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/gate')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-white">Loading...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-tmp-card border border-tmp-line rounded-tmp">
      <h1 className="text-2xl font-black mb-6 text-white">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-tmp-muted mb-1">Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
            placeholder="@username"
          />
        </div>
        <div>
          <label className="block text-sm text-tmp-muted mb-1">Display Name *</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-tmp-muted mb-1">City *</label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : '')}
            required
            className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.city_name}, {city.state_code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-tmp-muted mb-1">Primary Role *</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : '')}
            required
            className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-tmp-gold text-black font-black py-3 rounded-tmp hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
