import { useEffect, useRef, useState, type CSSProperties } from "react"
import {
  languages,
  otherProjects,
  profile,
  profileName,
  projects,
  timeline,
  type Locale,
  type Project,
} from "../content"
import { emailHref, portfolioHref } from "../lib/links"
import { interfaceCopy } from "../interface-copy"
import { getProjectMedia, projectMediaSrc } from "../data/project-media"
import Arrow from "../components/Arrow"
import ProjectOverlay from "../components/ProjectOverlay"
import AboutNestPanel from "../components/AboutNestPanel"
import ApplicationStrip from "../components/ApplicationStrip"
import OrganicWeb, {
  defaultFlyPositions,
  distributeFlies,
} from "../visuals/OrganicWeb"
import { SpiderCreature, FlyCreature } from "../visuals/WebCreatures"
import useSpiderHunt from "../motion/useSpiderHunt"
import "../styles/spider.css"
import "../styles/web-world.css"

const collection = [...Object.values(projects), ...otherProjects]
const identities = [
  {
    id: "badhabinot",
    name: "Badhabinot",
    category: {
      tr: "AI & davranış analizi",
      en: "AI & behavioral analytics",
      ru: "ИИ и анализ поведения",
    },
    mark: "behavior",
    color: "#d7ff64",
  },
  {
    id: "bridge",
    name: "Bridge",
    category: {
      tr: "Gerçek zamanlı iş birliği",
      en: "Real-time collaboration",
      ru: "Совместная работа в реальном времени",
    },
    mark: "bridge",
    color: "#a6c9ff",
  },
  {
    id: "operations",
    name: "Operations Manager",
    category: {
      tr: "Lojistik kontrol merkezi",
      en: "Logistics control center",
      ru: "Центр управления логистикой",
    },
    mark: "operations",
    color: "#d7ff64",
  },
  {
    id: "logistics-assistant",
    name: "CargoTwin",
    category: {
      tr: "Lojistik",
      en: "Logistics",
      ru: "Логистика",
    },
    mark: "cargo",
    color: "#d7ff64",
  },
  {
    id: "mailops",
    name: "Mailops",
    category: {
      tr: "E-posta & veri işleme",
      en: "Email & data processing",
      ru: "Почта и обработка данных",
    },
    mark: "mail",
    color: "#c1b2ef",
  },
  {
    id: "otomark",
    name: "OtoMARK",
    category: {
      tr: "Otopark yönetimi",
      en: "Parking management",
      ru: "Управление парковкой",
    },
    mark: "parking",
    color: "#efa98a",
  },
] as const
type Identity = typeof identities[number]

const text = {
  tr: {
    explore: "Detaylar",
    preview: "Proje önizlemesi",
    nest: "Hakkımda’yı aç",
    nestHint: "Hakkımda",
    previous: "Önceki proje kimlikleri",
    next: "Sonraki proje kimlikleri",
    experience: "Deneyim & eğitim",
    contact: "İletişim",
    copy: "Adresi kopyala",
    copied: "Kopyalandı",
    copyError: "Adres kopyalanamadı. E-posta bağlantısını kullanabilirsin.",
    cv: "CV iste",
    back: "Başa dön",
    more: "Detaylar",
    nodeLabel: "önizlemesini aç",
  },
  en: {
    explore: "Details",
    preview: "Project preview",
    nest: "Open About me",
    nestHint: "About me",
    previous: "Previous project identities",
    next: "Next project identities",
    experience: "Experience & education",
    contact: "Contact",
    copy: "Copy address",
    copied: "Copied",
    copyError: "Could not copy the address. You can use the email link.",
    cv: "Request CV",
    back: "Back to top",
    more: "Details",
    nodeLabel: "open preview",
  },
  ru: {
    explore: "Подробнее",
    preview: "Предварительный просмотр проекта",
    nest: "Открыть раздел обо мне",
    nestHint: "Обо мне",
    previous: "Предыдущие проекты",
    next: "Следующие проекты",
    experience: "Опыт и образование",
    contact: "Контакты",
    copy: "Скопировать адрес",
    copied: "Скопировано",
    copyError: "Не удалось скопировать адрес. Воспользуйтесь ссылкой на почту.",
    cv: "Запросить резюме",
    back: "Наверх",
    more: "Подробнее",
    nodeLabel: "открыть предварительный просмотр",
  },
} as const

