import Arrow from "../components/Arrow"
import ProjectGallery from "../components/ProjectGallery"
import ProjectScrollStory from "../components/ProjectScrollStory"
import {
  copy,
  otherProjects,
  projects,
  type Locale,
  type Project,
} from "../content"
import { researchSignals } from "../data/research"
import { cinemaCopy, systemChapters } from "../data/storyboard"
import { getProjectMedia } from "../data/project-media"
import { interfaceCopy } from "../interface-copy"
import { emailHref, portfolioHref } from "../lib/links"
import EarlierSystem from "../visuals/EarlierSystem"
import ArchitectureMap from "../visuals/ArchitectureMap"
import SystemScene from "../visuals/SystemScene"
import "../styles/detail.css"

const allProjects = [...Object.values(projects), ...otherProjects]

export default function ProjectDetail({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  const c = cinemaCopy[locale]
  const u = interfaceCopy[locale]
  const t = copy[locale]
  const chapter = systemChapters.find((item) => item.projectId === project.id)
  const research = researchSignals.filter(
    (signal) => signal.relatedProject === project.id,
  )
  const nextProject =
    allProjects[
      (allProjects.findIndex((item) => item.id === project.id) + 1) %
        allProjects.length
    ]
  const hasPlans = project.planned[locale].length > 0
  const hasMedia = getProjectMedia(project.id).length > 0

  return (
    <article className="case-study" data-project={project.id}>
      <section className="case-hero" aria-labelledby="case-title">
        <div className="case-topline">
          <a className="case-back" href={portfolioHref(locale, null, "work")}>
            <Arrow />
            <span>{t.back}</span>
          </a>
        </div>

        <div className="case-hero-composition">
          <div className="case-heading">
            <h1 id="case-title">{project.title[locale]}</h1>
            <p className="case-summary">{project.summary[locale]}</p>
            <a
              className="case-explore"
              href={portfolioHref(locale, project.slug, "case-architecture")}
            >
              <span>{c.architecture}</span>
              <Arrow down />
            </a>
          </div>

          <figure
            className={`case-hero-visual${
              hasMedia
                ? " case-hero-gallery"
                : chapter
                  ? ""
                  : " case-legacy-visual"
            }`}
            data-case-visual
          >
            <div
              className={`case-scene${hasMedia ? " case-scene-gallery" : ""}`}
            >
              {hasMedia ? (
                <ProjectGallery
                  projectId={project.id}
                  locale={locale}
                  variant="hero"
                />
              ) : chapter ? (
                <SystemScene kind={chapter.kind} locale={locale} />
              ) : (
                <EarlierSystem projectId={project.id} locale={locale} />
              )}
            </div>
          </figure>
        </div>
      </section>

      {hasMedia && (
        <section
          className="case-interface"
          id="case-interface"
          aria-labelledby="case-interface-title"
        >
          <h2 id="case-interface-title">
            {{ tr: "Arayüz", en: "Interface", ru: "Интерфейс" }[locale]}
          </h2>
          <ProjectScrollStory projectId={project.id} locale={locale} />
        </section>
      )}

      <section className="case-context" aria-labelledby="case-context-title">
        <header className="case-section-heading">
          <h2 id="case-context-title">{c.detailContext}</h2>
        </header>
        <div className="case-context-copy">
          <div className="case-problem">
            <h3>{t.purpose}</h3>
            <p>{project.problem[locale]}</p>
          </div>
          <div className="case-contribution">
            <h3>{c.contribution}</h3>
            <p>{project.contribution[locale]}</p>
          </div>
        </div>
      </section>

      <section
        className="case-architecture"
        id="case-architecture"
        aria-labelledby="case-architecture-title"
      >
        <header className="case-section-heading case-architecture-heading">
          <h2 id="case-architecture-title">{c.framework}</h2>
          <p className="case-architecture-lead">
            {project.architecture[locale]}
          </p>
        </header>
        <div className="case-architecture-map">
          <ArchitectureMap projectId={project.id} locale={locale} />
        </div>
      </section>

      <section className="case-walkthrough" aria-labelledby="case-walk-title">
        <header className="case-section-heading">
          <h2 id="case-walk-title">{c.featureWalk}</h2>
        </header>
        <div className="case-walkthrough-grid" data-has-plans={hasPlans}>
          <div className="case-implemented">
            <h3>
              {project.id === "logistics-assistant"
                ? c.foundation
                : c.implemented}
            </h3>
            <ol className="case-feature-list">
              {project.implemented[locale].map((feature) => (
                <li key={feature}>
                  <p>{feature}</p>
                </li>
              ))}
            </ol>
          </div>
          {hasPlans && (
            <aside
              className="case-planned"
              aria-labelledby="case-planned-title"
            >
              <h3 id="case-planned-title">{c.planned}</h3>
              <ul className="case-plan-list">
                {project.planned[locale].map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      <section className="case-technology" aria-labelledby="case-tech-title">
        <header>
          <h2 id="case-tech-title">{u.technologies}</h2>
        </header>
        <ul>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </section>

      {project.outputs && (
        <section className="case-outputs" aria-labelledby="case-outputs-title">
          <h2 id="case-outputs-title">{u.output}</h2>
          <ul>
            {project.outputs[locale].map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
        </section>
      )}

      {research.length > 0 && (
        <section
          className="case-research"
          aria-labelledby="case-research-title"
        >
          <header className="case-section-heading">
            <h2 id="case-research-title">
              {c.researchTitle.replace("\n", " ")}
            </h2>
          </header>
          <div className="case-research-copy">
            {research.map((signal) => (
              <div className="case-research-signal" key={signal.id}>
                <p className="case-research-publisher">
                  {signal.publisher} / {signal.year}
                </p>
                <h3>{signal.title[locale]}</h3>
                <p>{signal.statement[locale]}</p>
                <a
                  href={signal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-source-link"
                >
                  <span>
                    {c.source}: {signal.source}
                  </span>
                  <Arrow />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section
        className="case-sharing case-project-links"
        aria-label={
          {
            tr: "Proje bağlantıları",
            en: "Project links",
            ru: "Ссылки проекта",
          }[locale]
        }
      >
        <div className="case-actions">
          {project.verifiedLinks.repository && (
            <a
              className="button button-ghost"
              href={project.verifiedLinks.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.viewRepo}
              <Arrow />
            </a>
          )}
          {project.verifiedLinks.demo && (
            <a
              className="button button-ghost"
              href={project.verifiedLinks.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.viewDemo}
              <Arrow />
            </a>
          )}
          {!project.verifiedLinks.demo && (
            <a
              className="button button-accent"
              href={emailHref(
                `${u.demoSubject}: ${project.title[locale]}`,
                u.demoBody,
              )}
            >
              {u.requestDetails}
              <Arrow />
            </a>
          )}
        </div>
      </section>

      <nav className="case-next" aria-label={u.projectNavigation}>
        <a
          href={portfolioHref(locale, nextProject.slug)}
          className="case-next-project"
        >
          <span>{c.nextSystem}</span>
          <strong>{nextProject.title[locale]}</strong>
          <Arrow />
        </a>
        <a
          className="case-all-projects"
          href={portfolioHref(locale, null, "work")}
        >
          {u.allWork}
          <Arrow />
        </a>
      </nav>
    </article>
  )
}
