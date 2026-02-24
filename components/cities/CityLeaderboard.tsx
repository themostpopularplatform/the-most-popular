'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface City {
  id: number
  city_name: string
  slug: string
  population_estimate: number
  supporter_count: number
  state: {
    state_code: string
    state_name: string
  }
}

interface State {
  state_code: string
  state_name: string
}

export default function CityLeaderboard() {
  const [cities, setCities] = useState<City[]>([])
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const state = searchParams.get('state') || ''
  const sort = searchParams.get('sort') || 'population'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20

  useEffect(() => {
    fetchCities()
  }, [state, sort, page])

  async function fetchCities() {
    setLoading(true)
    const params = new URLSearchParams({
      ...(state && { state }),
      sort,
      page: page.toString(),
      limit: limit.toString()
    })
    
    const res = await fetch(`/api/cities?${params}`)
    const data = await res.json()
    setCities(data.cities || [])
    setStates(data.states || [])
    setTotal(data.pagination?.total || 0)
    setLoading(false)
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/cities?${params.toString()}`)
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num)
  }

  const totalPages = Math.ceil(total / limit)

  if (loading) {
    return <div className="text-center py-12 text-tmp-muted">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-black mb-6">City Leaderboard</h1>
      
      <div className="bg-tmp-card border border-tmp-line rounded-tmp p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-tmp-muted mb-1">State</label>
            <select
              value={state}
              onChange={(e) => updateFilter('state', e.target.value)}
              className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
            >
              <option value="">All States</option>
              {states.map(s => (
                <option key={s.state_code} value={s.state_code}>
                  {s.state_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-tmp-muted mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
            >
              <option value="population">Population</option>
              <option value="supporters">Supporters</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-tmp-card border border-tmp-line rounded-tmp overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-tmp-line text-tmp-muted text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-5">City</div>
          <div className="col-span-2">State</div>
          <div className="col-span-2 text-right">Population</div>
          <div className="col-span-2 text-right">Supporters</div>
        </div>
        
        {cities.map((city, index) => (
          <Link
            key={city.id}
            href={`/city/${city.slug}`}
            className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition border-b border-tmp-line last:border-0"
          >
            <div className="col-span-1 font-bold text-tmp-gold">
              #{((page - 1) * limit) + index + 1}
            </div>
            <div className="col-span-5 font-semibold">{city.city_name}</div>
            <div className="col-span-2 text-tmp-muted">{city.state.state_code}</div>
            <div className="col-span-2 text-right">{formatNumber(city.population_estimate)}</div>
            <div className="col-span-2 text-right text-tmp-gold font-semibold">
              {formatNumber(city.supporter_count || 0)}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => updateFilter('page', (page - 1).toString())}
            disabled={page === 1}
            className="px-4 py-2 bg-tmp-card border border-tmp-line rounded-tmp disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => updateFilter('page', (page + 1).toString())}
            disabled={page === totalPages}
            className="px-4 py-2 bg-tmp-card border border-tmp-line rounded-tmp disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
