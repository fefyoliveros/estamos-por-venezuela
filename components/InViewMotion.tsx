'use client'

import { useEffect, useRef } from 'react'

interface InViewMotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function InViewMotion({ children, className = '', delay = 0 }: InViewMotionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('in-view')
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  )
}