function ProjectMark({ kind }: { kind: Identity["mark"] }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {kind === "behavior" && (
        <>
          <path d="M6 21V11l10-6 10 6v10l-10 6Z" />
          <path d="m6 11 10 6 10-6M16 17v10M11 8l10 6v10" />
        </>
      )}
      {kind === "bridge" && (
        <>
          <path d="M5 24V9m22 15V9M5 12q11 16 22 0M5 23h22M11 18v5m5-3v3m5-5v5" />
          <circle cx="5" cy="7" r="2" />
          <circle cx="27" cy="7" r="2" />
        </>
      )}
      {kind === "operations" && (
        <>
          <path d="m16 3 12 7v13l-12 7L4 23V10Z" />
          <path d="m4 10 12 7 12-7M16 17v13m-8-7 16-10M8 9l16 10" />
        </>
      )}
      {kind === "cargo" && (
        <>
          <path d="m3 12 9-5 9 5-9 5Zm0 0v11l9 5 9-5V12M12 17v11m8-23 9 5v12l-6 4" />
          <path d="m21 13 8-3" />
        </>
      )}
      {kind === "mail" && (
        <>
          <rect x="3" y="7" width="26" height="18" rx="3" />
          <path d="m4 9 12 10L28 9M4 24l8-8m16 8-8-8" />
        </>
      )}
      {kind === "parking" && (
        <>
          <path d="M8 27V5h9a7 7 0 0 1 0 14H8m6 8V11h3a1 1 0 0 1 0 2h-3" />
          <path d="M4 27h24" />
        </>
      )}
    </svg>
  )
}

function NodePreview({
  identity,
  project,
  locale,
  onOpen,
  onClose,
}: {
  identity: Identity
  project: Project
  locale: Locale
  onOpen: () => void
  onClose: () => void
}) {
  const t = text[locale]
  const cover = getProjectMedia(project.id)[0]
  return (
    <div
      className="node-preview"
      id={`preview-${project.id}`}
      role="region"
      aria-label={`${identity.name} — ${t.preview}`}
    >
      <div
        className={`preview-visual${cover ? " preview-visual--capture" : ""}`}
        data-kind={identity.mark}
        aria-hidden="true"
      >
        {cover ? (
          <img
            src={projectMediaSrc(cover.src)}
            alt=""
            width={cover.width}
            height={cover.height}
          />
        ) : (
          <>
            <div className="preview-grid" />
            <ProjectMark kind={identity.mark} />
            <i className="preview-signal" />
          </>
        )}
      </div>
      <div className="preview-body">
        <span className="preview-eyebrow">{identity.category[locale]}</span>
        <h3>{identity.name}</h3>
        <p>{project.summary[locale]}</p>
        <div className="preview-tech">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <button type="button" className="preview-open" onClick={onOpen}>
          {t.explore}
          <Arrow />
        </button>
      </div>
      <button
        type="button"
        className="preview-dismiss"
        aria-label={
          {
            tr: "Önizlemeyi kapat",
            en: "Close preview",
            ru: "Закрыть предварительный просмотр",
          }[locale]
        }
        onClick={onClose}
      >
        ×
      </button>
    </div>
  )
}

