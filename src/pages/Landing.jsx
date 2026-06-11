import Hero from '../sections/Hero.jsx'
import Problem from '../sections/Problem.jsx'
import Story from '../sections/Story.jsx'
import Proof from '../sections/Proof.jsx'
import Inside from '../sections/Inside.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import Fx from '../lib/fx.jsx'
import WaveParticle from '../components/figures/WaveParticle.jsx'
import FigCaption from '../components/figures/FigCaption.jsx'

export default function Landing() {
  return (
    <>
      <Hero />
      <Problem />
      <Story />
      <Fx as="figure" className="fig-divider ground-dark" aria-hidden="false">
        <div className="container">
          {/* The band is the whole moment — give the draw nearly a full
              viewport of scroll so the wave can be watched, not glimpsed */}
          <div data-draw data-draw-start="top 96%" data-draw-end="top 6%">
            <WaveParticle />
          </div>
          <FigCaption num="02">
            Wave–particle duality. One system, two true descriptions — a continuous wave, and
            discrete samples of the same curve. Both are the network.
          </FigCaption>
        </div>
      </Fx>
      <Proof />
      <Inside />
      <FinalCta />
    </>
  )
}
