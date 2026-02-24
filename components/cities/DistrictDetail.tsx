'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface District {
  id: number
  district_name: string
  slug: string
  district_type: string
  population_estimate: number
}

interface TopMember {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  authority: string
  supporter_count: number
  role: {
    key: string
    label: string
  }
}

export default function DistrictDetail({ 
  citySlug, 
  districtSlug 
}: { 
  citySlug: string
  districtSlug: string 
}) {
  const [cityName, setCityName] = useState('')
  const [district, setDistrict] = useState<District | null>(null)
  const [topMembers, setTopMembers] = useState<TopMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDistrictData()
  }, [citySlug, districtSlug])

  async function loadDistrictData() {
    setLoading(true)
    const res = await fetch(`/api/cities/${citySlug}/districts/${districtSlug}`)
    const data = await res.json()
    
    if (data.district) {
      setCityName(data.city)
      setDistrict(data.district)
      setTopMembers(data.top_members || [])
    }
    setLoading(false)
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num)
  }

  if (loading) {
    return <div className="text-center py-12 text-tmp-muted">Loading...</div>
  }

  if (!district) {
    return <div className="text-center py-12 text-tmp-muted">District not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <Link href={`/city/${citySlug}`} className="text-tmp-gold hover:underline mb-2 inline-block">
          ← Back to {cityName}
        </Link>
        <h1 className="text-4xl font-black">{district.district_name}</h1>
        <p className="text-tmp-muted mt-1">
          {district.district_type} • Population: {formatNumber(district.population_estimate)}
        </p>
      </div>

      <div className="bg-tmp-card border border-tmp-line rounded-tmp p-6">
        <h2 className="text-xl font-black mb-4">Top Members in {district.district_name}</h2>
        {topMembers.length === 0 ? (
          <p className="text-tmp-muted">No members in this district yet</p>
        ) : (
          <div className="space-y-3">
            {topMembers.map((member, index) => (
              <Link
                key={member.id}
                href={`/profile/${member.id}`}
                className="flex items-center justify-between p-3 bg-black/40 rounded-tmp hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-tmp-gold font-bold w-6">#{index + 1}</span>
                  <div>
                    <div className="font-semibold">{member.display_name || member.username}</div>
                    <div className="text-xs text-tmp-muted">{member.role?.label || 'Member'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-tmp-gold">{formatNumber(member.supporter_count)}</div>
                  <div className="text-xs text-tmp-muted">supporters</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