export default function SpiderHome({
  locale,
  theme,
  onThemeChange,
}: {
  locale: Locale
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
}) {
  const t = text[locale]
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [flyPositions, setFlyPositions] = useState(defaultFlyPositions)
  const [fliesReady, setFliesReady] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<Project | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [copyState, setCopyState] = useState("idle")
  const spider = useRef<HTMLDivElement>(null)
  const nest = useRef<HTMLButtonElement>(null)
  const huntTrail = useRef<SVGPathElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const focusReturn = useRef<HTMLElement | null>(null)

  const huntState = useSpiderHunt({
    stageRef: stage,
    spiderRef: spider,
    trailRef: huntTrail,
    targetId: hovered,
    layer: 0,
    paused: Boolean(selected) || aboutOpen || !fliesReady,
  })

  useEffect(() => {
    if (!stage.current) return
    const surface = stage.current
    let visible = true
    const update = () => {
      surface.dataset.inview = String(visible && !document.hidden)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(surface)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  useEffect(() => {
    const surface = stage.current
    if (!surface) return
    const seed = Math.floor(Math.random() * 4294967296)
    const arrange = () => {
      setFlyPositions(distributeFlies(surface, seed))
      setFliesReady(true)
    }
    arrange()
    window.addEventListener("resize", arrange)
    const reset = () => {
      surface.style.setProperty("--pointer-x", "0px")
      surface.style.setProperty("--pointer-y", "0px")
    }
    let frame = 0
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect()
        surface.style.setProperty(
          "--pointer-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 6}px`,
        )
        surface.style.setProperty(
          "--pointer-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * 4}px`,
        )
      })
    }
    surface.addEventListener("pointermove", pointer)
    surface.addEventListener("pointerleave", reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", arrange)
      surface.removeEventListener("pointermove", pointer)
      surface.removeEventListener("pointerleave", reset)
      reset()
    }
  }, [])
  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#about") {
        setAboutOpen(true)
        requestAnimationFrame(() =>
          section.current?.scrollIntoView({ behavior: "instant" }),
        )
      }
    }
    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => {
      window.removeEventListener("hashchange", syncHash)
      if (closeTimer.current) clearTimeout(closeTimer.current)
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])

  function preview(id: string | null) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setHovered(id)
  }
  function dismissPreview() {
    closeTimer.current = setTimeout(() => setHovered(null), 180)
  }
  function openProject(project: Project, trigger?: HTMLElement) {
    const focused = trigger || document.activeElement
    const previewNode = focused
      ?.closest(".project-node-position")
      ?.querySelector<HTMLButtonElement>(".project-node")
    focusReturn.current =
      (aboutOpen ? nest.current : null) ||
      previewNode ||
      (focused instanceof HTMLElement && focused !== document.body
        ? focused
        : null)
    setHovered(null)
    setAboutOpen(false)
    setSelected(project)
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState("success")
    } catch {
      setCopyState("error")
    }
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyState("idle"), 4000)
  }

  return (
    <div className="spider-home">
      <div id="top" />
      <section
        className="web-experience"
        id="work"
        ref={section}
        aria-label={
          {
            tr: "İnteraktif proje ağı",
            en: "Interactive project web",
            ru: "Интерактивная сеть проектов",
          }[locale]
        }
      >
        <div
          className="web-stage"
          ref={stage}
          data-obscured={Boolean(selected) || aboutOpen}
          data-hunt-state={huntState}
        >
          <div className="web-art">
            <div className="web-art-depth">
              <OrganicWeb />
            </div>
          </div>
          <svg
            className="hunt-trail-svg"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path className="hunt-trail" ref={huntTrail} />
          </svg>
          <div
            className={`web-spider${
              huntState === "chasing" || huntState === "returning"
                ? " is-walking"
                : ""
            }`}
            ref={spider}
            aria-hidden="true"
          >
            <div className="spider-body-drift">
              <SpiderCreature
                active={huntState === "chasing" || huntState === "returning"}
                looking="center"
              />
            </div>
          </div>
          <button
            className="web-theme-toggle"
            type="button"
            data-theme-toggle
            aria-label={
              {
                tr: theme === "dark" ? "Gündüz modunu aç" : "Gece modunu aç",
                en:
                  theme === "dark"
                    ? "Switch to day mode"
                    : "Switch to night mode",
                ru:
                  theme === "dark"
                    ? "Включить светлую тему"
                    : "Включить тёмную тему",
              }[locale]
            }
            title={
              {
                tr: theme === "dark" ? "Gündüz modu" : "Gece modu",
                en: theme === "dark" ? "Day mode" : "Night mode",
                ru: theme === "dark" ? "Светлая тема" : "Тёмная тема",
              }[locale]
            }
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              {theme === "dark" ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                </>
              ) : (
                <path d="M20.3 15.6A9 9 0 0 1 8.4 3.7 9 9 0 1 0 20.3 15.6Z" />
              )}
            </svg>
            <span>
              {
                {
                  tr: theme === "dark" ? "Gündüz" : "Gece",
                  en: theme === "dark" ? "Day" : "Night",
                  ru: theme === "dark" ? "День" : "Ночь",
                }[locale]
              }
            </span>
          </button>
          <div className="web-identity">
            <h1>
              {profileName(locale).split(" ")[0]}
              <br />
              <span>
                {profileName(locale).split(" ").slice(1).join(" ")}
                <span className="core-period">.</span>
              </span>
            </h1>
            <p className="core-role">{profile.role[locale]}</p>
          </div>
          <button
            className="web-nest"
            id="about"
            ref={nest}
            type="button"
            aria-label={t.nest}
            aria-haspopup="dialog"
            aria-expanded={aboutOpen}
            onClick={() => {
              preview(null)
              setAboutOpen(true)
            }}
          >
            <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path
                className="nest-outer"
                d="M40 4 64 14 76 40 64 65 40 76 15 65 4 40 15 15Z"
              />
              <path d="M40 12 60 22 68 40 58 60 40 67 22 58 12 40 22 22Z" />
              <path d="M40 23 53 28 58 40 51 53 40 57 27 51 23 40 28 28Z" />
              <path d="M40 4V23M64 14 53 28M76 40H58M64 65 51 53M40 76V57M15 65 27 51M4 40H23M15 15 28 28" />
              <circle cx="40" cy="40" r="6" className="nest-core" />
            </svg>
            <span>{t.nestHint}</span>
          </button>
          <noscript className="web-project-fallback">
            {identities.map((identity) => (
              <a
                key={identity.id}
                href={portfolioHref(
                  locale,
                  collection.find((project) => project.id === identity.id)!
                    .slug,
                )}
              >
                {identity.name}
              </a>
            ))}
          </noscript>
          <div className="web-projects" data-ready={fliesReady}>
            {identities.map((identity, i) => {
              const project = collection.find(
                (item) => item.id === identity.id,
              )!
              const position = flyPositions[i]
              return (
                <div
                  className={`project-node-position is-visible${
                    hovered === identity.id ? " is-hovered" : ""
                  }`}
                  key={identity.id}
                  data-preview-side={position.y > 58 ? "top" : "bottom"}
                  data-preview-align={
                    position.x < 21
                      ? "left"
                      : position.x > 79
                        ? "right"
                        : "center"
                  }
                  style={
                    {
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      "--node-color": identity.color,
                      "--node-delay": `${i * -0.73}s`,
                    } as CSSProperties
                  }
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") preview(identity.id)
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") dismissPreview()
                  }}
                  onFocus={() => {
                    if (window.matchMedia("(hover: hover)").matches)
                      preview(identity.id)
                  }}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                      dismissPreview()
                  }}
                >
                  <button
                    type="button"
                    className="project-node"
                    data-project={identity.id}
                    aria-label={`${identity.name} — ${t.nodeLabel}`}
                    aria-haspopup="dialog"
                    aria-describedby={
                      hovered === identity.id
                        ? `preview-${identity.id}`
                        : undefined
                    }
                    onClick={(event) => {
                      if (
                        window.matchMedia("(hover: none)").matches &&
                        hovered !== identity.id
                      )
                        preview(identity.id)
                      else openProject(project, event.currentTarget)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        event.stopPropagation()
                        preview(null)
                      }
                    }}
                  >
                    <span
                      className="node-satellite node-fly"
                      aria-hidden="true"
                    >
                      <span className="fly-shadow" />
                      <FlyCreature
                        color={identity.color}
                        active={hovered === identity.id}
                      />
                      <span className="fly-trace" />
                      <svg
                        className="fly-cocoon"
                        viewBox="0 0 120 120"
                        fill="none"
                        aria-hidden="true"
                      >
                        <ellipse cx="60" cy="64" rx="24" ry="34" />
                        {Array.from({ length: 7 }, (_, band) => (
                          <path
                            key={band}
                            d={`M38 ${39 + band * 8} Q60 ${49 + band * 8} 82 ${39 + band * 8}`}
                          />
                        ))}
                        <path d="M56 30c32 15-26 31 7 45s-18 21-8 24M61 30c-24 25 27 41-7 59" />
                      </svg>
                    </span>
                    <span
                      className="node-copy"
                      aria-hidden={hovered !== identity.id}
                    >
                      <strong>{identity.name}</strong>
                      <span className="node-open-indicator" aria-hidden="true">
                        ↗
                      </span>
                    </span>
                  </button>
                  {hovered === identity.id && (
                    <NodePreview
                      identity={identity}
                      project={project}
                      locale={locale}
                      onOpen={() =>
                        openProject(
                          project,
                          stage.current?.querySelector<HTMLButtonElement>(
                            `[data-project="${identity.id}"]`,
                          ) || undefined,
                        )
                      }
                      onClose={() => preview(null)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <ApplicationStrip locale={locale} />
      <section
        className="web-journey"
        id="experience"
        aria-labelledby="journey-title"
      >
        <div className="journey-heading">
          <h2 id="journey-title">{t.experience}</h2>
        </div>
        <div className="journey-stops">
          {[...timeline].reverse().map((entry) => (
            <article key={entry.id}>
              <span>{entry.year}</span>
              <h3>{entry.title[locale]}</h3>
              <p>{entry.date[locale]}</p>
              <p>{entry.description[locale]}</p>
            </article>
          ))}
        </div>
        <div className="journey-languages">
          <span>{interfaceCopy[locale].languages}</span>
          <p>{languages.map((language) => language[locale]).join(" / ")}</p>
        </div>
      </section>
      <section
        className="web-contact"
        id="contact"
        aria-labelledby="web-contact-title"
      >
        <div className="contact-thread" aria-hidden="true">
          <svg viewBox="0 0 1000 180" preserveAspectRatio="none">
            <path d="M0 0Q500 300 1000 0M0 0Q500 250 1000 0M0 0Q500 200 1000 0M0 0Q500 150 1000 0M0 0Q500 100 1000 0" />
          </svg>
          <span />
        </div>
        <h2 id="web-contact-title">{t.contact}</h2>
        <a className="web-email" href={emailHref()}>
          {profile.email}
          <Arrow />
        </a>
        <div className="web-contact-links">
          <button type="button" onClick={copyEmail}>
            {copyState === "success" ? t.copied : t.copy}
            <span aria-hidden="true">
              {copyState === "success" ? "✓" : "⧉"}
            </span>
          </button>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <Arrow />
          </a>
          <a
            href={emailHref(
              interfaceCopy[locale].cvSubject,
              interfaceCopy[locale].cvBody,
            )}
          >
            {t.cv}
            <Arrow />
          </a>
        </div>
        <p className="web-copy-feedback" role="status">
          {copyState === "error"
            ? t.copyError
            : copyState === "success"
              ? interfaceCopy[locale].copySuccess
              : ""}
        </p>
        <div className="web-contact-bottom">
          <span>{profile.location[locale]}</span>
          <a href="#top">{t.back} ↑</a>
        </div>
      </section>
      {aboutOpen && (
        <AboutNestPanel
          locale={locale}
          onClose={() => setAboutOpen(false)}
          returnFocus={nest.current}
        >
          <div className="project-identity-wrap">
            <div
              className="project-identities"
              ref={rail}
              aria-label={
                {
                  tr: "Proje kimlikleri",
                  en: "Project identities",
                  ru: "Проекты",
                }[locale]
              }
            >
              {identities.map((identity) => {
                const project = collection.find(
                  (item) => item.id === identity.id,
                )!
                return (
                  <a
                    href={portfolioHref(locale, project.slug)}
                    key={identity.id}
                    onClick={(event) => {
                      event.preventDefault()
                      openProject(project, event.currentTarget)
                    }}
                    aria-label={`${identity.name} — ${t.more}`}
                  >
                    <ProjectMark kind={identity.mark} />
                    <span>{identity.name}</span>
                  </a>
                )
              })}
            </div>
            <button
              type="button"
              className="identity-arrow"
              aria-label={t.previous}
              onClick={() =>
                rail.current?.scrollBy({
                  left: -230,
                  behavior: "smooth",
                })
              }
            >
              ←
            </button>
            <button
              type="button"
              className="identity-arrow"
              aria-label={t.next}
              onClick={() =>
                rail.current?.scrollBy({
                  left: 230,
                  behavior: "smooth",
                })
              }
            >
              →
            </button>
          </div>
        </AboutNestPanel>
      )}
      {selected && (
        <ProjectOverlay
          project={selected}
          locale={locale}
          returnFocus={focusReturn.current}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
