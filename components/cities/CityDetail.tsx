'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface City {
  id: number
  city_name: string
  slug: string
  population_estimate: number
  supporter_count: number
  city_type: string
  state: {
    state_code: string
    state_name: string
  }
  country: {
    iso2: string
    name: string
  }
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

interface District {
  id: number
  district_name: string
  slug: string
  district_type: string
  population_estimate: number
}

export default function CityDetail({ slug }: { slug: string }) {
  const [city, setCity] = useState<City | null>(null)
  const [topMembers, setTopMembers] = useState<TopMember[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCityData()
  }, [slug])

  async function loadCityData() {
    setLoading(true)
    const res = await fetch(`/api/cities/${slug}`)
    const data = await res.json()
    
    if (data.city) {
      setCity(data.city)
      setTopMembers(data.top_members || [])
      setDistricts(data.districts || [])
    }
    setLoading(false)
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num)
  }

  if (loading) {
    return <div className="text-center py-12 text-tmp-muted">Loading...</div>
  }

  if (!city) {
    return <div className="text-center py-12 text-tmp-muted">City not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-tmp-card border border-tmp-line rounded-tmp p-6 mb-6">
        <h1 className="text-4xl font-black mb-2">{city.city_name}</h1>
        <div className="flex flex-wrap gap-4 text-tmp-muted mb-4">
          <span>{city.state.state_name} ({city.state.state_code})</span>
          <span>{city.country.name}</span>
          <span>Type: {city.city_type}</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-black/40 p-4 rounded-tmp">
            <div className="text-tmp-muted text-sm">Population</div>
            <div className="text-2xl font-bold">{formatNumber(city.population_estimate)}</div>
          </div>
          <div className="bg-black/40 p-4 rounded-tmp">
            <div className="text-tmp-muted text-sm">Total Supporters</div>
            <div className="text-2xl font-bold text-tmp-gold">{formatNumber(city.supporter_count || 0)}</div>
          </div>
        </div>
      </div>

      {districts.length > 0 && (
        <div className="bg-tmp-card border border-tmp-line rounded-tmp p-6 mb-6">
          <h2 className="text-xl font-black mb-4">Districts & Boroughs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {districts.map(district => (
              <Link
                key={district.id}
                href={`/city/${city.slug}/district/${district.slug}`}
                className="bg-black/40 p-4 rounded-tmp hover:bg-white/5 transition"
              >
                <div className="font-semibold">{district.district_name}</div>
                <div className="text-sm text-tmp-muted mt-1">
                  {district.district_type} • Population: {formatNumber(district.population_estimate)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-tmp-card border border-tmp-line rounded-tmp p-6">
        <h2 className="text-xl font-black mb-4">Top Certified Members</h2>
        {topMembers.length === 0 ? (
          <p className="text-tmp-muted">No certified members yet</p>
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
