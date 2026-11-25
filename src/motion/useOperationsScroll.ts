import { useEffect, type RefObject } from "react"
import type { Locale } from "../content"

// The actual heading positions choose both the map layer and its progress
// indicator. An unrelated overall chapter timeline cannot advance them early.
export default function useOperationsScroll(
  scope: RefObject<HTMLElement | null>,
  locale: Locale,
  setActive: (index: number) => void,
) {
  useEffect(() => {
    const section = scope.current
    if (!section) return
    const headings = Array.from(
      section.querySelectorAll<HTMLElement>(".operations-step h4"),
    )
    if (headings.length !== 3) return
    const offsetProperty = "--operations-reading-offset"
    const originalOffset = section.style.getPropertyValue(offsetProperty)
    const originalPriority = section.style.getPropertyPriority(offsetProperty)

    let tops: number[] = []
    let readingLine = 0
    let frame = 0
    let needsMeasure = false
    let alive = true
    let current = -1

    const measure = () => {
      const header =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 84
      readingLine =
        header +
        Math.min(200, Math.max(96, (window.innerHeight - header) * 0.25))
      if (window.innerWidth < 768 && window.innerHeight >= 650) {
        const mapHeight =
          section
            .querySelector<HTMLElement>(".operations-map")
            ?.getBoundingClientRect().height || 0
        readingLine = Math.min(window.innerHeight - 64, header + mapHeight + 48)
      }
      // Native step links land on the same line that selects the map layer.
      section.style.setProperty(
        offsetProperty,
        `${readingLine - header - 24}px`,
      )
      tops = headings.map(
        (heading) => heading.getBoundingClientRect().top + window.scrollY,
      )
    }

    const paint = () => {
      const readingPosition = window.scrollY + readingLine
      let active = 0
      for (let index = 1; index < tops.length; index++) {
        if (readingPosition >= tops[index]) active = index
      }
      if (active !== current) {
        current = active
        setActive(active)
      }
    }

    const schedule = (remeasure = false) => {
      if (!alive) return
      needsMeasure ||= remeasure
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        if (!alive) return
        if (needsMeasure) {
          needsMeasure = false
          measure()
        }
        paint()
      })
    }
    const onScroll = () => schedule()
    const onLayout = () => schedule(true)
    measure()
    paint()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onLayout, { passive: true })
    window.addEventListener("pageshow", onLayout)
    window.addEventListener("hashchange", onLayout)
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onLayout)
        : undefined
    observer?.observe(section)
    observer?.observe(document.body)
    document.fonts.ready.then(() => {
      if (alive) onLayout()
    })

    return () => {
      alive = false
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onLayout)
      window.removeEventListener("pageshow", onLayout)
      window.removeEventListener("hashchange", onLayout)
      if (originalOffset) {
        section.style.setProperty(
          offsetProperty,
          originalOffset,
          originalPriority,
        )
      } else {
        section.style.removeProperty(offsetProperty)
      }
    }
  }, [scope, locale, setActive])
}
