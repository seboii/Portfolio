import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"

import {
  copy,
  otherProjects,
  profile,
  profileName,
  projects,
  type Locale,
} from "./content"

import { interfaceCopy } from "./interface-copy"

import { applyDocumentHead, parseRoute } from "./seo"

import { portfolioHref as href } from "./lib/links"

import Arrow from "./components/Arrow"
import ProjectNavigation from "./components/ProjectNavigation"
import useAmbientMotion from "./motion/useAmbientMotion"

import SpiderHome from "./sections/SpiderHome"

import ProjectDetail from "./sections/ProjectDetail"
import "./styles/portfolio-theme.css"

const allProjects = [...Object.values(projects), ...otherProjects]

function Wordmark({ locale }: { locale: Locale }) {
  return (
    <a
      className="monogram"
      href={href(locale)}
      aria-label={`${profileName(locale)} — ${interfaceCopy[locale].home}`}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path className="monogram-divider" d="M7 41 41 7" />
        <g className="monogram-letters">
          <path d="M21 9.5h-8l-3 3v.5l3 3h5l3 3v.5l-3 3h-8" />
          <path
            d="M21 9.5h-8l-3 3v.5l3 3h5l3 3v.5l-3 3h-8"
            transform="translate(17 17)"
          />
        </g>
      </svg>
    </a>
  )
}

function LanguageSwitch({
  locale,

  slug,
}: {
  locale: Locale

  slug: string | null
}) {
  return (
    <nav className="locale-switch" aria-label={interfaceCopy[locale].language}>
      {(["tr", "en", "ru"] as const).map((language, index) => (
        <span className="locale-item" key={language}>
          {index > 0 && <span aria-hidden="true">/</span>}
          <a
            href={href(language, slug)}
            lang={language}
            hrefLang={language}
            aria-current={locale === language ? "page" : undefined}
            className={locale === language ? "active" : ""}
            aria-label={
              { tr: "Türkçe", en: "English", ru: "Русский" }[language]
            }
          >
            {language.toUpperCase()}
          </a>
        </span>
      ))}
    </nav>
  )
}

function Header({
  locale,

  slug,

  menuOpen,

  setMenuOpen,

  menuButton,
}: {
  locale: Locale

  slug: string | null

  menuOpen: boolean

  setMenuOpen: (open: boolean) => void

  menuButton: React.RefObject<HTMLButtonElement | null>
}) {
  const t = copy[locale]

  return (
    <header className="site-header" inert={menuOpen}>
      <Wordmark locale={locale} />
      <nav
        className="main-nav desktop-nav"
        aria-label={interfaceCopy[locale].navigation}
      >
        {t.nav.map((label, index) =>
          index === 0 ? (
            <ProjectNavigation
              key={label}
              locale={locale}
              label={label}
              projects={allProjects}
            />
          ) : (
            <a
              href={href(
                locale,

                null,

                ["work", "about", "experience", "contact"][index],
              )}
              key={label}
            >
              {label}
            </a>
          ),
        )}
      </nav>
      <div className="header-actions">
        <LanguageSwitch locale={locale} slug={slug} />
        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={t.openMenu}
        >
          <i />
          <i />
        </button>
      </div>
    </header>
  )
}

function MobileMenu({
  locale,

  slug,

  onClose,
}: {
  locale: Locale

  slug: string | null

  onClose: () => void
}) {
  const dialog = useRef<HTMLDivElement>(null)

  const t = copy[locale]

  useEffect(() => {
    dialog.current?.querySelector<HTMLAnchorElement>(".mobile-links a")?.focus()

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function keys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()

      onClose()
    }

    if (event.key === "Tab") {
      const controls = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>("a[href], button") || [],
      )

      const first = controls[0]

      const last = controls[controls.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()

        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()

        first?.focus()
      }
    }
  }

  return (
    <div
      id="mobile-menu"
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={interfaceCopy[locale].navigation}
      ref={dialog}
      onKeyDown={keys}
    >
      <div className="mobile-menu-top">
        <Wordmark locale={locale} />
        <button
          type="button"
          className="menu-toggle is-open"
          onClick={onClose}
          aria-label={t.closeMenu}
        >
          <i />
          <i />
        </button>
      </div>
      <nav
        className="mobile-links"
        aria-label={interfaceCopy[locale].navigation}
      >
        {t.nav.map((label, index) => (
          <a
            key={label}
            href={href(
              locale,

              null,

              ["work", "about", "experience", "contact"][index],
            )}
            onClick={onClose}
          >
            {label}
            <Arrow />
          </a>
        ))}
      </nav>
      <LanguageSwitch locale={locale} slug={slug} />
      <p className="mobile-menu-caption">{profile.location[locale]}</p>
    </div>
  )
}

