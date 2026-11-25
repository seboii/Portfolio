import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { copy, type Locale, type Project } from "../content"
import { emailHref, portfolioHref } from "../lib/links"
import ProjectGallery from "./ProjectGallery"
import OperationsMap from "../visuals/OperationsMap"
import "../styles/project-overlay.css"

const projectNames: Record<string, string> = {
  operations: "Operations Manager",
  bridge: "Bridge",
  "logistics-assistant": "CargoTwin",
  badhabinot: "Badhabinot",
  mailops: "Mailops",
  otomark: "OtoMARK",
}

function MailFlow({ locale }: { locale: Locale }) {
  return (
    <svg
      className="project-overlay-flow"
      viewBox="0 0 700 420"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="mail-flow-grid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".06"
          />
        </pattern>
      </defs>
      <rect width="700" height="420" fill="url(#mail-flow-grid)" />
      <g stroke="currentColor" fill="none">
        <path
          className="project-flow-route"
          d="M133 196H251Q285 196 285 162V116H394M133 196H251Q285 196 285 231V284H394"
          strokeOpacity=".65"
        />
        <path
          d="M490 116H532Q563 116 563 147V196H622M490 284H532Q563 284 563 253V196"
          strokeOpacity=".3"
        />
        <circle cx="285" cy="196" r="72" strokeOpacity=".12" />
        <circle
          cx="285"
          cy="196"
          r="55"
          strokeOpacity=".1"
          strokeDasharray="2 7"
        />
      </g>
      <g fill="#101417" stroke="currentColor" strokeOpacity=".4">
        <rect x="68" y="161" width="100" height="70" rx="5" />
        <rect x="239" y="168" width="93" height="56" rx="5" />
        <rect x="392" y="78" width="114" height="76" rx="5" />
        <rect x="392" y="246" width="114" height="76" rx="5" />
        <circle cx="621" cy="196" r="23" />
      </g>
      <g
        fill="currentColor"
        fontSize="12"
        textAnchor="middle"
        className="project-visual-mono"
      >
        <text x="118" y="191">
          Microsoft
        </text>
        <text x="118" y="208">
          Graph
        </text>
        <text x="285" y="201">
          RabbitMQ
        </text>
        <text x="449" y="106">
          Python
        </text>
        <text x="449" y="128">
          FastAPI
        </text>
        <text x="449" y="278">
          .NET
        </text>
        <text x="449" y="300">
          {locale === "ru" ? "Основной API" : "Core API"}
        </text>
        <text x="621" y="249">
          {locale === "ru" ? "ДАННЫЕ" : "DATA"}
        </text>
      </g>
      <g fill="currentColor">
        <circle className="project-flow-pulse" cx="213" cy="196" r="4" />
        <circle cx="354" cy="116" r="3" />
        <circle cx="539" cy="284" r="3" />
      </g>
      <g fill="#8a938c" className="project-visual-mono" fontSize="11">
        <text x="48" y="47">
          {locale === "ru"
            ? "ПОЧТА → ОБРАБОТКА → КОНТЕКСТ"
            : "MAIL → PROCESS → CONTEXT"}
        </text>
        <text x="48" y="382">
          {
            {
              tr: "ASENKRON İŞLEME / TEKNİK MİMARİ",
              en: "ASYNC PROCESSING / TECHNICAL ARCHITECTURE",
              ru: "АСИНХРОННАЯ ОБРАБОТКА / АРХИТЕКТУРА",
            }[locale]
          }
        </text>
      </g>
    </svg>
  )
}

