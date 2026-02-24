'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import BrandMark from './BrandMark'

export default function NavBar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path
  
  return (
    <nav className="bg-black/40 backdrop-blur border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center">
              <span className="text-lg font-black text-tmp-gold">TMP</span>
            </div>
            <span className="font-bold tracking-wide text-sm hidden sm:inline text-white">
              THE MOST POPULAR™
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/cities" 
              className={isActive('/cities') ? 'text-tmp-gold' : 'text-white/70 hover:text-white'}
            >
              Cities
            </Link>
            <Link 
              href="/profile/location" 
              className={isActive('/profile/location') ? 'text-tmp-gold' : 'text-white/70 hover:text-white'}
            >
              Set Location
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
