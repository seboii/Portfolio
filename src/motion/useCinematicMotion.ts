import type { RefObject } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import type { Locale } from "../content"

gsap.registerPlugin(ScrollTrigger, useGSAP)

function draw(
  timeline: gsap.core.Timeline,
  root: Element,
  selector: string,
  position: number,
  duration = 0.5,
) {
  root.querySelectorAll<SVGPathElement>(selector).forEach((path, index) => {
    const length = path.getTotalLength()
    // Dashed scope boundaries retain their semantic pattern throughout.
    if (
      path.classList.contains("scope-path") ||
      path.hasAttribute("stroke-dasharray")
    )
      return
    timeline.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration },
      position + index * 0.025,
    )
  })
}

function collaboration(tl: gsap.core.Timeline, root: Element) {
  tl.from(
    root.querySelector(".participant-b"),
    { opacity: 0.15, x: "+=24", duration: 0.3 },
    0,
  )
  draw(tl, root, ".peer-lines .draw-path", 0.12, 0.42)
  tl.from(
    root.querySelector(".message-stream"),
    { opacity: 0, y: "+=14", duration: 0.22 },
    0.44,
  )
  tl.fromTo(
    root.querySelector(".shared-frame"),
    { opacity: 0.15, scale: 0.94, transformOrigin: "center" },
    { opacity: 1, scale: 1, duration: 0.34 },
    0.6,
  )
  draw(tl, root, ".annotation path", 0.84, 0.22)
  tl.fromTo(
    root.querySelector(".remote-cursor"),
    { opacity: 0, x: -32, y: 20 },
    { opacity: 1, x: 0, y: 0, duration: 0.3 },
    0.76,
  )
  tl.from(
    root.querySelector(".translation-caption"),
    { opacity: 0, y: "+=10", duration: 0.2 },
    1,
  )
}
function pose(tl: gsap.core.Timeline, root: Element) {
  tl.fromTo(
    root.querySelector(".tracking-box"),
    { opacity: 0 },
    { opacity: 1, duration: 0.2 },
    0.05,
  )
  tl.fromTo(
    root.querySelectorAll(".pose-keypoint"),
    { opacity: 0, scale: 0.6, transformOrigin: "center" },
    { opacity: 1, scale: 1, stagger: 0.012, duration: 0.15 },
    0.2,
  )
  draw(tl, root, ".pose-bones .draw-path", 0.4, 0.25)
  tl.fromTo(
    root.querySelector(".scan-line"),
    { y: -90, opacity: 0 },
    { y: 270, opacity: 0.7, duration: 0.82, ease: "none" },
    0.15,
  )
  tl.fromTo(
    root.querySelector(".motion-trails"),
    { opacity: 0 },
    { opacity: 1, duration: 0.25 },
    0.69,
  )
  tl.from(
    root.querySelector(".pose-analysis"),
    { opacity: 0, x: "+=22", duration: 0.32 },
    0.83,
  )
  tl.fromTo(
    root.querySelector(".behavior-timeline"),
    { opacity: 0 },
    { opacity: 1, duration: 0.22 },
    1.02,
  )
}
function intelligence(tl: gsap.core.Timeline, root: Element) {
  root.querySelectorAll<SVGGElement>(".pipeline-node").forEach((node, i) => {
    tl.fromTo(
      node,
      { y: (i - 3) * 17, opacity: i < 3 ? 0.65 : 0.22 },
      { y: 0, opacity: 1, duration: 0.58 },
      i * 0.09,
    )
  })
  draw(tl, root, ".foundation-path", 0.15, 0.62)
  // Planned links remain dashed; revealing them illustrates scope, not completion.
  tl.fromTo(
    root.querySelector(".scope-path"),
    { opacity: 0.12 },
    { opacity: 0.55, duration: 0.45 },
    0.65,
  )
  tl.fromTo(
    root.querySelector(".pipeline-packet"),
    { opacity: 0 },
    { opacity: 1, duration: 0.24 },
    0.75,
  )
}

export default function useCinematicMotion(
  scope: RefObject<HTMLDivElement | null>,
  locale: Locale,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (reducedMotion || !scope.current) return
      const element = scope.current
      const media = gsap.matchMedia()
      let alive = true
      media.add("(min-width: 1100px) and (min-height: 650px)", () => {
        element.dataset.cinematicDesktop = "true"
        const header =
          document.querySelector(".site-header")?.getBoundingClientRect()
            .height || 84
        const hero = element.querySelector(".cinema-hero")!
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
          },
          defaults: { ease: "none" },
        })
        hero
          .querySelectorAll<SVGGElement>(".network-node")
          .forEach((node) =>
            heroTimeline.to(
              node,
              { y: Number(node.dataset.depth) * 65, duration: 1 },
              0,
            ),
          )
        heroTimeline.to(
          hero.querySelector(".network-orbits"),
          { rotation: 8, transformOrigin: "center", duration: 1 },
          0,
        )
        const builders = { collaboration, pose, intelligence }
        element
          .querySelectorAll<HTMLElement>(".system-chapter")
          .forEach((chapter) => {
            // Operations uses native sticky positioning and its own measured
            // headings. Keep its layers out of this independent scrub timeline.
            if (chapter.dataset.scene === "operations") return
            const kind = chapter.dataset.scene as keyof typeof builders
            const visual =
              chapter.querySelector<HTMLElement>(".chapter-visual")!
            const tl = gsap.timeline({
              scrollTrigger: {
                id: kind,
                trigger: visual,
                start: () => `top top+=${header + 20}`,
                endTrigger: chapter,
                end: "bottom bottom-=48",
                pin: visual,
                pinSpacing: false,
                scrub: 0.65,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
              defaults: { ease: "none" },
            })
            builders[kind](tl, chapter)
            tl.fromTo(
              chapter.querySelector(".chapter-architecture-strip"),
              { opacity: 0.15 },
              { opacity: 1, duration: 0.22 },
              1.02,
            )
            chapter.querySelectorAll(".chapter-steps li").forEach((step, i) => {
              gsap.fromTo(step, { borderColor: "#33383d" }, {
                borderColor: "#d7ff64",
                scrollTrigger: {
                  trigger: step,
                  start: "top 72%",
                  end: "top 34%",
                  scrub: true,
                },
              })
              tl.to({}, { duration: 0.02 }, 0.4 + i * 0.35)
            })
          })
        const career = element.querySelector(".career-trajectory")!
        const careerTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: career,
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.4,
          },
          defaults: { ease: "none" },
        })
        draw(careerTimeline, career, ".draw-path", 0, 1)
        const closing = element.querySelector(".closing-section")!
        const closingTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: closing,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 0.6,
          },
          defaults: { ease: "none" },
        })
        closing.querySelectorAll(".network-node").forEach((node) =>
          closingTimeline.to(
            node,
            {
              scale: 0.7,
              transformOrigin: "center",
              opacity: 0.32,
              duration: 1,
            },
            0,
          ),
        )
        closingTimeline.fromTo(
          closing.querySelector(".network-center"),
          { scale: 0.7, transformOrigin: "center" },
          { scale: 1.3, duration: 1 },
          0,
        )
        document.fonts.ready.then(() => {
          if (alive) ScrollTrigger.refresh()
        })
        return () => {
          delete element.dataset.cinematicDesktop
        }
      })
      return () => {
        alive = false
        media.revert()
        delete element.dataset.cinematicDesktop
      }
    },
    { scope, dependencies: [locale, reducedMotion], revertOnUpdate: true },
  )
}
