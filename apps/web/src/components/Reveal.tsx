import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  variant?: 'up' | 'left' | 'right' | 'zoom'
  delay?: number
  as?: 'div' | 'section' | 'span'
}

export default function Reveal({ children, className = '', variant = 'up', delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const variantClass =
    variant === 'left' ? 'from-left' : variant === 'right' ? 'from-right' : variant === 'zoom' ? 'zoom' : ''

  return (
    <Tag
      ref={ref as never}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={`reveal ${variantClass} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}