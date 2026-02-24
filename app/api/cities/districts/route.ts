import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const cityId = searchParams.get('cityId')
  
  if (!cityId) {
    return NextResponse.json({ error: 'cityId required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: districts } = await supabase
    .from('city_districts')
    .select('id, district_name, slug, city_id')
    .eq('city_id', cityId)
    .order('district_name')

  return NextResponse.json({ districts: districts || [] })
}
