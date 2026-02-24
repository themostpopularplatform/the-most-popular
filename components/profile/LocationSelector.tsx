'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface City {
  id: number
  city_name: string
  slug: string
  state_code: string
}

interface District {
  id: number
  district_name: string
  slug: string
  city_id: number
}

interface CurrentLocation {
  civic_city_id: number | null
  civic_district_id: number | null
  city?: { city_name: string; slug: string }
  district?: { district_name: string; slug: string }
}

export default function LocationSelector() {
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedCityId, setSelectedCityId] = useState<number | ''>('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | ''>('')
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCityId) {
      loadDistricts(selectedCityId as number)
    } else {
      setDistricts([])
      setSelectedDistrictId('')
    }
  }, [selectedCityId])

  async function loadData() {
    setLoading(true)
    
    try {
      const citiesRes = await fetch('/api/cities?limit=1000&sort=population')
      const citiesData = await citiesRes.json()
      setCities(citiesData.cities || [])

      const locationRes = await fetch('/api/profile/location')
      const locationData = await locationRes.json()
      setCurrentLocation(locationData)
      
      if (locationData.civic_city_id) {
        setSelectedCityId(locationData.civic_city_id)
        await loadDistricts(locationData.civic_city_id)
        setSelectedDistrictId(locationData.civic_district_id || '')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadDistricts(cityId: number) {
    try {
      const res = await fetch(`/api/cities/districts?cityId=${cityId}`)
      const data = await res.json()
      setDistricts(data.districts || [])
    } catch (error) {
      console.error('Error loading districts:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/profile/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCityId || null,
          districtId: selectedDistrictId || null
        })
      })

      if (res.ok) {
        setMessage('Location saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await res.json()
        setMessage(error.error || 'Error saving location')
      }
    } catch (error) {
      setMessage('Error saving location')
    } finally {
      setSaving(false)
      router.refresh()
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-tmp-muted">Loading...</div>
  }

  return (
    <div className="bg-tmp-card border border-tmp-line rounded-tmp p-6">
      <h2 className="text-xl font-black mb-4 text-white">Your Civic Location</h2>
      
      {currentLocation?.city && (
        <div className="mb-6 p-4 bg-black/40 rounded-tmp">
          <p className="text-sm text-tmp-muted mb-1">Current Location:</p>
          <p className="font-semibold text-white">{currentLocation.city.city_name}</p>
          {currentLocation.district && (
            <p className="text-sm text-tmp-gold mt-1">{currentLocation.district.district_name}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-tmp-muted mb-1">City *</label>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : '')}
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

        {districts.length > 0 && (
          <div>
            <label className="block text-sm text-tmp-muted mb-1">District (optional)</label>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-black/40 border border-tmp-line rounded-tmp px-3 py-2 text-white"
            >
              <option value="">Select a district</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {message && (
          <div className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-tmp-gold text-black font-black py-3 rounded-tmp hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Location'}
        </button>
      </form>
    </div>
  )
}
