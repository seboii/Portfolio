import { useEffect, type RefObject } from "react"
import type { Locale } from "../content"

type Passage = {
  path: SVGPathElement
  length: number
  offset: number
  start: number
  end: number
}

type Point = {
  x: number
  y: number
}

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value))
const angleDelta = (from: number, to: number) =>
  ((((to - from) % 360) + 540) % 360) - 180
const readPoint = (value: string | undefined): Point => {
  const [x, y] = (value || "0 0").split(" ").map(Number)
  return { x, y }
}

// Scroll chooses the destination. A finite, speed-limited follow keeps wheel,
// touch and PageDown jumps on the silk; it stops scheduling frames on arrival.
export default function useResearchScroll(
  scope: RefObject<HTMLElement | null>,
  locale: Locale,
  setActive: (index: number) => void,
) {
  useEffect(() => {
    const section = scope.current
    const svg = section?.querySelector<SVGSVGElement>(".research-topology")
    const spider = svg?.querySelector<SVGGElement>("[data-research-spider]")
    if (!section || !svg || !spider) return

    const headings = Array.from(
      section.querySelectorAll<HTMLElement>(".evidence-signal h3"),
    )
    let totalLength = 0
    const passages: Passage[] = Array.from(
      svg.querySelectorAll<SVGPathElement>("[data-research-path]"),
    ).map((path) => {
      const length = path.getTotalLength()
      const passage = { path, length, offset: totalLength, start: 0, end: 0 }
      totalLength += length
      return passage
    })
    if (headings.length !== 4 || passages.length !== 3) return

    const legs = Array.from(
      spider.querySelectorAll<SVGGElement>("[data-research-leg]"),
    ).flatMap((group) => {
      const shape = group.querySelector<SVGPathElement>(
        "[data-research-leg-shape]",
      )
      return shape
        ? [
            {
              shape,
              initial: shape.getAttribute("d"),
              hip: readPoint(group.dataset.researchLegHip),
              knee: readPoint(group.dataset.researchLegKnee),
              foot: readPoint(group.dataset.researchLegFoot),
              side: Number(group.dataset.researchLegSide) || 1,
              phase: Number(group.dataset.researchLegPhase) || 0,
            },
          ]
        : []
    })
    const body = spider.querySelector<SVGGElement>("[data-research-body]")
    const initialTransform = spider.getAttribute("transform")
    const initialBody = body?.getAttribute("transform")
    let frame = 0
    let needsMeasure = false
    let alive = true
    let currentActive = -1
    let distance = 0
    let target = 0
    let targetProgress = 0
    let direction = 1
    let angle = 0
    let travelled = 0
    let previousTime = 0

    const measure = () => {
      const header =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 84
      const readingLine =
        header +
        Math.min(220, Math.max(96, (window.innerHeight - header) * 0.3))
      const tops = headings.map(
        (heading) => heading.getBoundingClientRect().top + window.scrollY,
      )
      passages.forEach((passage, index) => {
        const gap = tops[index + 1] - tops[index]
        const band = Math.min(
          380,
          Math.max(160, gap * 0.55),
          Math.max(1, gap - 100),
        )
        passage.end = tops[index + 1] - readingLine
        passage.start = passage.end - band
        passage.path.dataset.researchStart = passage.start.toFixed(2)
        passage.path.dataset.researchEnd = passage.end.toFixed(2)
      })
    }

    const updateTarget = () => {
      let progress = 0
      const scroll = window.scrollY
      for (let index = 0; index < passages.length; index++) {
        const passage = passages[index]
        if (scroll >= passage.end) progress = index + 1
        else {
          if (scroll > passage.start)
            progress =
              index + (scroll - passage.start) / (passage.end - passage.start)
          break
        }
      }
      targetProgress = progress
      const index = Math.min(Math.floor(progress), passages.length - 1)
      const passage = passages[index]
      target = passage.offset + passage.length * (progress - index)
    }

    const sample = () => {
      // At a junction, keep the tangent of the strand we arrived on.
      const passage =
        direction > 0
          ? passages.find((item) => distance <= item.offset + item.length)!
          : [...passages].reverse().find((item) => distance >= item.offset)!
      const along = clamp(distance - passage.offset, 0, passage.length)
      const point = passage.path.getPointAtLength(along)
      const before = passage.path.getPointAtLength(Math.max(0, along - 1))
      const after = passage.path.getPointAtLength(
        Math.min(passage.length, along + 1),
      )
      return {
        point,
        heading:
          (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI +
          (direction < 0 ? 180 : 0),
        progress: passages.indexOf(passage) + along / passage.length,
      }
    }

    const paint = (speed = 0) => {
      const { point, progress } = sample()
      const gait = clamp(speed / 140, 0, 1)
      const phase = (travelled / 58) * Math.PI * 2
      spider.setAttribute(
        "transform",
        `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${angle.toFixed(2)})`,
      )
      legs.forEach((leg) => {
        const step = phase + leg.phase
        const reach = Math.cos(step) * 4.2 * gait
        const lift = Math.max(0, -Math.sin(step)) * 3.2 * gait
        const kneeX = leg.knee.x + reach * 0.45
        const kneeY = leg.knee.y - leg.side * lift * 0.6
        const footX = leg.foot.x + reach
        const footY = leg.foot.y - leg.side * lift
        leg.shape.setAttribute(
          "d",
          `M${leg.hip.x} ${leg.hip.y}L${kneeX.toFixed(2)} ${kneeY.toFixed(2)}L${footX.toFixed(2)} ${footY.toFixed(2)}`,
        )
      })
      body?.setAttribute(
        "transform",
        `translate(0 ${(Math.sin(phase * 2) * 0.32 * gait).toFixed(3)})`,
      )
      const active = Math.min(3, Math.floor(progress + 0.000001))
      const arrived = Math.abs(target - distance) < 0.025
      svg.dataset.researchPosition = progress.toFixed(4)
      svg.dataset.researchTarget = targetProgress.toFixed(4)
      svg.dataset.researchDistance = distance.toFixed(3)
      svg.dataset.researchActive = String(active)
      svg.dataset.researchState = !arrived
        ? "walking"
        : Math.abs(progress - Math.round(progress)) < 0.000001
          ? "at-stop"
          : "on-thread"
      if (active !== currentActive) {
        currentActive = active
        setActive(active)
      }
    }

    const tick = (time: number) => {
      frame = 0
      if (!alive) return
      if (needsMeasure) {
        needsMeasure = false
        measure()
      }
      updateTarget()
      // A background tab's elapsed time must never become one giant step.
      const dt = clamp(previousTime ? time - previousTime : 16.67, 1, 32)
      previousTime = time
      const remaining = target - distance
      if (Math.abs(remaining) >= 0.025) direction = Math.sign(remaining)
      const facing = Math.abs(angleDelta(angle, sample().heading))
      const maxSpeed = 480 + clamp((Math.abs(remaining) - 180) * 0.6, 0, 300)
      const step =
        clamp(
          remaining * (1 - Math.exp(-dt / 85)),
          (-maxSpeed * dt) / 1000,
          (maxSpeed * dt) / 1000,
        ) * clamp(1 - facing / 140, 0.12, 1)
      if (Math.abs(remaining) < 0.025) distance = target
      else {
        distance = clamp(distance + step, 0, totalLength)
        direction = Math.sign(step) || direction
        travelled += Math.abs(step)
      }
      if (Math.abs(target - distance) < 0.025) distance = target
      const desiredAngle = sample().heading
      const turn = angleDelta(angle, desiredAngle)
      angle += clamp(turn * (1 - Math.exp(-dt / 65)), -dt * 0.65, dt * 0.65)
      if (Math.abs(angleDelta(angle, desiredAngle)) < 0.15) angle = desiredAngle
      const arrived = Math.abs(target - distance) < 0.025
      paint(arrived ? 0 : (Math.abs(step) * 1000) / dt)
      if (!arrived || Math.abs(angleDelta(angle, desiredAngle)) >= 0.15)
        frame = window.requestAnimationFrame(tick)
      else previousTime = 0
    }

    const schedule = (remeasure = false) => {
      needsMeasure ||= remeasure
      if (frame) return
      frame = window.requestAnimationFrame(tick)
    }
    const onScroll = () => schedule()
    const onLayout = () => schedule(true)
    measure()
    updateTarget()
    // A restored/deep-linked document begins at its reading position. Later
    // scroll jumps traverse every intervening strand rather than snapping.
    distance = target
    angle = sample().heading
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
      if (initialTransform === null) spider.removeAttribute("transform")
      else spider.setAttribute("transform", initialTransform)
      legs.forEach(({ shape, initial }) => {
        if (initial === null) shape.removeAttribute("d")
        else shape.setAttribute("d", initial)
      })
      if (body) {
        if (initialBody == null) body.removeAttribute("transform")
        else body.setAttribute("transform", initialBody)
      }
      delete svg.dataset.researchPosition
      delete svg.dataset.researchTarget
      delete svg.dataset.researchDistance
      delete svg.dataset.researchActive
      delete svg.dataset.researchState
      passages.forEach(({ path }) => {
        delete path.dataset.researchStart
        delete path.dataset.researchEnd
      })
    }
  }, [scope, locale, setActive])
}
