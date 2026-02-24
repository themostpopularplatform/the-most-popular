import Link from 'next/link'
import VerifiedCheck from '@/components/badges/VerifiedCheck'
import CertifiedStamp from '@/components/badges/CertifiedStamp'
import LegendarySeal from '@/components/badges/LegendarySeal'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-tmp-bg text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-wider text-white/80">
          <span className="font-semibold">TMP</span>
          <span className="opacity-70">THE MOST POPULAR™</span>
        </div>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight md:text-7xl">
          The Most Popular
          <span className="align-super text-2xl md:text-3xl">™</span>
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg text-white/80 md:text-xl">
          Chosen by the People. Not the Algorithm.
        </p>

        <p className="mx-auto mt-3 max-w-3xl text-sm text-white/60 md:text-base">
          A civic reputation network built on verified identity and community governance.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/cities"
            className="rounded-xl bg-tmp-gold px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Explore Cities
          </Link>

          <Link
            href="/profile/location"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Set Your Location
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-white/70">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Verified Identity
          </span>
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
            Certified Authority
          </span>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1">
            Legendary Status
          </span>
        </div>

      </section>
    </main>
  )
}
