export type AuthorityLevel = 'visitor' | 'registered' | 'verified' | 'certified' | 'legendary'

export interface City {
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

export interface District {
  id: number
  district_name: string
  slug: string
  district_type: string
  population_estimate: number
}

export interface Role {
  id: number
  key: string
  label: string
  weight: number
}

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  authority: AuthorityLevel
  primary_role_id: number | null
  is_public: boolean
  is_admin: boolean
  civic_city_id: number | null
  civic_district_id: number | null
  supporter_count: number
  email_status: string
  phone_status: string
  created_at: string
  updated_at: string
}
