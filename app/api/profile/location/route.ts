import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      civic_city_id,
      civic_district_id,
      city:civic_city_id (
        id,
        city_name,
        slug
      ),
      district:civic_district_id (
        id,
        district_name,
        slug
      )
    `)
    .eq('id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profile)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cityId, districtId } = await req.json()

  if (cityId) {
    const { data: city, error: cityError } = await supabase
      .from('cities')
      .select('id')
      .eq('id', cityId)
      .single()

    if (cityError || !city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }
  }

  if (districtId && cityId) {
    const { data: district, error: districtError } = await supabase
      .from('city_districts')
      .select('id')
      .eq('id', districtId)
      .eq('city_id', cityId)
      .single()

    if (districtError || !district) {
      return NextResponse.json({ error: 'District not found for this city' }, { status: 404 })
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      civic_city_id: cityId || null,
      civic_district_id: districtId || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
