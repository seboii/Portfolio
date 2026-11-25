import { useRef, useState } from "react"
import type { Locale, Project } from "../content"
import { cinemaCopy, type SystemChapter } from "../data/storyboard"
import { portfolioHref } from "../lib/links"
import Arrow from "../components/Arrow"
import LogisticsScene from "../visuals/LogisticsScene"
import useOperationsScroll from "../motion/useOperationsScroll"

export default function OperationsChapter({
  chapter,
  project,
  locale,
}: {
  chapter: SystemChapter
  project: Project
  locale: Locale
}) {
  const scope = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const t = cinemaCopy[locale]
  useOperationsScroll(scope, locale, setActive)

  return (
    <section
      className="system-chapter chapter-operations"
      id={chapter.id}
      data-scene="operations"
      data-operation-active={active}
      aria-labelledby={`${chapter.id}-title`}
      ref={scope}
    >
      <div className="chapter-heading">
        <p className="eyebrow">
          <span>{chapter.number} /</span>
          {project.kicker[locale]}
        </p>
        <h2 id={`${chapter.id}-title`}>
          {chapter.title[locale].split("\n").map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </h2>
      </div>

      <div className="operations-context">
        <h3>{project.title[locale]}</h3>
        <p>{project.summary[locale]}</p>
      </div>

      <div className="operations-composition">
        <figure className="operations-map">
          <div className="operations-map-surface">
            <LogisticsScene locale={locale} />
          </div>
          <figcaption className="operations-map-footer">
            <span className="operations-map-count" aria-hidden="true">
              0{active + 1}
              <span> / 03</span>
            </span>
            <nav
              className="operations-map-progress"
              aria-label={
                {
                  tr: "Operasyon adımları",
                  en: "Operation steps",
                  ru: "Этапы операции",
                }[locale]
              }
            >
              {chapter.steps[locale].map((step, index) => (
                <a
                  key={step}
                  href={`#operations-step-${index + 1}`}
                  aria-current={active === index ? "step" : undefined}
                >
                  <span aria-hidden="true">0{index + 1}</span>
                  <span className="sr-only">{step}</span>
                </a>
              ))}
            </nav>
          </figcaption>
        </figure>

        <ol className="operations-steps">
          {chapter.steps[locale].map((step, index) => (
            <li
              key={step}
              className="operations-step"
              data-step={index}
              data-operation-step={index}
              data-active={active === index ? "true" : "false"}
            >
              <span className="operations-step-index" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h4 id={`operations-step-${index + 1}`}>{step}</h4>
                <p>{chapter.labels[locale][index]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="operations-contribution">
        <h3>{t.contribution}</h3>
        <div className="operations-contribution-body">
          <p>{project.contribution[locale]}</p>
          <ul className="operations-technologies" aria-label={t.technology}>
            {project.technologies.slice(0, 4).map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          <div className="operations-contribution-footer">
            <a
              className="text-link"
              href={portfolioHref(locale, project.slug)}
              aria-label={`${t.detail}: ${project.title[locale]}`}
            >
              {t.detail}
              <Arrow />
            </a>
            <p className="chapter-status">{project.status[locale]}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
