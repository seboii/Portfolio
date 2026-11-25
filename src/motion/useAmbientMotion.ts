import type { RefObject } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { useGSAP } from "@gsap/react"
import type { Locale } from "../content"

gsap.registerPlugin(MotionPathPlugin, useGSAP)

type SceneKind = "network" | "operations" | "collaboration" | "pose" | "intelligence"
type Scene = {
  element: SVGSVGElement
  timeline: gsap.core.Timeline
  visible: boolean
}

const cycles: Record<SceneKind, number> = {
  network: 8.4,
  operations: 6.8,
  collaboration: 6.4,
  pose: 5.8,
  intelligence: 8.8,
}

function property(element: Element, name: string, fallback: number) {
  const value = Number(gsap.getProperty(element, name))
  return Number.isFinite(value) ? value : fallback
}

function packets(
  timeline: gsap.core.Timeline,
  scene: SVGSVGElement,
  cycle: number,
) {
  const paths = new Map(
    Array.from(
      scene.querySelectorAll<SVGPathElement>("path[data-ambient-path]"),
    ).map((path) => [path.getAttribute("data-ambient-path"), path] as const),
  )
  scene
    .querySelectorAll<SVGElement>("[data-ambient-packet]")
    .forEach((packet) => {
      const path = paths.get(packet.getAttribute("data-ambient-packet"))
      if (!path) return
      timeline.fromTo(
        packet,
        { opacity: 0 },
        { opacity: 0.95, duration: 0.25 },
        0,
      )
      timeline.to(
        packet,
        {
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 1,
          },
          duration: cycle - 0.45,
          ease: "none",
        },
        0.15,
      )
      timeline.to(packet, { opacity: 0, duration: 0.3 }, cycle - 0.3)
    })
}

function floats(
  timeline: gsap.core.Timeline,
  scene: SVGSVGElement,
  cycle: number,
  amplitude: number,
) {
  scene
    .querySelectorAll<SVGElement>(".ambient-float")
    .forEach((target, index) => {
      const baseY = property(target, "y", 0)
      const direction = index % 2 === 0 ? 1 : -1
      timeline.fromTo(
        target,
        { y: baseY - amplitude * direction },
        {
          y: baseY + amplitude * direction,
          duration: cycle / 2,
          repeat: 1,
          yoyo: true,
          ease: "sine.inOut",
        },
        0,
      )
    })
}

function pulses(
  timeline: gsap.core.Timeline,
  scene: SVGSVGElement,
  cycle: number,
  expansion = 1.6,
) {
  scene
    .querySelectorAll<SVGElement>(".ambient-pulse")
    .forEach((target, index) => {
      const baseScaleX = property(target, "scaleX", 1)
      const baseScaleY = property(target, "scaleY", 1)
      const inverse = index % 2 !== 0
      timeline.fromTo(
        target,
        {
          scaleX: baseScaleX * (inverse ? expansion : 0.85),
          scaleY: baseScaleY * (inverse ? expansion : 0.85),
          opacity: inverse ? 0.12 : 0.72,
          transformOrigin: "50% 50%",
        },
        {
          scaleX: baseScaleX * (inverse ? 0.85 : expansion),
          scaleY: baseScaleY * (inverse ? 0.85 : expansion),
          opacity: inverse ? 0.72 : 0.12,
          duration: cycle / 2,
          repeat: 1,
          yoyo: true,
          ease: "sine.inOut",
        },
        0,
      )
    })
}

function collaboration(
  timeline: gsap.core.Timeline,
  scene: SVGSVGElement,
  cycle: number,
) {
  scene.querySelectorAll<SVGElement>(".ambient-cursor").forEach((cursor) => {
    const x = property(cursor, "x", 0)
    const y = property(cursor, "y", 0)
    timeline.to(cursor, { x: x + 24, y: y - 16, duration: cycle * 0.22 }, 0)
    timeline.to(
      cursor,
      { x: x - 14, y: y + 12, duration: cycle * 0.25 },
      cycle * 0.22,
    )
    timeline.to(
      cursor,
      { x: x + 8, y: y + 3, duration: cycle * 0.25 },
      cycle * 0.47,
    )
    timeline.to(cursor, { x, y, duration: cycle * 0.28 }, cycle * 0.72)
  })
  scene
    .querySelectorAll<SVGElement>(".ambient-message")
    .forEach((message, index) => {
      const y = property(message, "y", 0)
      timeline.fromTo(
        message,
        { y: y + (index % 2 === 0 ? 5 : -5), opacity: 0.35 },
        { y, opacity: 1, duration: cycle / 2, repeat: 1, yoyo: true },
        0,
      )
    })
}

