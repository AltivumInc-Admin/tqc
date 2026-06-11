import { useEffect, useRef } from 'react'
import { gsap } from '../lib/fx.jsx'

/*
 * Cursor companion — a small ring that trails the native cursor
 * (which stays visible) and quietly grows over interactive elements.
 * mix-blend-mode: difference keeps it legible on both grounds.
 * Fine pointers only; never under prefers-reduced-motion.
 */
export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const el = ref.current
    if (!el) return undefined

    el.style.display = 'block'
    const xTo = gsap.quickTo(el, 'x', { duration: 0.32, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.32, ease: 'power3' })

    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const over = (e) => {
      const hot = e.target.closest?.(
        'a, button, summary, label, input, select, textarea, [data-tilt], .bloch3d',
      )
      gsap.to(el, { scale: hot ? 2.2 : 1, opacity: hot ? 0.95 : 0.55, duration: 0.3 })
    }
    const leaveDoc = () => gsap.to(el, { opacity: 0, duration: 0.3 })
    const enterDoc = () => gsap.to(el, { opacity: 0.55, duration: 0.3 })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, true)
    document.documentElement.addEventListener('pointerleave', leaveDoc)
    document.documentElement.addEventListener('pointerenter', enterDoc)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over, true)
      document.documentElement.removeEventListener('pointerleave', leaveDoc)
      document.documentElement.removeEventListener('pointerenter', enterDoc)
    }
  }, [])

  return <span ref={ref} className="cursor-ring" aria-hidden="true" />
}
