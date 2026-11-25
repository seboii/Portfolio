import { useEffect, useRef, useState } from "react"
import type { Locale } from "../content"
import { getProjectMedia } from "../data/project-media"
import ProjectGallery from "./ProjectGallery"
import "../styles/project-scroll-story.css"

export default function ProjectScrollStory({
  projectId,
  locale,
}: {
  projectId: string
  locale: Locale
}) {
  const items = getProjectMedia(projectId)
  const [activeId, setActiveId] = useState(items[0]?.id)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element || !items.length) return
    const steps = Array.from(
      element.querySelectorAll<HTMLElement>("[data-story-step]"),
    )
    let frame = 0
    function update() {
      frame = 0
      if (element?.querySelector("dialog[open]")) return
      const anchor =
        window.innerHeight * (window.innerWidth <= 760 ? 0.84 : 0.54)
      let nearest = steps[0]
      let distance = Infinity
      for (const step of steps) {
        const rect = step.getBoundingClientRect()
        const nextDistance = Math.abs(rect.top + rect.height / 2 - anchor)
        if (nextDistance < distance) {
          nearest = step
          distance = nextDistance
        }
      }
      const nextId = nearest?.dataset.storyStep
      if (nextId) setActiveId(nextId)
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    update()
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.cancelAnimationFrame(frame)
    }
  }, [items])

  function select(id: string, navigate = true) {
    setActiveId(id)
    if (!navigate) return
    const step = Array.from(
      root.current?.querySelectorAll<HTMLElement>("[data-story-step]") || [],
    ).find((element) => element.dataset.storyStep === id)
    if (!step) return
    const rect = step.getBoundingClientRect()
    const anchor = window.innerHeight * (window.innerWidth <= 760 ? 0.84 : 0.54)
    window.scrollTo({
      top: Math.max(0, window.scrollY + rect.top + rect.height / 2 - anchor),
      behavior: "instant",
    })
  }

  if (!items.length) return null
  return (
    <div
      ref={root}
      className="project-scroll-story"
      data-project-story={projectId}
      data-story-active={activeId}
    >
      <div className="project-story-visual">
        <ProjectGallery
          projectId={projectId}
          locale={locale}
          variant="full"
          selectedId={activeId}
          onSelect={select}
          scrollDriven
        />
      </div>
      <ol className="project-story-chapters">
        {items.map((item) => (
          <li
            key={item.id}
            data-story-step={item.id}
            data-active={activeId === item.id}
          >
            <div className="project-story-chapter-copy">
              <h3>
                <button
                  type="button"
                  aria-current={activeId === item.id ? "step" : undefined}
                  onClick={() => select(item.id)}
                >
                  {item.title[locale]}
                </button>
              </h3>
              <p>{item.description[locale]}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
