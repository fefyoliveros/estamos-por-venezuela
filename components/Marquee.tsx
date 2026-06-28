'use client'

interface MarqueeProps {
  items: string[]
  className?: string
}

export default function Marquee({ items, className = '' }: MarqueeProps) {
  // Duplicate items so the CSS loop appears seamless
  const doubled = [...items, ...items]

  return (
    <div className={`marquee-wrap ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-medium text-brand-ink/50">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-tierra shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
