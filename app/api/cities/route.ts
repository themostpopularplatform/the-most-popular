import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const searchParams = req.nextUrl.searchParams
  
  const stateCode = searchParams.get('state')
  const sortBy = searchParams.get('sort') || 'population'
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')
  const offset = (page - 1) * limit

  let query = supabase
    .from('cities')
    .select(`
      id,
      city_name,
      slug,
      population_estimate,
      supporter_count,
      state:us_states (
        state_code,
        state_name
      )
    `, { count: 'exact' })
    .eq('is_active', true)

  if (stateCode) {
    query = query.eq('us_states.state_code', stateCode.toUpperCase())
  }

  if (sortBy === 'supporters') {
    query = query.order('supporter_count', { ascending: false, nullsLast: true })
  } else {
    query = query.order('population_estimate', { ascending: false, nullsLast: true })
  }

  const { data: cities, error, count } = await query
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: states } = await supabase
    .from('us_states')
    .select('state_code, state_name')
    .order('state_name')

  return NextResponse.json({
    cities: cities || [],
    states: states || [],
    pagination: {
      page,
      limit,
      total: count || 0
    }
  })
}