function ParkingScene({ locale }: { locale: Locale }) {
  return (
    <svg
      className="project-overlay-parking"
      viewBox="0 0 700 420"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor">
        <path
          d="M77 105H623V315H77ZM77 177H623M77 243H623"
          strokeOpacity=".2"
        />
        <path d="M88 209H612" strokeOpacity=".25" strokeDasharray="12 12" />
        {[77, 168, 259, 350, 441, 532, 623].map((x) => (
          <path key={x} d={`M${x} 105V177M${x} 243V315`} strokeOpacity=".4" />
        ))}
        <path
          className="project-flow-route"
          d="M42 211H180Q225 211 225 260V296"
          strokeWidth="2"
          strokeOpacity=".7"
        />
        <path d="M217 285L225 296 233 285" strokeWidth="2" strokeOpacity=".7" />
      </g>
      {[122, 304, 486, 577].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i % 2 ? 276 : 140})`}>
          <rect
            x="-21"
            y="-25"
            width="42"
            height="50"
            rx="8"
            fill="currentColor"
            fillOpacity=".14"
            stroke="currentColor"
            strokeOpacity=".55"
          />
          <path
            d="M-14-11H14M-14 11H14"
            stroke="currentColor"
            strokeOpacity=".35"
          />
        </g>
      ))}
      <g fill="currentColor" className="project-visual-mono" fontSize="12">
        <text x="78" y="61">
          {
            {
              tr: "KAMPÜS OTOPARKI",
              en: "CAMPUS PARKING",
              ru: "ПАРКОВКА КАМПУСА",
            }[locale]
          }
        </text>
        <text x="78" y="360">
          {locale === "ru"
            ? "C++ / НАСТОЛЬНОЕ ПРИЛОЖЕНИЕ"
            : "C++ / DESKTOP APPLICATION"}
        </text>
        <text x="550" y="360">
          OtoMARK
        </text>
      </g>
      <circle
        className="project-flow-pulse"
        cx="164"
        cy="211"
        r="4"
        fill="currentColor"
      />
    </svg>
  )
}

function ProjectVisual({
  project,
  locale,
}: {
  project: Project
  locale: Locale
}) {
  if (project.id === "operations" || project.id === "logistics-assistant") {
    return <OperationsMap locale={locale} compact />
  }
  if (project.id === "bridge")
    return (
      <ProjectGallery
        projectId={project.id}
        locale={locale}
        variant="compact"
      />
    )
  if (project.id === "badhabinot")
    return (
      <ProjectGallery
        projectId={project.id}
        locale={locale}
        variant="compact"
      />
    )
  if (project.id === "mailops") return <MailFlow locale={locale} />
  return <ParkingScene locale={locale} />
}

export default function ProjectOverlay({
  project,
  locale,
  onClose,
  returnFocus,
}: {
  project: Project
  locale: Locale
  onClose: () => void
  returnFocus?: HTMLElement | null
}) {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null)
  const dialog = useRef<HTMLElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const closeCallback = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()
  const t = copy[locale]
  const title = projectNames[project.id] || project.title[locale]
  closeCallback.current = onClose

  useEffect(() => {
    const host = document.createElement("div")
    host.className = "project-overlay-host"
    document.body.appendChild(host)
    setPortalHost(host)
    return () => host.remove()
  }, [])

  useEffect(() => {
    if (!portalHost) return
    const previousFocus =
      returnFocus ||
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null)
    const previousScroll = { top: window.scrollY, left: window.scrollX }
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    const siblings = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element !== portalHost,
      )
      .map((element) => ({ element, previousInert: element.inert }))

    siblings.forEach(({ element }) => {
      element.inert = true
    })
    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`
    }
    closeButton.current?.focus({ preventScroll: true })

    function controls() {
      return Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) || [],
      ).filter(
        (element) =>
          element.tabIndex >= 0 && element.getClientRects().length > 0,
      )
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        event.stopPropagation()
        closeCallback.current()
      }
      if (event.key !== "Tab") return
      const available = controls()
      const first = available[0]
      const last = available[available.length - 1]
      const active = document.activeElement
      if (
        event.shiftKey &&
        (active === first || !dialog.current?.contains(active))
      ) {
        event.preventDefault()
        last?.focus()
      } else if (
        !event.shiftKey &&
        (active === last || !dialog.current?.contains(active))
      ) {
        event.preventDefault()
        first?.focus()
      }
    }
    function containFocus(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !dialog.current?.contains(event.target)
      ) {
        closeButton.current?.focus({ preventScroll: true })
      }
    }
    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("focusin", containFocus)
    return () => {
      document.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("focusin", containFocus)
      siblings.forEach(({ element, previousInert }) => {
        element.inert = previousInert
      })
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      window.scrollTo({ ...previousScroll, behavior: "instant" })
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true })
    }
  }, [portalHost, returnFocus])

  if (!portalHost) return null

  return createPortal(
    <div
      className={`project-overlay-backdrop project-overlay-${project.tone}`}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialog}
        className="project-overlay-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <div className="project-overlay-topbar">
          <button
            ref={closeButton}
            type="button"
            className="project-overlay-close"
            onClick={onClose}
            aria-label={
              {
                tr: "Proje ayrıntılarını kapat",
                en: "Close project details",
                ru: "Закрыть описание проекта",
              }[locale]
            }
          >
            <span aria-hidden="true">
              {{ tr: "KAPAT", en: "CLOSE", ru: "ЗАКРЫТЬ" }[locale]}
            </span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m5 5 10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        <div className="project-overlay-scroll">
          <div className="project-overlay-hero">
            <figure
              className={`project-overlay-visual project-overlay-visual-${project.id}`}
            >
              <ProjectVisual project={project} locale={locale} />
            </figure>
            <div className="project-overlay-intro">
              <h2 id={titleId}>
                {title}
                <span aria-hidden="true">.</span>
              </h2>
              <p id={descriptionId}>{project.summary[locale]}</p>
              <div className="project-overlay-actions">
                <a
                  className="project-overlay-primary"
                  href={portfolioHref(locale, project.slug)}
                >
                  {
                    {
                      tr: "Kısa case study",
                      en: "Read the case study",
                      ru: "Подробнее о проекте",
                    }[locale]
                  }
                  <span aria-hidden="true">↗</span>
                </a>
                {project.verifiedLinks.repository ? (
                  <a
                    href={project.verifiedLinks.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub<span aria-hidden="true">↗</span>
                    <span className="project-overlay-sr">
                      {
                        {
                          tr: ", yeni sekmede açılır",
                          en: ", opens in a new tab",
                          ru: ", откроется в новой вкладке",
                        }[locale]
                      }
                    </span>
                  </a>
                ) : (
                  <a
                    href={emailHref(
                      `${title} — ${{ tr: "Teknik ayrıntılar", en: "Technical details", ru: "Технические подробности" }[locale]}`,
                    )}
                  >
                    {
                      {
                        tr: "Projeyi konuşalım",
                        en: "Discuss the project",
                        ru: "Обсудим проект",
                      }[locale]
                    }
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.verifiedLinks.demo && (
                  <a
                    href={project.verifiedLinks.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.viewDemo}
                    <span aria-hidden="true">↗</span>
                    <span className="project-overlay-sr">
                      {
                        {
                          tr: ", yeni sekmede açılır",
                          en: ", opens in a new tab",
                          ru: ", откроется в новой вкладке",
                        }[locale]
                      }
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="project-overlay-body">
            <div className="project-overlay-context">
              <div>
                <h3>
                  {
                    {
                      tr: "Çözülen problem",
                      en: "The problem",
                      ru: "Решаемая задача",
                    }[locale]
                  }
                </h3>
                <p>{project.problem[locale]}</p>
              </div>
              <div>
                <h3>{t.contribution}</h3>
                <p>{project.contribution[locale]}</p>
              </div>
            </div>

            <div className="project-overlay-implementation">
              <div>
                <h3>{t.implemented}</h3>
                <ul className="project-overlay-features">
                  {project.implemented[locale].map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">↳</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="project-overlay-architecture">
                <h3>{t.architecture}</h3>
                <p>{project.architecture[locale]}</p>
                {project.planned[locale].length > 0 && (
                  <div className="project-overlay-planned">
                    <h4>
                      {
                        {
                          tr: "Gelecek kapsam",
                          en: "Future scope",
                          ru: "Планы развития",
                        }[locale]
                      }
                    </h4>
                    <ul>
                      {project.planned[locale].map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="project-overlay-stack">
              <h3>{t.technologies}</h3>
              <div>
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>,
    portalHost,
  )
}
