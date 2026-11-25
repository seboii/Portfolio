import { useRef } from "react"
import {
  copy,
  languages,
  otherProjects,
  profile,
  profileName,
  projects,
  timeline,
  type Locale,
} from "../content"
import { interfaceCopy } from "../interface-copy"
import { cinemaCopy, systemChapters } from "../data/storyboard"
import { portfolioHref } from "../lib/links"
import Arrow from "../components/Arrow"
import SystemNetwork from "../visuals/SystemNetwork"
import EarlierSystem from "../visuals/EarlierSystem"
import ResearchSection from "./ResearchSection"
import SystemChapter from "./SystemChapter"
import EngineeringApproach from "./EngineeringApproach"
import Contact from "./Contact"
import useCinematicMotion from "../motion/useCinematicMotion"
import "../styles/cinema.css"

export default function CinematicHome({ locale }: { locale: Locale }) {
  const scope = useRef<HTMLDivElement>(null)
  const t = cinemaCopy[locale],
    u = interfaceCopy[locale]
  const name = profileName(locale).split(" ")
  const allProjects = [...Object.values(projects), ...otherProjects]
  const earlier = otherProjects.filter(
    (project) => project.id !== "logistics-assistant",
  )
  useCinematicMotion(scope, locale, false)
  return (
    <div className="cinematic-home" ref={scope}>
      <section className="cinema-hero" id="top" aria-labelledby="hero-title">
        <div className="cinema-topline">
          <span>
            {locale === "ru"
              ? "SS / ИНЖЕНЕРИЯ В ДВИЖЕНИИ"
              : "SS / ENGINEERING IN MOTION"}
          </span>
          <span>{profile.location[locale]}</span>
        </div>
        <figure className="cinema-hero-visual">
          <SystemNetwork locale={locale} />
          <figcaption>{t.heroCaption}</figcaption>
        </figure>
        <div className="cinema-hero-copy">
          <p className="eyebrow">
            <span>01 /</span>
            {profile.role[locale]}
          </p>
          <h1 id="hero-title">
            <span>{name.slice(0, -1).join(" ")}</span>
            <span>
              {name[name.length - 1]}
              <span className="name-period" aria-hidden="true">
                .
              </span>
            </span>
          </h1>
          <p className="cinema-claim">{t.heroClaim}</p>
          <div className="cinema-actions">
            <a
              className="button button-accent"
              href={portfolioHref(locale, null, "work")}
            >
              {t.explore}
              <Arrow down />
            </a>
            <a
              className="text-link"
              href={portfolioHref(locale, null, "contact")}
            >
              {t.contact}
              <Arrow />
            </a>
          </div>
        </div>
        <div className="cinema-hero-bottom">
          <span>{t.prelude}</span>
          <a
            className="scroll-mark"
            href={portfolioHref(locale, null, "research")}
          >
            {u.scroll}
            <Arrow down />
          </a>
        </div>
      </section>
      <ResearchSection locale={locale} />
      <div id="work" className="work-threshold">
        <span>{t.selected}</span>
        <span>03 — 06</span>
      </div>
      {systemChapters.map((chapter) => {
        const project = allProjects.find(
          (project) => project.id === chapter.projectId,
        )!
        return (
          <SystemChapter
            key={chapter.id}
            chapter={chapter}
            project={project}
            locale={locale}
          />
        )
      })}
      <EngineeringApproach locale={locale} reducedMotion={false} />
      <section
        className="career-section"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="career-heading">
          <p className="eyebrow">
            <span>08 /</span>
            {t.aboutEyebrow}
          </p>
          <h2 id="about-title">
            {t.aboutTitle.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p>{copy[locale].bio}</p>
          <div className="career-languages">
            <h3>{u.languages}</h3>
            <p>{languages.map((language) => language[locale]).join(" · ")}</p>
          </div>
        </div>
        <div className="career-trajectory" id="experience">
          <h2 className="sr-only">{u.timelineHeading}</h2>
          <svg
            className="career-line"
            viewBox="0 0 120 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="draw-path"
              d="M20 0V190Q20 225 60 240T100 290V565Q100 605 60 630T20 680V900"
            />
          </svg>
          {[...timeline].reverse().map((entry, i) => (
            <article className={`trajectory-stop stop-${i}`} key={entry.id}>
              <span className="trajectory-year">{entry.year}</span>
              <div>
                <h3>{entry.title[locale]}</h3>
                <p className="trajectory-date">{entry.date[locale]}</p>
                <p>{entry.description[locale]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="earlier-section" aria-labelledby="earlier-title">
        <div className="cinema-intro">
          <p className="eyebrow">
            <span>09 /</span>
            {t.earlier}
          </p>
          <h2 id="earlier-title">
            {t.earlierTitle.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>
        <div className="earlier-list">
          {earlier.map((project, i) => (
            <article className="earlier-work" key={project.id}>
              <span className="earlier-number" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h3>
                  <a href={portfolioHref(locale, project.slug)}>
                    {project.title[locale]}
                  </a>
                </h3>
                <p>{project.summary[locale]}</p>
                <span className="chapter-status">{project.status[locale]}</span>
                <a
                  className="text-link"
                  href={portfolioHref(locale, project.slug)}
                  aria-label={`${t.otherDetails}: ${project.title[locale]}`}
                >
                  {t.otherDetails}
                  <Arrow />
                </a>
              </div>
              <figure className="earlier-visual">
                <EarlierSystem projectId={project.id} locale={locale} />
              </figure>
            </article>
          ))}
        </div>
      </section>
      <Contact locale={locale} />
    </div>
  )
}
