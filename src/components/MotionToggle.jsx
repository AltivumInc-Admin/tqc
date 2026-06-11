import { useMotionPaused, setMotionPaused } from '../lib/motion.js'

/*
 * The pause/stop mechanism WCAG 2.2.2 asks for, placed beside each
 * auto-animating scene. Hidden under prefers-reduced-motion — the scenes
 * are already static there and the control would be a no-op.
 */
export default function MotionToggle() {
  const paused = useMotionPaused()
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return null
  }
  return (
    <button
      type="button"
      className="motion-toggle label"
      aria-pressed={paused}
      onClick={() => setMotionPaused(!paused)}
    >
      {paused ? 'Resume motion' : 'Pause motion'}
    </button>
  )
}
