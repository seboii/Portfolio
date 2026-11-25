import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import "../styles/spider-hunt.css"

gsap.registerPlugin(MotionPathPlugin)

export type HuntState = "idle" | "chasing" | "caught" | "returning"

interface SpiderHuntOptions {
  stageRef: RefObject<HTMLDivElement | null>
  spiderRef: RefObject<HTMLDivElement | null>
  trailRef: RefObject<SVGPathElement | null>
  targetId: string | null
  layer: number
  paused?: boolean
}

type Point = {
  x: number
  y: number
}
type HuntRequest = Pick<SpiderHuntOptions, "targetId" | "layer" | "paused">
type HuntController = { update: (request: HuntRequest) => void }

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y)
const coordinate = (point: Point) =>
  `${point.x.toFixed(2)} ${point.y.toFixed(2)}`

/** Uneven silk knots connect the route; the final strand points at the fly. */
function threadPath(start: Point, end: Point, returning: boolean) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.hypot(dx, dy) || 1
  const bend = Math.min(28, length * 0.055) * (returning ? -1 : 1)
  const nx = -dy / length
  const ny = dx / length
  const at = (progress: number, offset = 0) => ({
    x: start.x + dx * progress + nx * offset,
    y: start.y + dy * progress + ny * offset,
  })
  return `M${coordinate(start)}C${coordinate(at(0.09, bend * 0.3))} ${coordinate(at(0.17, bend))} ${coordinate(at(0.26, bend))}C${coordinate(at(0.35, bend))} ${coordinate(at(0.46, -bend * 0.7))} ${coordinate(at(0.57, -bend * 0.7))}C${coordinate(at(0.7, -bend * 0.7))} ${coordinate(at(0.85))} ${coordinate(end)}`
}

