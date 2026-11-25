import { useId } from "react"

import type { Locale } from "./content"

export default function FlowDiagram({ locale }: { locale: Locale }) {
  const uniqueId = useId().replace(/:/g, "")
  const gridId = `system-grid-${uniqueId}`
  const fillId = `system-fill-${uniqueId}`
  return (
    <figure className="flow-diagram">
      <svg
        className="system-art"
        viewBox="0 0 720 370"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={gridId}
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path d="M30 0H0V30" stroke="currentColor" strokeOpacity=".045" />
          </pattern>
          <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#232a28" />
            <stop offset="1" stopColor="#101411" />
          </linearGradient>
        </defs>
        <rect width="720" height="370" fill={`url(#${gridId})`} />
        <g className="system-paths" stroke="#d7ff64" strokeOpacity=".55">
          <path d="M167 95H245Q270 95 270 120V165H335" />
          <path d="M365 185V250Q365 270 390 270H488" />
          <path d="M545 255H600V150Q600 130 580 130H525" />
          <path
            d="M555 315H230Q210 315 210 295V220H125"
            strokeDasharray="4 7"
          />
          <circle cx="270" cy="140" r="4" fill="#d7ff64" />
          <circle cx="425" cy="270" r="4" fill="#d7ff64" />
          <circle cx="600" cy="205" r="4" fill="#d7ff64" />
        </g>
        {[
          {
            x: 45,
            y: 40,
            w: 165,
            h: 120,
            n: "01",
            name: "UI",
            sub: { tr: "Deneyim", en: "Experience", ru: "Опыт" }[locale],
          },
          {
            x: 295,
            y: 120,
            w: 155,
            h: 105,
            n: "02",
            name: "API",
            sub: { tr: "Bağlantı", en: "Connection", ru: "Соединение" }[locale],
          },
          {
            x: 470,
            y: 220,
            w: 155,
            h: 108,
            n: "03",
            name: { tr: "DATA", en: "DATA", ru: "ДАННЫЕ" }[locale],
            sub: { tr: "Yapı", en: "Structure", ru: "Структура" }[locale],
          },
          {
            x: 450,
            y: 38,
            w: 170,
            h: 100,
            n: "04",
            name: { tr: "DELIVERY", en: "DELIVERY", ru: "ДОСТАВКА" }[locale],
            sub: { tr: "Teslimat", en: "Delivery", ru: "Поставка" }[locale],
          },
        ].map(({ x, y, w, h, n, name, sub }) => (
          <g className={`system-layer system-layer-${n}`} key={n}>
            <path
              d={`M${x} ${y + 12}l20-12h${w - 20}v${h - 12}l-20 12h-${w - 20}Z`}
              fill={`url(#${fillId})`}
              stroke="#788474"
              strokeOpacity=".4"
            />
            <path
              d={`M${x} ${y + 12}h${w - 20}l20-12M${x + w - 20} ${y + 12}v${h - 12}`}
              stroke="#788474"
              strokeOpacity=".4"
            />
            <text x={x + 16} y={y + 37} fill="#d7ff64" fontSize="10">
              /{n}
            </text>
            <text
              x={x + 16}
              y={y + 67}
              fill="#f3f1e9"
              fontSize={
                name === "DELIVERY" || name === "ДОСТАВКА" ? "18" : "24"
              }
            >
              {name}
            </text>
            <text x={x + 16} y={y + 88} fill="#a8afba" fontSize="10">
              {sub}
            </text>
          </g>
        ))}
        <path
          d="M30 340h100M660 25h30M675 10v30"
          stroke="#a8afba"
          strokeOpacity=".3"
        />
      </svg>
      <figcaption>
        {
          {
            tr: "Kavramsal görselleştirme",
            en: "Conceptual visualization",
            ru: "Концептуальная визуализация",
          }[locale]
        }{" "}
        <span>
          {locale === "ru"
            ? "UI → API → ДАННЫЕ → ДОСТАВКА"
            : "UI → API → DATA → DELIVERY"}
        </span>
      </figcaption>
    </figure>
  )
}
