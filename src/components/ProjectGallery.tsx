import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import type { Locale } from "../content"
import { getProjectMedia, projectMediaSrc } from "../data/project-media"
import "../styles/project-gallery.css"
import BridgeMeetingMotion from "./BridgeMeetingMotion"

interface ProjectGalleryProps {
  projectId: string
  locale: Locale
  variant?: "compact" | "hero" | "full"
  selectedId?: string
  onSelect?: (id: string, navigate: boolean) => void
  scrollDriven?: boolean
}

function GalleryIcon({
  kind,
}: {
  kind: "previous" | "next" | "play" | "pause" | "zoom" | "close"
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {kind === "previous" && <path d="m14 6-6 6 6 6" />}
      {kind === "next" && <path d="m10 6 6 6-6 6" />}
      {kind === "play" && <path d="m9 6 9 6-9 6Z" />}
      {kind === "pause" && <path d="M9 6v12M15 6v12" />}
      {kind === "zoom" && (
        <>
          <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
        </>
      )}
      {kind === "close" && <path d="m6 6 12 12M18 6 6 18" />}
    </svg>
  )
}

export default function ProjectGallery({
  projectId,
  locale,
  variant = "full",
  selectedId,
  onSelect,
  scrollDriven = false,
}: ProjectGalleryProps) {
  const items = getProjectMedia(projectId)
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(variant !== "full")
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(true)
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const enlargeButton = useRef<HTMLButtonElement>(null)
  const captionId = useId()
  const current = items[index % items.length]
  const previousLabel = {
    tr: "Önceki görsel",
    en: "Previous image",
    ru: "Предыдущее изображение",
  }[locale]
  const nextLabel = {
    tr: "Sonraki görsel",
    en: "Next image",
    ru: "Следующее изображение",
  }[locale]
  const paused =
    hovered || focused || !inView || !visible || reducedMotion || zoomed

  useEffect(() => {
    if (!selectedId) return
    const nextIndex = items.findIndex((item) => item.id === selectedId)
    if (nextIndex >= 0) {
      setIndex(nextIndex)
      setAutoplay(false)
    }
  }, [items, selectedId])

  useEffect(() => {
    if (!root.current || !items.length) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => {
      const motion = document.documentElement.dataset.motion
      setReducedMotion(
        motion === "reduce" || (motion !== "full" && preference.matches),
      )
    }
    const updateVisibility = () => setVisible(!document.hidden)
    updatePreference()
    updateVisibility()
    preference.addEventListener("change", updatePreference)
    document.addEventListener("visibilitychange", updateVisibility)
    const motionObserver = new MutationObserver(updatePreference)
    motionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    })
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(root.current)
    return () => {
      preference.removeEventListener("change", updatePreference)
      document.removeEventListener("visibilitychange", updateVisibility)
      motionObserver.disconnect()
      observer.disconnect()
    }
  }, [items.length])

  useEffect(() => {
    if (scrollDriven || !autoplay || paused || items.length < 2) return
    const timer = window.setInterval(
      () => setIndex((previous) => (previous + 1) % items.length),
      6500,
    )
    return () => window.clearInterval(timer)
  }, [autoplay, paused, items.length, index, scrollDriven])

  useEffect(() => {
    if (!zoomed) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [zoomed])

  if (!current) return null

  function select(next: number) {
    const nextIndex = (next + items.length) % items.length
    setAutoplay(false)
    setIndex(nextIndex)
    onSelect?.(items[nextIndex].id, !zoomed)
  }

  function closeZoom() {
    dialog.current?.close()
  }

  return (
    <div
      className={`project-gallery project-gallery--${variant}`}
      data-project-gallery={projectId}
      data-gallery-variant={variant}
      data-gallery-scroll={scrollDriven}
      data-gallery-current={current.id}
      data-autoplay={!scrollDriven && autoplay && !paused}
      style={{ "--gallery-count": items.length } as CSSProperties}
      ref={root}
      role="group"
      aria-label={
        { tr: "Proje ekranları", en: "Project screens", ru: "Экраны проекта" }[
          locale
        ]
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          select(index - 1)
        }
        if (event.key === "ArrowRight") {
          event.preventDefault()
          select(index + 1)
        }
      }}
    >
      <div className="project-gallery-stage" aria-describedby={captionId}>
        <div
          key={current.id}
          className="project-gallery-capture"
          style={
            {
              "--capture-ratio": current.width / current.height,
            } as CSSProperties
          }
        >
          <img
            className="project-gallery-screen"
            src={projectMediaSrc(current.src)}
            width={current.width}
            height={current.height}
            alt={current.alt[locale]}
            loading={variant === "full" ? "lazy" : "eager"}
            decoding="async"
          />
          {projectId === "bridge" &&
            (current.id === "meeting" || current.id === "screenshare") && (
              <BridgeMeetingMotion
                phase={current.id}
                locale={locale}
                active={inView && visible && !reducedMotion && !zoomed}
              />
            )}
          {projectId === "badhabinot" &&
            (current.id === "dashboard" || current.id === "enrollment") && (
              <div
                className="badhabinot-camera-motion"
                data-camera-motion={current.id}
                data-active={inView && visible && !reducedMotion && !zoomed}
                aria-hidden="true"
              >
                <span />
                <i />
              </div>
            )}
        </div>
        {variant === "full" && (
          <button
            ref={enlargeButton}
            type="button"
            className="project-gallery-zoom"
            aria-label={
              {
                tr: "Görseli büyüt",
                en: "Enlarge image",
                ru: "Увеличить изображение",
              }[locale]
            }
            onClick={() => {
              setAutoplay(false)
              dialog.current?.showModal()
              setZoomed(true)
            }}
          >
            <GalleryIcon kind="zoom" />
          </button>
        )}
      </div>
      <div className="project-gallery-caption" id={captionId}>
        <div className="project-gallery-copy">
          <strong>{current.title[locale]}</strong>
          {variant === "full" && <p>{current.description[locale]}</p>}
        </div>
        <div className="project-gallery-controls">
          <span className="project-gallery-count" aria-hidden="true">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            data-gallery-control="previous"
            aria-label={previousLabel}
            onClick={() => select(index - 1)}
          >
            <GalleryIcon kind="previous" />
          </button>
          <button
            type="button"
            data-gallery-control="next"
            aria-label={nextLabel}
            onClick={() => select(index + 1)}
          >
            <GalleryIcon kind="next" />
          </button>
          {!scrollDriven && (
            <button
              type="button"
              data-gallery-control="autoplay"
              aria-label={
                autoplay
                  ? {
                      tr: "Otomatik geçişi durdur",
                      en: "Pause slideshow",
                      ru: "Приостановить слайд-шоу",
                    }[locale]
                  : {
                      tr: "Otomatik geçişi başlat",
                      en: "Play slideshow",
                      ru: "Запустить слайд-шоу",
                    }[locale]
              }
              aria-pressed={autoplay}
              onClick={() => setAutoplay((previous) => !previous)}
            >
              <GalleryIcon kind={autoplay ? "pause" : "play"} />
            </button>
          )}
        </div>
      </div>
      <div
        className="project-gallery-thumbnails"
        aria-label={
          {
            tr: "Görsel seçimi",
            en: "Image selection",
            ru: "Выбор изображения",
          }[locale]
        }
      >
        {items.map((item, itemIndex) => (
          <button
            key={item.id}
            className="project-gallery-thumbnail"
            type="button"
            data-gallery-thumbnail={item.id}
            aria-label={item.title[locale]}
            aria-pressed={index === itemIndex}
            onClick={() => select(itemIndex)}
          >
            {variant !== "compact" && (
              <img
                src={projectMediaSrc(item.src)}
                width={item.width}
                height={item.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            {variant === "full" && <span>{item.title[locale]}</span>}
          </button>
        ))}
      </div>
      {variant === "full" && (
        <dialog
          className="project-gallery-lightbox"
          ref={dialog}
          aria-label={current.title[locale]}
          onClose={() => {
            setZoomed(false)
            enlargeButton.current?.focus({ preventScroll: true })
            onSelect?.(current.id, true)
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeZoom()
          }}
        >
          <div className="project-gallery-lightbox-bar">
            <strong>{current.title[locale]}</strong>
            <div className="project-gallery-controls">
              <button
                type="button"
                aria-label={previousLabel}
                onClick={() => select(index - 1)}
              >
                <GalleryIcon kind="previous" />
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => select(index + 1)}
              >
                <GalleryIcon kind="next" />
              </button>
              <button
                type="button"
                aria-label={
                  {
                    tr: "Büyük görseli kapat",
                    en: "Close enlarged image",
                    ru: "Закрыть увеличенное изображение",
                  }[locale]
                }
                onClick={closeZoom}
              >
                <GalleryIcon kind="close" />
              </button>
            </div>
          </div>
          <img
            src={projectMediaSrc(current.src)}
            alt={current.alt[locale]}
            width={current.width}
            height={current.height}
          />
        </dialog>
      )}
    </div>
  )
}
