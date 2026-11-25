import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { copy, profile, profileName, type Locale } from "../content"
import { emailHref, portfolioHref } from "../lib/links"
import "../styles/about-nest.css"

function NestOrnament() {
  return (
    <svg
      className="about-nest-ornament"
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth=".75">
        <path d="M60 11 107 36 102 73 59 90 16 69 12 33Z" opacity=".25" />
        <path d="M60 25 91 42 86 67 60 78 31 64 29 41Z" opacity=".45" />
        <path d="M60 39 76 47 73 61 60 67 44 59 45 46Z" opacity=".8" />
        <path d="M60 11V90M107 36 16 69M102 73 12 33" opacity=".3" />
        <path d="M36 48 60 32 85 48M42 51V74H77V51" strokeWidth="1.1" />
        <path d="M54 74V59H66V74" opacity=".7" />
      </g>
      <g fill="currentColor">
        <circle cx="60" cy="11" r="2" />
        <circle cx="102" cy="73" r="1.5" />
        <circle cx="16" cy="69" r="1.5" />
      </g>
    </svg>
  )
}

export default function AboutNestPanel({
  locale,
  onClose,
  returnFocus,
  children,
}: {
  locale: Locale
  onClose: () => void
  returnFocus: HTMLElement | null
  children?: ReactNode
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const panel = useRef<HTMLElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const closeCallback = useRef(onClose)
  const titleId = useId()
  const biographyId = useId()
  const t = copy[locale]
  closeCallback.current = onClose

  useEffect(() => {
    const portal = document.createElement("div")
    portal.className = "about-nest-host"
    document.body.appendChild(portal)
    setHost(portal)
    return () => portal.remove()
  }, [])

  useEffect(() => {
    if (!host) return
    const focused =
      returnFocus ||
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null)
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const siblings = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && element !== host,
      )
      .map((element) => ({ element, inert: element.inert }))
    siblings.forEach(({ element }) => {
      element.inert = true
    })
    document.body.style.overflow = "hidden"
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`
    }
    closeButton.current?.focus({ preventScroll: true })

    function controls() {
      return Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex]",
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
        (active === first || !panel.current?.contains(active))
      ) {
        event.preventDefault()
        last?.focus()
      } else if (
        !event.shiftKey &&
        (active === last || !panel.current?.contains(active))
      ) {
        event.preventDefault()
        first?.focus()
      }
    }
    function containFocus(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !panel.current?.contains(event.target)
      ) {
        closeButton.current?.focus({ preventScroll: true })
      }
    }
    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("focusin", containFocus)
    return () => {
      document.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("focusin", containFocus)
      siblings.forEach(({ element, inert }) => {
        element.inert = inert
      })
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      if (focused?.isConnected) focused.focus({ preventScroll: true })
    }
  }, [host, returnFocus])

  if (!host) return null

  const focuses = {
    tr: [
      ["Backend & mimari", "API tasarımı · veri modeli"],
      ["Gerçek zamanlı sistemler", "React · SignalR · WebRTC"],
      ["Veri & AI entegrasyonları", "Python · bilgisayarlı görü · yerel AI"],
    ],
    en: [
      ["Backend & architecture", "API design · data models"],
      ["Real-time systems", "React · SignalR · WebRTC"],
      ["Data & AI integrations", "Python · computer vision · local AI"],
    ],
    ru: [
      ["Бэкенд и архитектура", "Проектирование API · модели данных"],
      ["Системы реального времени", "React · SignalR · WebRTC"],
      ["Данные и интеграции ИИ", "Python · компьютерное зрение · локальный ИИ"],
    ],
  }[locale]

  return createPortal(
    <div
      className="about-nest-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={panel}
        className="about-nest-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={biographyId}
        tabIndex={-1}
      >
        <div className="about-nest-heading">
          <h2 id={titleId}>
            {{ tr: "Hakkımda", en: "About me", ru: "Обо мне" }[locale]}
          </h2>
          <button
            ref={closeButton}
            type="button"
            className="about-nest-close"
            onClick={onClose}
            aria-label={
              {
                tr: "Hakkımda panelini kapat",
                en: "Close about panel",
                ru: "Закрыть раздел обо мне",
              }[locale]
            }
          >
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
                strokeWidth="1.4"
              />
            </svg>
          </button>
        </div>
        <div className="about-nest-content">
          <NestOrnament />
          <span className="about-nest-location">
            {profile.location[locale]}
          </span>
          <h3>
            {profileName(locale)}
            <span aria-hidden="true">.</span>
          </h3>
          <p className="about-nest-role">{profile.role[locale]}</p>
          <p className="about-nest-biography" id={biographyId}>
            {t.bio}
          </p>
          <dl className="about-nest-focus">
            {focuses.map(([name, description]) => (
              <div key={name}>
                <dt>
                  {name}
                  <i aria-hidden="true">↗</i>
                </dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
          {children && <div className="about-nest-projects">{children}</div>}
          <div className="about-nest-actions">
            <a
              className="about-nest-contact"
              href={portfolioHref(locale, null, "contact")}
              onClick={onClose}
            >
              {t.contact}
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={portfolioHref(locale, null, "experience")}
              onClick={onClose}
            >
              {
                {
                  tr: "Deneyim & eğitim",
                  en: "Experience & education",
                  ru: "Опыт и образование",
                }[locale]
              }
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="about-nest-links">
            <a href={emailHref()} onClick={onClose}>
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              aria-label={
                {
                  tr: "LinkedIn profilini yeni sekmede aç",
                  en: "Open LinkedIn profile in a new tab",
                  ru: "Открыть профиль LinkedIn в новой вкладке",
                }[locale]
              }
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>
    </div>,
    host,
  )
}
