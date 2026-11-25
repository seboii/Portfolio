import type { Locale } from "../content"

const positions = [
  [150, 160],
  [405, 120],
  [660, 185],
  [842, 326],
  [650, 453],
  [387, 500],
  [174, 422],
]
export default function IntelligenceScene({ locale }: { locale: Locale }) {
  const labels = {
    tr: [
      "ARAYÜZ / DEMO VERİ",
      "TENANT BAĞLAMI",
      "TOOLREGISTRY",
      "AI ORKESTRASYONU",
      "RAG / VEKTÖR BAĞLAMI",
      "RAPOR / İÇGÖRÜ",
      "E-POSTA ANALİZİ",
    ],
    en: [
      "UI / DEMO DATA",
      "TENANT CONTEXT",
      "TOOLREGISTRY",
      "AI ORCHESTRATION",
      "RAG / VECTOR CONTEXT",
      "REPORT / INSIGHT",
      "EMAIL ANALYSIS",
    ],
    ru: [
      "ИНТЕРФЕЙС / ДЕМО-ДАННЫЕ",
      "КОНТЕКСТ ОРГАНИЗАЦИИ",
      "TOOLREGISTRY",
      "ОРКЕСТРАЦИЯ ИИ",
      "RAG / ВЕКТОРНЫЙ КОНТЕКСТ",
      "ОТЧЁТ / ВЫВОДЫ",
      "АНАЛИЗ ПОЧТЫ",
    ],
  }[locale]
  return (
    <svg
      className="scene-svg intelligence-art"
      viewBox="0 0 1160 760"
      aria-hidden="true"
      focusable="false"
      data-ambient-scene="intelligence"
    >
      <g
        className="pipeline-grid"
        fill="none"
        stroke="#A8AFBA"
        strokeOpacity=".1"
      >
        <path d="M73 413L584 67 1081 392 574 727ZM176 413L584 137 978 392 574 657ZM276 413L584 205 878 392 574 589Z" />
        <path d="M73 413H1081M584 67L574 727" strokeDasharray="3 9" />
      </g>
      <g fill="none" strokeWidth="1.5">
        <path
          className="draw-path foundation-path"
          d="M283 181C342 135 390 152 437 153L692 220"
          stroke="#D7FF64"
        />
        <path
          className="draw-path scope-path"
          d="M765 250C850 272 909 323 900 367L720 492C610 534 481 554 422 536L241 465C167 434 166 238 283 181"
          stroke="#92BCD4"
          strokeDasharray="5 9"
          strokeOpacity=".55"
        />
      </g>
      <g
        className="ambient-links"
        fill="none"
        stroke="#D7FF64"
        strokeOpacity=".15"
      >
        <path data-ambient-path="0" d="M283 181C342 135 390 152 437 153" />
        <path data-ambient-path="1" d="M437 153L692 220" />
      </g>
      <g className="ambient-signals" fill="#D7FF64">
        <circle data-ambient-packet="0" cx="283" cy="181" r="5" />
        <circle data-ambient-packet="1" cx="437" cy="153" r="5" />
      </g>
      {positions.map(([x, y], i) => (
        <g key={i} transform={"translate(" + x + " " + y + ")"}>
          <g
            className={
              "pipeline-node " + (i < 3 ? "foundation-node" : "scoped-node")
            }
            data-layer={i}
          >
            <path
              d="M0 0L127-40 232 23 104 64Z"
              fill={i < 3 ? "#243026" : "#19242C"}
              stroke={i < 3 ? "#D7FF64" : "#92BCD4"}
              strokeOpacity={i < 3 ? ".55" : ".3"}
              strokeDasharray={i < 3 ? undefined : "4 6"}
            />
            <path
              d="M0 0V43L104 106 232 66V23M104 64V106"
              fill="none"
              stroke={i < 3 ? "#D7FF64" : "#92BCD4"}
              strokeOpacity=".2"
            />
            <text
              x="22"
              y="8"
              fill={i < 3 ? "#D7FF64" : "#92BCD4"}
              fontSize="10"
              className="svg-mono"
            >
              /{String(i + 1).padStart(2, "0")}
            </text>
            <text
              x="103"
              y="53"
              textAnchor="middle"
              fill="#F3F1E9"
              fontSize="11"
              className="svg-mono"
            >
              {labels[i]}
            </text>
            <circle
              cx="199"
              cy="34"
              r="3"
              fill={i < 3 ? "#D7FF64" : "#92BCD4"}
            />
            {i < 3 && (
              <circle
                className="ambient-pulse"
                cx="199"
                cy="34"
                r="11"
                fill="none"
                stroke="#D7FF64"
                strokeOpacity=".35"
              />
            )}
          </g>
        </g>
      ))}
      <g className="pipeline-packet" fill="#D7FF64">
        <path d="M339 157L347 151 355 157 347 163Z" />
        <path d="M563 187L571 181 579 187 571 193Z" />
      </g>
      <g fill="#A8AFBA" fontSize="11" className="svg-mono">
        <text x="74" y="69">
          {locale === "ru"
            ? "АРХИТЕКТУРА / ГРАНИЦЫ ВОЗМОЖНОСТЕЙ"
            : "ARCHITECTURE / CAPABILITY BOUNDARIES"}
        </text>
        <path d="M74 652H454M612 652H1080" stroke="#33383D" />
        <circle cx="82" cy="682" r="4" fill="#D7FF64" />
        <text x="99" y="687" fill="#D7FF64">
          {
            {
              tr: "UYGULANAN MİMARİ TEMEL",
              en: "IMPLEMENTED FOUNDATION",
              ru: "РЕАЛИЗОВАННАЯ ОСНОВА",
            }[locale]
          }
        </text>
        <path d="M617 682H638" stroke="#92BCD4" strokeDasharray="3 4" />
        <text x="648" y="687" fill="#92BCD4">
          {
            {
              tr: "AI MODÜLLERİ / TANIMLANAN KAPSAM",
              en: "AI MODULES / DEFINED SCOPE",
              ru: "МОДУЛИ ИИ / ЗАПЛАНИРОВАННЫЕ ФУНКЦИИ",
            }[locale]
          }
        </text>
      </g>
    </svg>
  )
}
