import { useRef } from 'react'
import { Link } from 'react-router-dom'
import HeroScene from '../components/HeroScene.jsx'
import { gsap, useGSAP, MOTION_OK } from '../lib/fx.jsx'

export default function Hero() {
  const sectionRef = useRef(null)
  const sceneBoxRef = useRef(null)
  // 0 = ground state, 1 = fully excited. The scroll scrub writes here;
  // the particle cloud reads it every frame.
  const energyRef = useRef(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Load: the bento assembles, then the wordmark lines rise.
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.bx', { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.09 }, 0.15)
          .from(
            '.wm-line',
            { yPercent: 110, duration: 1.1, stagger: 0.14, ease: 'power4.out' },
            0.5,
          )
        return undefined
      })

      // Pin (desktop only): scrolling injects energy while the scene box
      // zooms out of its bento cell to swallow the viewport, then fades —
      // the transition INTO section 02 is the excited cloud dissolving.
      mm.add(`${MOTION_OK} and (min-width: 769px)`, () => {
        const sceneBox = sceneBoxRef.current
        // Measured untransformed at refresh (invalidateOnRefresh).
        const cover = () => {
          const r = sceneBox.getBoundingClientRect()
          return {
            scale: Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.06,
            x: window.innerWidth / 2 - (r.left + r.width / 2),
            y: window.innerHeight / 2 - (r.top + r.height / 2),
          }
        }
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=110%',
              scrub: 0.7,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                energyRef.current = self.progress * 0.9
              },
            },
          })
          .to(
            '.bx:not(.bx-scene)',
            { autoAlpha: 0, y: -26, duration: 0.4, stagger: 0.02, ease: 'none' },
            0,
          )
          .to(
            sceneBox,
            {
              x: () => cover().x,
              y: () => cover().y,
              scale: () => cover().scale,
              duration: 0.78,
              ease: 'power1.in',
            },
            0,
          )
          .to(sceneBox, { autoAlpha: 0, duration: 0.28, ease: 'none' }, 0.72)
        return undefined
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="network"
      ref={sectionRef}
      className="hero ground-dark"
      aria-labelledby="hero-title"
    >
      <div className="hero-frame container">
        <div className="hero-bento">
          <p className="bx bx-label label">
            Members only
            <br />
            Application required
          </p>
          <p className="bx bx-label bx-label-right label" aria-hidden="true">
            |0⟩ — the lowest-energy state
            <br />
            Stable by construction
          </p>

          <h1 id="hero-title" className="bx bx-wordmark hero-wordmark" aria-label="The Ground State Society">
            <span className="wm-row" aria-hidden="true">
              <span className="wm-line">
                <em className="wm-the">The</em> Ground
              </span>
            </span>
            <span className="wm-row" aria-hidden="true">
              <span className="wm-line">State Society</span>
            </span>
          </h1>

          <div className="bx bx-scene" ref={sceneBoxRef}>
            <HeroScene energyRef={energyRef} />
            <p className="scene-ket label" aria-hidden="true">
              |society⟩ = α|capital⟩ + β|builders⟩
            </p>
            <p className="scene-caption label" aria-hidden="true">
              fig. 01 — relaxation to the ground state. E₀ = ½ħω: even settled, the cloud
              never freezes. Scroll perturbs it.
            </p>
          </div>

          <div className="bx bx-side">
            <p className="hero-lede">
              The private network for funded quantum founders. The room where the people
              building the quantum economy share deal flow, hard-won lessons, and warm access
              to capital, customers, and talent.{' '}
              <strong className="hero-roi">One warm intro pays for the year.</strong>
            </p>
            <div className="hero-actions">
              <Link to="/apply" className="btn btn-primary">
                Apply for membership
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link to="/#signal" className="btn btn-ghost">
                Get The Signal — free
              </Link>
            </div>
          </div>

          <p className="bx bx-meta hero-meta label">
            <span>$300 / month</span>
            <span>Vetted founders only</span>
            <span>Founding cohort forming</span>
          </p>
        </div>
      </div>
    </section>
  )
}
