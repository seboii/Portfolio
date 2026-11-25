import { useEffect, useRef, useState } from "react"
import { copy, profile, type Locale } from "../content"
import { interfaceCopy } from "../interface-copy"
import { cinemaCopy } from "../data/storyboard"
import { emailHref, portfolioHref } from "../lib/links"
import Arrow from "../components/Arrow"
import SystemNetwork from "../visuals/SystemNetwork"

export default function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale],
    u = interfaceCopy[locale],
    c = cinemaCopy[locale]
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">(
    "idle",
  )
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    [],
  )
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState("success")
    } catch {
      setCopyState("error")
    }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopyState("idle"), 5000)
  }
  return (
    <section
      className="closing-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <figure className="closing-visual">
        <SystemNetwork locale={locale} closing />
      </figure>
      <div className="closing-content">
        <p className="eyebrow">
          <span>10 /</span>
          {t.contactEyebrow}
        </p>
        <h2 id="contact-title">
          {c.closing.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="closing-lead">{c.closingBody}</p>
        <a className="email-link" href={emailHref()}>
          <span>{profile.email}</span>
          <Arrow />
        </a>
        <div className="contact-actions">
          <a
            className="button button-accent"
            href={emailHref(u.inquirySubject)}
          >
            {t.sendMail}
            <Arrow />
          </a>
          <button
            className={`button button-ghost copy-button ${copyState}`}
            type="button"
            onClick={copyEmail}
          >
            {copyState === "success" ? t.copied : t.copyMail}
            <span aria-hidden="true">
              {copyState === "success" ? "✓" : "⧉"}
            </span>
          </button>
          <a
            className="button button-ghost"
            href={profile.cvDownload || emailHref(u.cvSubject, u.cvBody)}
            download={profile.cvDownload ? true : undefined}
          >
            {profile.cvDownload ? u.downloadCv : t.requestCv}
            <Arrow />
          </a>
        </div>
        <p className="copy-feedback" role="status" aria-live="polite">
          {copyState === "success"
            ? u.copySuccess
            : copyState === "error"
              ? u.copyFailure
              : ""}
        </p>
        <div className="contact-meta">
          <span>{profile.location[locale]}</span>
          {profile.socialLinks.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel[locale]}
            >
              {social.label[locale]} ↗
            </a>
          ))}
          <a href={portfolioHref(locale, null, "top")}>{u.backTop} ↑</a>
        </div>
      </div>
    </section>
  )
}