/** Moves the complete spider to measured fly positions, rather than an offset hint. */
export default function useSpiderHunt({
  stageRef,
  spiderRef,
  trailRef,
  targetId,
  layer,
  paused = false,
}: SpiderHuntOptions): HuntState {
  const [huntState, setHuntState] = useState<HuntState>("idle")
  const controller = useRef<HuntController | null>(null)
  const latest = useRef<HuntRequest>({ targetId, layer, paused })

  useEffect(() => {
    const currentStage = stageRef.current
    const currentSpider = spiderRef.current
    const currentTrail = trailRef.current
    const currentTrailSvg = currentTrail?.ownerSVGElement
    if (!currentStage || !currentSpider || !currentTrail || !currentTrailSvg)
      return
    const stage: HTMLDivElement = currentStage
    const spider: HTMLDivElement = currentSpider
    const trail: SVGPathElement = currentTrail
    const trailSvg: SVGSVGElement = currentTrailSvg

    let disposed = false
    let state: HuntState = "idle"
    let request = latest.current
    let activeTarget: string | null = null
    let targetPosition: HTMLElement | null = null
    let timeline: gsap.core.Timeline | null = null
    let generation = 0
    let resizeFrame = 0
    let inView = true
    let width = 0
    let height = 0
    let lastGeometry = ""
    let nest: Point = { x: 0, y: 0 }
    const position = { x: 0, y: 0, rotation: 0 }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const initialSpiderStyle = spider.getAttribute("style")
    const initialTrailStyle = trail.getAttribute("style")
    const initialTrailPath = trail.getAttribute("d")
    const initialViewBox = trailSvg.getAttribute("viewBox")
    const initialAspect = trailSvg.getAttribute("preserveAspectRatio")
    const initialTrailMarker = trail.getAttribute("data-hunt-trail")
    const initialSvgMarker = trailSvg.getAttribute("data-spider-hunt")
    const initialStageState = stage.getAttribute("data-hunt-state")
    const initialStageTarget = stage.getAttribute("data-hunt-target")
    const initialSpiderState = spider.getAttribute("data-hunt-state")
    const initialSpiderTarget = spider.getAttribute("data-hunt-target")

    function reducedMotion() {
      const preference = document.documentElement.dataset.motion
      return preference === "reduce" || (preference !== "full" && media.matches)
    }

    function isPaused() {
      return Boolean(request.paused) || !inView || document.hidden
    }

    function setState(next: HuntState, target: string | null = activeTarget) {
      state = next
      stage.dataset.huntState = next
      spider.dataset.huntState = next
      for (const element of [stage, spider]) {
        if (target) element.dataset.huntTarget = target
        else delete element.dataset.huntTarget
      }
      spider.classList.toggle(
        "is-walking",
        next === "chasing" || next === "returning",
      )
      spider.classList.toggle("is-paused", isPaused())
      if (!disposed)
        setHuntState((previous) => (previous === next ? previous : next))
    }

    function paint() {
      gsap.set(spider, {
        x: position.x,
        y: position.y,
        rotation: position.rotation,
      })
    }

    function relativeCenter(element: Element): Point {
      const stageBox = stage.getBoundingClientRect()
      const box = element.getBoundingClientRect()
      const scaleX = stageBox.width / (stage.offsetWidth || stageBox.width || 1)
      const scaleY =
        stageBox.height / (stage.offsetHeight || stageBox.height || 1)
      return {
        x:
          (box.left + box.width / 2 - stageBox.left) / scaleX -
          stage.clientLeft,
        y: (box.top + box.height / 2 - stageBox.top) / scaleY - stage.clientTop,
      }
    }

    function measure() {
      const oldWidth = width
      const oldHeight = height
      width = stage.clientWidth || stage.getBoundingClientRect().width
      height = stage.clientHeight || stage.getBoundingClientRect().height
      const nestElement = stage.querySelector<HTMLElement>(".web-nest")
      const nestCenter = nestElement
        ? relativeCenter(nestElement)
        : { x: width * 0.5, y: height * 0.55 }
      // A perch just above the nest keeps its small entrance visible at home.
      const spiderWidth = spider.offsetWidth
      nest = {
        x: nestCenter.x + spiderWidth * 0.7,
        y: nestCenter.y - spiderWidth * 0.6,
      }
      trailSvg.setAttribute("viewBox", `0 0 ${width} ${height}`)
      trailSvg.setAttribute("preserveAspectRatio", "none")
      if (
        oldWidth &&
        oldHeight &&
        (oldWidth !== width || oldHeight !== height)
      ) {
        position.x *= width / oldWidth
        position.y *= height / oldHeight
      }
      return (
        Math.abs(oldWidth - width) > 0.5 || Math.abs(oldHeight - height) > 0.5
      )
    }

    function findTarget(id: string | null) {
      if (!id) return null
      // Comparing dataset values avoids interpolating project names into selectors.
      const node = Array.from(
        stage.querySelectorAll<HTMLElement>(".project-node[data-project]"),
      ).find((element) => element.dataset.project === id)
      if (!node) return null
      const wrapper = node.closest<HTMLElement>(".project-node-position")
      const fly = node.querySelector<HTMLElement>(".node-fly")
      if (
        !wrapper ||
        !fly ||
        wrapper.inert ||
        wrapper.getClientRects().length === 0 ||
        getComputedStyle(wrapper).visibility === "hidden"
      )
        return null
      return { wrapper, fly }
    }

    function stopTimeline() {
      generation += 1
      timeline?.kill()
      timeline = null
    }

    function releaseFly() {
      targetPosition?.classList.remove("is-caught", "is-targeted")
      targetPosition = null
    }

    function endpoint(fly: HTMLElement): Point {
      const center = relativeCenter(fly)
      const dx = center.x - position.x
      const dy = center.y - position.y
      const length = Math.hypot(dx, dy) || 1
      const touchingDistance = Math.min(
        32,
        Math.max(28, spider.offsetWidth * 0.34),
      )
      return {
        x: center.x - (dx / length) * touchingDistance,
        y: center.y - (dy / length) * touchingDistance,
      }
    }

    function finish(returning: boolean, expectedGeneration: number) {
      if (disposed || expectedGeneration !== generation) return
      timeline = null
      if (returning) {
        position.x = nest.x
        position.y = nest.y
        position.rotation = 0
        paint()
        gsap.set(trail, { opacity: 0 })
        activeTarget = null
        setState("idle", null)
      } else {
        targetPosition?.classList.add("is-caught")
        setState("caught")
      }
    }

    function crawl(end: Point, returning: boolean) {
      const start = { x: position.x, y: position.y }
      const path = threadPath(start, end, returning)
      const travel = distance(start, end)
      const duration = Math.min(1.6, Math.max(1, 0.95 + travel / 640))
      const currentGeneration = generation
      trail.setAttribute("d", path)
      const pathLength = Math.max(1, trail.getTotalLength())
      gsap.set(trail, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 0.75,
      })
      setState(
        returning ? "returning" : "chasing",
        returning ? null : activeTarget,
      )

      if (reducedMotion() || travel < 1) {
        position.x = end.x
        position.y = end.y
        position.rotation =
          (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI - 90
        paint()
        gsap.set(trail, { strokeDashoffset: 0 })
        finish(returning, currentGeneration)
        return
      }

      timeline = gsap.timeline({
        paused: true,
        onComplete: () => finish(returning, currentGeneration),
      })
      timeline.to(
        position,
        {
          motionPath: { path, autoRotate: -90 },
          duration,
          ease: "power1.inOut",
          onUpdate: paint,
        },
        0,
      )
      timeline.to(
        trail,
        { strokeDashoffset: 0, duration, ease: "power1.inOut" },
        0,
      )
      if (!isPaused()) timeline.play()
    }

    function reconcile(force = false) {
      if (disposed) return
      const target = findTarget(request.targetId)
      const nextTarget = target ? request.targetId : null
      if (
        !force &&
        nextTarget === activeTarget &&
        (state === "caught" || state === "chasing")
      )
        return
      if (!force && !nextTarget && (state === "idle" || state === "returning"))
        return
      stopTimeline()
      releaseFly()
      activeTarget = nextTarget
      if (target && nextTarget) {
        targetPosition = target.wrapper
        target.wrapper.classList.add("is-targeted")
        crawl(endpoint(target.fly), false)
      } else if (distance(position, nest) > 1) {
        crawl(nest, true)
      } else {
        position.x = nest.x
        position.y = nest.y
        position.rotation = 0
        paint()
        gsap.set(trail, { opacity: 0 })
        setState("idle", null)
      }
    }

    function syncPause() {
      const stopped = isPaused()
      spider.classList.toggle("is-paused", stopped)
      if (timeline) timeline.paused(stopped)
    }

    function refreshGeometry() {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        if (disposed) return
        measure()
        const signature = geometrySignature()
        if (signature === lastGeometry) return
        lastGeometry = signature
        if (state === "idle") {
          position.x = nest.x
          position.y = nest.y
          paint()
        } else if (state === "caught" && activeTarget === request.targetId) {
          const target = findTarget(activeTarget)
          if (target) {
            // Resize keeps an already caught fly wrapped rather than replaying the catch.
            const old = { x: position.x, y: position.y }
            const next = endpoint(target.fly)
            position.x = next.x
            position.y = next.y
            paint()
            trail.setAttribute("d", threadPath(nest, next, false))
            const length = Math.max(1, trail.getTotalLength())
            gsap.set(trail, { strokeDasharray: length, strokeDashoffset: 0 })
            if (distance(old, next) < 0.5) return
          } else reconcile(true)
        } else reconcile(true)
      })
    }

    function geometrySignature() {
      const target = findTarget(request.targetId)
      const fly = target ? relativeCenter(target.fly) : null
      return [
        width,
        height,
        spider.offsetWidth,
        nest.x,
        nest.y,
        fly?.x ?? 0,
        fly?.y ?? 0,
      ]
        .map((value) => value.toFixed(1))
        .join(":")
    }

    function motionChanged() {
      reconcile(true)
      syncPause()
    }

    measure()
    position.x = nest.x
    position.y = nest.y
    gsap.set(spider, {
      left: 0,
      top: 0,
      margin: 0,
      xPercent: -50,
      yPercent: -50,
      x: position.x,
      y: position.y,
      rotation: 0,
      transformOrigin: "50% 50%",
    })
    trail.dataset.huntTrail = "true"
    trailSvg.dataset.spiderHunt = "true"
    gsap.set(trail, { opacity: 0 })
    setState("idle", null)

    controller.current = {
      update(next) {
        const layerChanged = request.layer !== next.layer
        request = next
        measure()
        reconcile(layerChanged)
        syncPause()
        lastGeometry = geometrySignature()
      },
    }
    reconcile()
    lastGeometry = geometrySignature()

    const resizeObserver = new ResizeObserver(refreshGeometry)
    resizeObserver.observe(stage)
    resizeObserver.observe(spider)
    const nestElement = stage.querySelector<HTMLElement>(".web-nest")
    if (nestElement) resizeObserver.observe(nestElement)
    const placementObserver = new MutationObserver(refreshGeometry)
    // Randomized inline positions can change without a resize of the stage.
    stage
      .querySelectorAll<HTMLElement>(".project-node-position, .node-fly")
      .forEach((node) => {
        resizeObserver.observe(node)
        placementObserver.observe(node, {
          attributes: true,
          attributeFilter: ["style"],
        })
      })
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        syncPause()
      },
      { threshold: 0.03 },
    )
    visibilityObserver.observe(stage)
    const preferenceObserver = new MutationObserver(motionChanged)
    preferenceObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    })
    media.addEventListener("change", motionChanged)
    document.addEventListener("visibilitychange", syncPause)
    window.addEventListener("resize", refreshGeometry)

    return () => {
      disposed = true
      controller.current = null
      stopTimeline()
      releaseFly()
      cancelAnimationFrame(resizeFrame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      preferenceObserver.disconnect()
      placementObserver.disconnect()
      media.removeEventListener("change", motionChanged)
      document.removeEventListener("visibilitychange", syncPause)
      window.removeEventListener("resize", refreshGeometry)
      spider.classList.remove("is-walking", "is-paused")
      const restore = (
        element: Element,
        name: string,
        value: string | null,
      ) => {
        if (value === null) element.removeAttribute(name)
        else element.setAttribute(name, value)
      }
      restore(spider, "style", initialSpiderStyle)
      restore(trail, "style", initialTrailStyle)
      restore(trail, "d", initialTrailPath)
      restore(trail, "data-hunt-trail", initialTrailMarker)
      restore(trailSvg, "viewBox", initialViewBox)
      restore(trailSvg, "preserveAspectRatio", initialAspect)
      restore(trailSvg, "data-spider-hunt", initialSvgMarker)
      restore(stage, "data-hunt-state", initialStageState)
      restore(stage, "data-hunt-target", initialStageTarget)
      restore(spider, "data-hunt-state", initialSpiderState)
      restore(spider, "data-hunt-target", initialSpiderTarget)
    }
  }, [stageRef, spiderRef, trailRef])

  useEffect(() => {
    latest.current = { targetId, layer, paused }
    controller.current?.update(latest.current)
  }, [targetId, layer, paused])

  return huntState
}
