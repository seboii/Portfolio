import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import type { Locale, Project } from "../content"
import { portfolioHref } from "../lib/links"
import Arrow from "./Arrow"
import "../styles/project-navigation.css"

interface ProjectNavigationProps {
  locale: Locale
  label: string
  projects: readonly Project[]
}

export default function ProjectNavigation({
  locale,
  label,
  projects,
}: ProjectNavigationProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLAnchorElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const focusFirst = useRef(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    if (focusFirst.current) {
      panel.current?.querySelector<HTMLAnchorElement>("a")?.focus()
      focusFirst.current = false
    }
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [open])

  function enterList(
    event: KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    if (event.key !== "ArrowDown") return
    event.preventDefault()
    if (open) panel.current?.querySelector<HTMLAnchorElement>("a")?.focus()
    else {
      focusFirst.current = true
      setOpen(true)
    }
  }

  return (
    <div
      className="project-navigation"
      data-open={open}
      ref={root}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false)
      }}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault()
          event.stopPropagation()
          setOpen(false)
          trigger.current?.focus()
        }
      }}
    >
      <div className="project-navigation-trigger">
        <a
          className="project-navigation-link"
          href={portfolioHref(locale, null, "work")}
          ref={trigger}
          onKeyDown={enterList}
          onClick={() => setOpen(false)}
        >
          {label}
        </a>
        <button
          className="project-navigation-toggle"
          type="button"
          aria-label={
            {
              tr: "Proje listesini aç",
              en: "Open project list",
              ru: "Открыть список проектов",
            }[locale]
          }
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((previous) => !previous)}
          onKeyDown={enterList}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div
        className="project-navigation-panel"
        id={panelId}
        ref={panel}
        hidden={!open}
      >
        <ul aria-label={label}>
          {projects.map((project) => (
            <li key={project.id}>
              <a
                className="project-navigation-item"
                href={portfolioHref(locale, project.slug)}
                onClick={() => setOpen(false)}
              >
                <span>{project.title[locale]}</span>
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