function scan(
  timeline: gsap.core.Timeline,
  scene: SVGSVGElement,
  cycle: number,
) {
  scene.querySelectorAll<SVGElement>(".ambient-scan").forEach((line) => {
    const y = property(line, "y", 0)
    const requested = Number(line.getAttribute("data-ambient-distance"))
    const distance = requested > 0 ? requested : 430
    timeline.fromTo(line, { y, opacity: 0 }, { opacity: 0.8, duration: 0.4 }, 0)
    timeline.to(
      line,
      { y: y + distance, duration: cycle - 0.65, ease: "none" },
      0.2,
    )
    timeline.to(line, { opacity: 0, duration: 0.45 }, cycle - 0.45)
  })
}

function sceneGlows(
  timeline: gsap.core.Timeline,
  scene: SVGSVGElement,
  cycle: number,
) {
  scene
    .querySelectorAll<SVGElement>(".ambient-map-glow")
    .forEach((glow, index) => {
      const inverse = index % 2 !== 0
      timeline.fromTo(
        glow,
        { opacity: inverse ? 0.54 : 0.16 },
        {
          opacity: inverse ? 0.16 : 0.54,
          duration: cycle / 2,
          repeat: 1,
          yoyo: true,
          ease: "sine.inOut",
        },
        0,
      )
    })
}

function buildScene(element: SVGSVGElement): gsap.core.Timeline | null {
  const kind = element.getAttribute("data-ambient-scene") as SceneKind
  if (!Object.prototype.hasOwnProperty.call(cycles, kind)) return null
  const cycle = cycles[kind]
  const timeline = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { ease: "sine.inOut" },
  })
  // Only fresh ambient children are targets; scrub parents retain their transforms.
  packets(timeline, element, cycle)
  if (kind === "network") {
    floats(timeline, element, cycle, 8)
    pulses(timeline, element, cycle, 1.7)
  } else if (kind === "operations") {
    pulses(timeline, element, cycle, 2)
    sceneGlows(timeline, element, cycle)
  } else if (kind === "collaboration") {
    collaboration(timeline, element, cycle)
    pulses(timeline, element, cycle, 1.45)
  } else if (kind === "pose") {
    scan(timeline, element, cycle)
    pulses(timeline, element, cycle, 1.3)
  } else {
    // Intelligence traffic uses foundation-only paths provided by the visual.
    pulses(timeline, element, cycle, 1.5)
  }
  if (timeline.duration() === 0) {
    timeline.kill()
    return null
  }
  return timeline
}

export default function useAmbientMotion(
  scope: RefObject<HTMLElement | null>,
  locale: Locale,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (!scope.current || reducedMotion) return
      const scenes: Scene[] = []
      scope.current
        .querySelectorAll<SVGSVGElement>("svg[data-ambient-scene]")
        .forEach((element) => {
          const timeline = buildScene(element)
          if (timeline) scenes.push({ element, timeline, visible: false })
        })
      if (scenes.length === 0) return

      const updatePlayback = () => {
        scenes.forEach((scene) => {
          const play = scene.visible && !document.hidden
          if (play) scene.timeline.play()
          else scene.timeline.pause()
          scene.element.dataset.ambientState = play ? "playing" : "paused"
        })
      }
      const sceneByElement = new Map(
        scenes.map((scene) => [scene.element, scene]),
      )
      let observer: IntersectionObserver | undefined
      let viewportFallback: (() => void) | undefined

      if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const scene = sceneByElement.get(entry.target as SVGSVGElement)
              if (scene)
                scene.visible =
                  entry.isIntersecting && entry.intersectionRatio >= 0.01
            })
            updatePlayback()
          },
          { threshold: 0.01 },
        )
        scenes.forEach((scene) => observer?.observe(scene.element))
      } else {
        viewportFallback = () => {
          scenes.forEach((scene) => {
            const rect = scene.element.getBoundingClientRect()
            scene.visible =
              rect.width > 0 &&
              rect.height > 0 &&
              rect.bottom > 0 &&
              rect.top < window.innerHeight &&
              rect.right > 0 &&
              rect.left < window.innerWidth
          })
          updatePlayback()
        }
        window.addEventListener("scroll", viewportFallback, { passive: true })
        window.addEventListener("resize", viewportFallback, { passive: true })
        viewportFallback()
      }
      updatePlayback()
      document.addEventListener("visibilitychange", updatePlayback)

      return () => {
        observer?.disconnect()
        document.removeEventListener("visibilitychange", updatePlayback)
        if (viewportFallback) {
          window.removeEventListener("scroll", viewportFallback)
          window.removeEventListener("resize", viewportFallback)
        }
        scenes.forEach((scene) => {
          scene.timeline.pause()
          delete scene.element.dataset.ambientState
        })
        // useGSAP restores timelines and inline styles when the effective preference changes.
      }
    },
    { scope, dependencies: [locale, reducedMotion], revertOnUpdate: true },
  )
}
