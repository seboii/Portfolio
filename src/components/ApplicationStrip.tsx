import { useId } from "react"
import type { CSSProperties } from "react"
import type { Locale } from "../content"
import { appLinks, type AppLink } from "../data/app-links"
import "../styles/application-strip.css"

function ApplicationMark({ kind }: { kind: AppLink["mark"] }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "behavior" && (
        <>
          <path d="M24 5L40 14V34L24 43L8 34V14Z" />
          <path d="M8 14L24 24L40 14M24 24V43M16 10L32 19V38" />
          <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
        </>
      )}
      {kind === "bridge" && (
        <>
          <path d="M7 37V13M41 37V13M7 18Q24 39 41 18M7 36H41M15 27V36M24 30V36M33 27V36" />
          <circle cx="7" cy="10" r="2.5" />
          <circle cx="41" cy="10" r="2.5" />
        </>
      )}
      {kind === "operations" && (
        <>
          <circle cx="24" cy="24" r="17" />
          <ellipse cx="24" cy="24" rx="7" ry="17" />
          <path d="M7 24H41M11 14H37M11 34H37" />
          <circle cx="35" cy="12" r="3" fill="currentColor" stroke="none" />
          <path d="M38 38L43 43" />
        </>
      )}
      {kind === "cargo" && (
        <>
          <path d="M7 18L24 8L41 18V35L24 45L7 35ZM7 18L24 28L41 18M24 28V45M15 13L32 23V40" />
          <path d="M12 5H21M28 5H37" />
        </>
      )}
      {kind === "mail" && (
        <>
          <rect x="6" y="13" width="36" height="26" rx="4" />
          <path d="M7 16L24 29L41 16M7 36L18 26M41 36L30 26M17 8H31M21 4H27" />
        </>
      )}
      {kind === "parking" && (
        <>
          <path d="M12 42V7H26A11 11 0 0 1 26 29H12M19 22H26A4 4 0 0 0 26 14H19V42M7 43H41" />
        </>
      )}
    </svg>
  )
}

function siteAddress(value: string | null) {
  if (!value) return null
  try {
    const parsed = new URL(value)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.href
      : null
  } catch {
    return null
  }
}

function AppCard({
  app,
  locale,
  duplicate,
}: {
  app: AppLink
  locale: Locale
  duplicate: boolean
}) {
  const address = siteAddress(app.siteUrl)
  const label = address
    ? {
        tr: `${app.name} sitesini aç`,
        en: `Open ${app.name} website`,
        ru: `Открыть сайт ${app.name}`,
      }[locale]
    : {
        tr: `${app.name} — site bağlantısı yakında`,
        en: `${app.name} — website coming soon`,
        ru: `${app.name} — ссылка на сайт появится скоро`,
      }[locale]
  const contents = (
    <>
      <span className="application-card-mark">
        <ApplicationMark kind={app.mark} />
      </span>
      <span className="application-card-copy">
        <strong>{app.name}</strong>
        <small>
          {address
            ? {
                tr: "Uygulamaya git",
                en: "Open application",
                ru: "Открыть приложение",
              }[locale]
            : { tr: "Yakında", en: "Coming soon", ru: "Скоро" }[locale]}
        </small>
      </span>
      <span className="application-card-arrow" aria-hidden="true">
        ↗
      </span>
    </>
  )
  const style = { "--application-accent": app.color } as CSSProperties

  if (address)
    return (
      <a
        className="application-card"
        href={address}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={duplicate ? -1 : undefined}
        aria-label={label}
        data-app-link={duplicate ? undefined : app.id}
        style={style}
      >
        {contents}
      </a>
    )
  return (
    <button
      className="application-card application-card--pending"
      type="button"
      disabled
      aria-disabled="true"
      aria-label={label}
      data-app-link={duplicate ? undefined : app.id}
      style={style}
    >
      {contents}
    </button>
  )
}

export default function ApplicationStrip({ locale }: { locale: Locale }) {
  const id = useId()
  return (
    <section
      className="web-application-strip"
      id="applications"
      aria-labelledby={`${id}-title`}
    >
      <header className="application-strip-heading">
        <div>
          <h2 id={`${id}-title`}>
            {
              {
                tr: "Uygulamalarım",
                en: "My applications",
                ru: "Мои приложения",
              }[locale]
            }
          </h2>
        </div>
      </header>
      <div className="application-strip-viewport">
        <div className="application-strip-track">
          {[true, false, true].map((duplicate, group) => (
            <div
              className="application-strip-group"
              key={group}
              aria-hidden={duplicate ? true : undefined}
            >
              {appLinks.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  locale={locale}
                  duplicate={duplicate}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
