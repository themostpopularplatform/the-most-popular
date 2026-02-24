import LocationSelector from '@/components/profile/LocationSelector'

export const metadata = {
  title: 'Set Your Location | The Most Popular™',
  description: 'Choose your civic city and district'
}

export default function LocationPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Your Civic Location</h1>
      <LocationSelector />
    </div>
  )
}
