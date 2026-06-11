import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import BlochSphere from './BlochSphere.jsx'
import { useMotionPaused } from '../../lib/motion.js'

/* fig. 04 goes live where it can: the 3D precessing Bloch sphere.
   The accurate SVG remains the figure under prefers-reduced-motion,
   without WebGL, or if the scene ever fails. */
const BlochScene = lazy(() => import('../../three/BlochScene.jsx'))

class FigBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function BlochFigure() {
  const holderRef = useRef(null)
  const yawRef = useRef(0)
  const draggingRef = useRef(false)
  const [reduced] = useState(prefersReducedMotion)
  const [webgl] = useState(hasWebGL)
  // Pause toggle swaps to the scientifically accurate static SVG
  const paused = useMotionPaused()
  const [near, setNear] = useState(false) // mount the scene only as it approaches
  const [inView, setInView] = useState(true) // stop the loop off-screen

  // Pausing unmounts the holder div, so the observers must re-attach when
  // the scene path returns — a mount-only effect would leave `near` frozen
  // and the figure permanently empty after pause → resume.
  const showScene = !reduced && !paused && webgl

  useEffect(() => {
    const node = holderRef.current
    if (!node) return undefined // SVG fallback rendered — nothing to observe
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return undefined
    }
    const nearObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          nearObs.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    const liveObs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: '80px 0px',
    })
    nearObs.observe(node)
    liveObs.observe(node)
    return () => {
      nearObs.disconnect()
      liveObs.disconnect()
    }
  }, [showScene])

  if (!showScene) return <BlochSphere />

  const down = (e) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const move = (e) => {
    if (draggingRef.current) yawRef.current += e.movementX * 0.006
  }
  const up = () => {
    draggingRef.current = false
  }

  return (
    <div
      ref={holderRef}
      className="bloch3d"
      role="img"
      aria-label="Bloch sphere: the state vector precesses between ket zero and ket one. Drag to rotate the view."
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={up}
    >
      <span className="b3-ket label" aria-hidden="true">
        |0⟩
      </span>
      {near && (
        <FigBoundary fallback={<BlochSphere />}>
          <Suspense fallback={null}>
            <BlochScene yawRef={yawRef} draggingRef={draggingRef} active={inView} />
          </Suspense>
        </FigBoundary>
      )}
      <span className="b3-ket b3-bottom label" aria-hidden="true">
        |1⟩
      </span>
    </div>
  )
}
