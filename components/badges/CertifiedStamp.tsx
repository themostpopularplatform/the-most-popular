import { cn } from '@/lib/cn'

export default function CertifiedStamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-1 bg-red-600/90 ring-1 ring-red-300/20 shadow-glow',
        className
      )}
      title="Certified"
      aria-label="Certified"
    >
      <span className="text-[10px] font-black tracking-[0.22em] uppercase text-white">Certified</span>
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
      <span className="text-[10px] font-semibold tracking-widest uppercase text-white/90">TMP</span>
    </span>
  )
}
