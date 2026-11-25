import { useId, useState } from "react"
import { projects, type Locale } from "../content"
import { cinemaCopy, engineeringLayers } from "../data/storyboard"
import { portfolioHref } from "../lib/links"
import EngineeringStrata from "../visuals/EngineeringStrata"
import "../styles/engineering.css"

interface EngineeringApproachProps {
  locale: Locale
  reducedMotion?: boolean
}

export default function EngineeringApproach({
  locale,
  reducedMotion = false,
}: EngineeringApproachProps) {
  const [selected, setSelected] = useState<string>(engineeringLayers[0].id)
  const contextId = useId()
  const copy = cinemaCopy[locale]
  const active =
    engineeringLayers.find((layer) => layer.id === selected) ||
    engineeringLayers[0]

  return (
    <section
      className="engineering-section"
      id="engineering"
      aria-labelledby="engineering-title"
      data-reduced-motion={reducedMotion ? "true" : undefined}
    >
      <header className="engineering-heading">
        <p className="engineering-eyebrow">
          <span>07 /</span> {copy.approachEyebrow}
        </p>
        <h2 id="engineering-title">
          {copy.approachTitle.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="engineering-intro">{copy.approachBody}</p>
      </header>

      <div className="engineering-composition">
        <figure className="engineering-visual">
          <EngineeringStrata locale={locale} activeLayer={active.id} />
        </figure>

        <div className="engineering-selector">
          <div
            className="engineering-controls"
            role="group"
            aria-label={copy.layerLabel}
          >
            {engineeringLayers.map((layer, index) => (
              <button
                key={layer.id}
                type="button"
                aria-pressed={layer.id === active.id}
                aria-controls={contextId}
                onClick={() => setSelected(layer.id)}
                className="engineering-layer-button"
                data-engineering-layer={layer.id}
              >
                <span className="engineering-layer-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{layer.title[locale]}</span>
                <span className="engineering-layer-mark" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>

          <div
            className="engineering-context"
            id={contextId}
            aria-live="polite"
            aria-atomic="true"
          >
            <h3>{active.title[locale]}</h3>
            <p className="engineering-description">{active.body[locale]}</p>
            <p className="engineering-tools">
              <span>{copy.technology}</span>
              {active.tools}
            </p>
            <div className="engineering-project-links">
              {active.projectIds.map((id) => {
                const project = projects[id]
                return (
                  <a key={id} href={portfolioHref(locale, project.slug)}>
                    <span>{project.title[locale]}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )
              })}
            </div>
          </div>

          <noscript>
            <style>
              {
                ".engineering-controls,.engineering-context{display:none!important}.engineering-fallback{display:block!important}"
              }
            </style>
          </noscript>
          <ol className="engineering-fallback">
            {engineeringLayers.map((layer) => (
              <li key={layer.id}>
                <h3>{layer.title[locale]}</h3>
                <p>{layer.body[locale]}</p>
                <p className="engineering-tools">{layer.tools}</p>
                {layer.projectIds.map((id) => {
                  const project = projects[id]
                  return (
                    <a key={id} href={portfolioHref(locale, project.slug)}>
                      {project.title[locale]} <span aria-hidden="true">↗</span>
                    </a>
                  )
                })}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
