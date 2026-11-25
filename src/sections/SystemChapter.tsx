import type { Locale, Project } from "../content"
import { cinemaCopy, type SystemChapter as Chapter } from "../data/storyboard"
import { portfolioHref } from "../lib/links"
import Arrow from "../components/Arrow"
import SystemScene from "../visuals/SystemScene"
import OperationsChapter from "./OperationsChapter"

export default function SystemChapter({
  chapter,
  project,
  locale,
}: {
  chapter: Chapter
  project: Project
  locale: Locale
}) {
  if (chapter.kind === "operations")
    return (
      <OperationsChapter chapter={chapter} project={project} locale={locale} />
    )
  const t = cinemaCopy[locale]
  const isFoundation = chapter.kind === "intelligence"
  const flow = {
    collaboration: [
      "SOCKET.IO / SIGNALING",
      "WEBRTC / MEDIA",
      { tr: "ORTAK BAĞLAM", en: "SHARED CONTEXT", ru: "ОБЩИЙ КОНТЕКСТ" }[
        locale
      ],
    ],
    pose: [
      "REACT",
      "SPRING BOOT",
      "VISION / AI",
      { tr: "GEÇMİŞ", en: "HISTORY", ru: "ИСТОРИЯ" }[locale],
    ],
    intelligence: ["UI / DEMO", "TENANT CONTEXT", "TOOLREGISTRY"],
  }[chapter.kind]
  return (
    <section
      className={`system-chapter chapter-${chapter.kind}`}
      id={chapter.id}
      data-scene={chapter.kind}
      aria-labelledby={`${chapter.id}-title`}
    >
      <div className="chapter-heading">
        <p className="eyebrow">
          <span>{chapter.number} /</span>
          {project.kicker[locale]}
        </p>
        <h2 id={`${chapter.id}-title`}>
          {chapter.title[locale].split("\n").map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h2>
        <p className="chapter-concept">{chapter.concept[locale]}</p>
      </div>
      <div className="chapter-composition">
        <figure className="chapter-visual">
          <div className="chapter-visual-index" aria-hidden="true">
            <span>SS / {chapter.number}</span>
            <span>{chapter.kind.toUpperCase()}</span>
          </div>
          <SystemScene kind={chapter.kind} locale={locale} />
          <div className="chapter-architecture-strip" aria-hidden="true">
            {flow.map((label, i) => (
              <span key={label}>
                {i > 0 && <i>→</i>}
                {label}
              </span>
            ))}
          </div>
        </figure>
        <div className="chapter-narrative">
          <div className="chapter-context">
            <span className="chapter-overline">{t.context}</span>
            <h3>{project.title[locale]}</h3>
            <p>{project.summary[locale]}</p>
            {isFoundation && (
              <div className="maturity-key">
                <span className="maturity-solid">{t.foundation}</span>
                <span className="maturity-dashed">{t.scoped}</span>
              </div>
            )}
          </div>
          <ol className="chapter-steps">
            {chapter.steps[locale].map((step, i) => (
              <li key={step} data-step={i}>
                <span aria-hidden="true">0{i + 1}</span>
                <div>
                  <h4>{step}</h4>
                  <p>{chapter.labels[locale][i]}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="chapter-resolution">
            <span className="chapter-overline">{t.contribution}</span>
            <p>{project.contribution[locale]}</p>
            <div className="chapter-technologies">
              {project.technologies.slice(0, 4).join(" / ")}
            </div>
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
      <div className="chapter-thread" aria-hidden="true">
        <span>{chapter.labels[locale].join(" → ")}</span>
        <svg viewBox="0 0 600 45">
          <path d="M0 22H190Q220 22 235 8T280 22H600" />
        </svg>
      </div>
    </section>
  )
}
