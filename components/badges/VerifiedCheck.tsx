import { cn } from '@/lib/cn'

export default function VerifiedCheck({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center h-5 w-5 rounded-full bg-sky-500/20 ring-1 ring-sky-400/40',
        className
      )}
      title="Verified"
      aria-label="Verified"
    >
      <span className="text-sky-300 text-xs font-black">✓</span>
    </span>
  )
}
