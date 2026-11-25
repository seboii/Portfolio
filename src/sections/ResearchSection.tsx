import { useRef, useState } from "react"
import type { Locale } from "../content"
import { researchSignals } from "../data/research"
import { cinemaCopy } from "../data/storyboard"
import ResearchTopology from "../visuals/ResearchTopology"
import Arrow from "../components/Arrow"
import useResearchScroll from "../motion/useResearchScroll"

export default function ResearchSection({ locale }: { locale: Locale }) {
  const t = cinemaCopy[locale]
  const scope = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useResearchScroll(scope, locale, setActive)
  return (
    <section
      className="evidence-section"
      id="research"
      ref={scope}
      aria-labelledby="research-title"
    >
      <div className="cinema-intro">
        <p className="eyebrow">
          <span>02 /</span>
          {t.researchEyebrow}
        </p>
        <h2 id="research-title">
          {t.researchTitle.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p>{t.researchLead}</p>
      </div>
      <div className="evidence-composition">
        <figure className="evidence-visual">
          <ResearchTopology active={active} locale={locale} />
        </figure>
        <div className="evidence-signals">
          {researchSignals.map((signal, i) => (
            <article
              className="evidence-signal"
              key={signal.id}
              data-signal={i}
            >
              <span className="signal-index" aria-hidden="true">
                0{i + 1} / {signal.year}
              </span>
              <h3>{signal.title[locale]}</h3>
              <p>{signal.statement[locale]}</p>
              <a
                href={signal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="evidence-source"
              >
                <span>
                  {t.source}: {signal.publisher}
                  <small>{signal.source}</small>
                </span>
                <Arrow />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
