import FlowDiagram from "./FlowDiagram"
import type { Locale } from "./content"

type VisualKind = "operations" | "bridge" | "pose" | "system"

export default function ProjectVisual({
  visual = "system",
  locale,
}: {
  visual?: VisualKind
  locale: Locale
}) {
  if (visual === "operations") {
    return (
      <div className="visual visual-ops" aria-hidden="true">
        <div className="visual-top">
          <span>
            {
              {
                tr: "OPERASYON / AKIŞ",
                en: "OPERATIONS / FLOW",
                ru: "ОПЕРАЦИИ / ПОТОК",
              }[locale]
            }
          </span>
          <span>01 — 03</span>
        </div>
        <div className="ops-map">
          <svg viewBox="0 0 560 250" preserveAspectRatio="xMidYMid meet">
            <path d="M24 197 C95 165 112 90 187 107 S270 205 341 143 S430 42 535 75" />
            <circle cx="187" cy="107" r="6" />
            <circle cx="341" cy="143" r="6" />
            <circle cx="535" cy="75" r="6" />
            <path
              className="map-secondary"
              d="M40 52C140 40 160 200 270 190S405 208 535 150"
            />
          </svg>
          <div className="ops-stat">
            <small>
              {
                {
                  tr: "KAVRAMSAL SİSTEM",
                  en: "CONCEPTUAL SYSTEM",
                  ru: "КОНЦЕПТУАЛЬНАЯ СИСТЕМА",
                }[locale]
              }
            </small>
            <strong>
              {{ tr: "Akışta.", en: "In flow.", ru: "В движении." }[locale]}
            </strong>
          </div>
        </div>
        <div className="ops-rows">
          <span>
            01 /{" "}
            {
              {
                tr: "SENKRONİZASYON",
                en: "SYNCHRONIZATION",
                ru: "СИНХРОНИЗАЦИЯ",
              }[locale]
            }
          </span>
          <i />
          <b>{{ tr: "KAYNAK", en: "SOURCE", ru: "ИСТОЧНИК" }[locale]}</b>
          <span>
            02 /{" "}
            {
              { tr: "RİSK KURALLARI", en: "RISK RULES", ru: "ПРАВИЛА РИСКОВ" }[
                locale
              ]
            }
          </span>
          <i />
          <b>{{ tr: "ANALİZ", en: "ANALYSIS", ru: "АНАЛИЗ" }[locale]}</b>
          <span>
            03 /{" "}
            {
              { tr: "CANLI GÖRÜNÜM", en: "LIVE VIEW", ru: "ТЕКУЩЕЕ СОСТОЯНИЕ" }[
                locale
              ]
            }
          </span>
          <i />
          <b>{{ tr: "ARAYÜZ", en: "INTERFACE", ru: "ИНТЕРФЕЙС" }[locale]}</b>
        </div>
      </div>
    )
  }
  if (visual === "bridge") {
    return (
      <div className="visual visual-bridge" aria-hidden="true">
        <div className="bridge-head">
          <span>
            {
              {
                tr: "BİRLİKTE / BAĞLANTIDA",
                en: "TOGETHER / CONNECTED",
                ru: "ВМЕСТЕ / НА СВЯЗИ",
              }[locale]
            }
          </span>
          <i>02</i>
        </div>
        <div className="bridge-layout">
          <div className="speaker">
            <div className="soundwave">
              {[2, 5, 3, 7, 4, 8, 3, 6, 2, 5].map((n, i) => (
                <i key={i} style={{ height: `${n * 10}%` }} />
              ))}
            </div>
            <span>
              {
                {
                  tr: "SES / GÖRÜNTÜ",
                  en: "AUDIO / VIDEO",
                  ru: "АУДИО / ВИДЕО",
                }[locale]
              }
            </span>
          </div>
          <div className="chat">
            <span className="chat-label">
              {{ tr: "MESAJLAŞMA", en: "MESSAGING", ru: "СООБЩЕНИЯ" }[locale]}
            </span>
            <p>
              <i />
              {
                {
                  tr: "Aynı çalışma alanında.",
                  en: "In the same workspace.",
                  ru: "В одном рабочем пространстве.",
                }[locale]
              }
            </p>
            <p>
              <i />
              {
                {
                  tr: "Ekran paylaşımı. Ortak bağlam.",
                  en: "Screen sharing. Shared context.",
                  ru: "Демонстрация экрана. Общий контекст.",
                }[locale]
              }
            </p>
            <div className="typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="bridge-controls">
          <span>WebRTC</span>
          <i />
          <span>Socket.IO</span>
        </div>
      </div>
    )
  }
  if (visual === "pose") {
    return (
      <div className="visual visual-pose" aria-hidden="true">
        <div className="pose-head">
          <span>
            {
              {
                tr: "HAREKET / ÖRÜNTÜ",
                en: "MOTION / PATTERN",
                ru: "ДВИЖЕНИЕ / ПАТТЕРН",
              }[locale]
            }
          </span>
          <span>03</span>
        </div>
        <svg className="pose-figure" viewBox="0 0 500 360">
          <g className="pose-grid">
            <path d="M0 90h500M0 180h500M0 270h500M125 0v360M250 0v360M375 0v360" />
          </g>
          <g className="skeleton">
            <path d="M255 72l-4 57-52 60-45 64M251 129l53 55 63 16M251 129l15 84-30 83M266 213l61 75" />
            {[
              [255, 72],
              [251, 129],
              [199, 189],
              [154, 253],
              [304, 184],
              [367, 200],
              [266, 213],
              [236, 296],
              [327, 288],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="7" />
            ))}
            <circle className="head" cx="255" cy="50" r="22" />
          </g>
          <rect
            className="tracking-box"
            x="126"
            y="18"
            width="268"
            height="318"
          />
        </svg>
        <div className="pose-meta">
          <span>
            {
              { tr: "POZ TAHMİNİ", en: "POSE ESTIMATION", ru: "ОЦЕНКА ПОЗЫ" }[
                locale
              ]
            }
          </span>
          <strong>
            {{ tr: "KAVRAMSAL", en: "CONCEPTUAL", ru: "КОНЦЕПТ" }[locale]}
          </strong>
        </div>
      </div>
    )
  }
  return (
    <div className="visual visual-system" aria-hidden="true">
      <FlowDiagram locale={locale} />
    </div>
  )
}
