import { cn } from '@/lib/cn'

export default function LegendarySeal({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-1 bg-black ring-1 ring-yellow-400/35 shadow-glow',
        className
      )}
      title="Legendary"
      aria-label="Legendary"
    >
      <span className="text-[10px] font-black tracking-[0.22em] uppercase text-yellow-300">Legendary</span>
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-300/90" />
      <span className="text-[10px] font-semibold tracking-widest uppercase text-yellow-200/90">Seal</span>
    </span>
  )
}