export interface AppProps {
  initialLocale?: Locale

  initialProjectSlug?: string | null

  staticRender?: boolean
}

export type PortfolioTheme = "dark" | "light"

export default function App({
  initialLocale,

  initialProjectSlug,
}: AppProps = {}) {
  const route =
    typeof window === "undefined"
      ? { locale: profile.defaultLocale, projectSlug: null }
      : parseRoute(window.location.pathname)

  const locale = initialLocale || route.locale

  const slug =
    initialProjectSlug === undefined ? route.projectSlug : initialProjectSlug

  const t = copy[locale]

  const u = interfaceCopy[locale]

  const detail = slug
    ? allProjects.find((project) => project.slug === slug)
    : null

  const navigationSlug = detail?.slug || null

  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<PortfolioTheme>("dark")
  const [detailReducedMotion, setDetailReducedMotion] = useState(true)
  const effectiveReducedMotion = Boolean(slug) && detailReducedMotion

  const changeTheme = useCallback((nextTheme: PortfolioTheme) => {
    setTheme(nextTheme)
    try {
      window.localStorage.setItem("portfolio-theme", nextTheme)
    } catch {
      // Theme selection still works for this visit when storage is unavailable.
    }
  }, [])

  const menuButton = useRef<HTMLButtonElement>(null)
  const motionScope = useRef<HTMLElement>(null)

  useAmbientMotion(motionScope, locale, effectiveReducedMotion)

  function closeMenu() {
    setMenuOpen(false)

    requestAnimationFrame(() => menuButton.current?.focus())
  }

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("portfolio-theme")
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme)
    } catch {
      // Keep the initial dark palette when preferences cannot be read.
    }
    const synchronizeTheme = (event: StorageEvent) => {
      if (event.key === "portfolio-theme") {
        setTheme(event.newValue === "light" ? "light" : "dark")
      }
    }
    window.addEventListener("storage", synchronizeTheme)
    return () => window.removeEventListener("storage", synchronizeTheme)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    return () => {
      delete document.documentElement.dataset.theme
    }
  }, [theme])

  useEffect(() => {
    applyDocumentHead(locale, slug, {
      allowIndex: import.meta.env.DEV ? false : undefined,
    })

    const desktop = window.matchMedia("(min-width: 701px)")

    const resize = () => {
      if (desktop.matches) setMenuOpen(false)
    }

    desktop.addEventListener("change", resize)

    return () => {
      desktop.removeEventListener("change", resize)
    }
  }, [locale, slug])

  useEffect(() => {
    if (!slug) return
    const systemPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    )
    const updateSystemMotion = () =>
      setDetailReducedMotion(systemPreference.matches)
    updateSystemMotion()
    systemPreference.addEventListener("change", updateSystemMotion)

    return () => {
      systemPreference.removeEventListener("change", updateSystemMotion)
    }
  }, [slug])

  useEffect(() => {
    document.documentElement.dataset.motion = effectiveReducedMotion
      ? "reduce"
      : "full"
    return () => {
      document.documentElement.dataset.motion = "auto"
    }
  }, [effectiveReducedMotion])

  return (
    <>
      <a className="skip-link" href="#main-content">
        {u.skip}
      </a>
      <Header
        locale={locale}
        slug={navigationSlug}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuButton={menuButton}
      />
      {menuOpen && (
        <MobileMenu locale={locale} slug={navigationSlug} onClose={closeMenu} />
      )}
      <noscript>
        <nav className="no-script-nav" aria-label={u.navigation}>
          {t.nav.map((label, index) => (
            <a
              key={label}
              href={href(
                locale,

                null,

                ["work", "about", "experience", "contact"][index],
              )}
            >
              {label}
            </a>
          ))}
        </nav>
      </noscript>
      <main
        id="main-content"
        ref={motionScope}
        tabIndex={-1}
        inert={menuOpen}
        className={slug ? "detail-page" : undefined}
      >
        {slug ? (
          detail ? (
            <ProjectDetail project={detail} locale={locale} />
          ) : (
            <section className="not-found">
              <span className="project-number">404 /</span>
              <h1>{u.notFound}</h1>
              <p>{u.notFoundBody}</p>
              <a
                className="button button-accent"
                href={href(locale, null, "work")}
              >
                {t.back}
                <Arrow />
              </a>
            </section>
          )
        ) : (
          <SpiderHome
            locale={locale}
            theme={theme}
            onThemeChange={changeTheme}
          />
        )}
      </main>
      <footer className="site-footer" inert={menuOpen}>
        <span>{profileName(locale)}</span>
        <span>© 2026 SS</span>
      </footer>
    </>
  )
}
