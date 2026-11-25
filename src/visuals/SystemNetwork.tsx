import { useId } from "react"
import type { Locale } from "../content"

const nodes = [
  { x: 255, y: 270, title: "UI", sub: "EXPERIENCE", n: "01", color: "#F3F1E9" },
  {
    x: 575,
    y: 155,
    title: "API",
    sub: "APPLICATION",
    n: "02",
    color: "#D7FF64",
  },
  {
    x: 765,
    y: 355,
    title: "REALTIME",
    sub: "CONNECTION",
    n: "03",
    color: "#92BCD4",
  },
  { x: 465, y: 520, title: "DATA", sub: "CONTEXT", n: "04", color: "#F3F1E9" },
  {
    x: 770,
    y: 650,
    title: "AI",
    sub: "INTELLIGENCE",
    n: "05",
    color: "#D7FF64",
  },
  {
    x: 165,
    y: 705,
    title: "DELIVERY",
    sub: "CONTINUITY",
    n: "06",
    color: "#92BCD4",
  },
]

const russianNodeLabels: Record<string, Pick<typeof nodes[number], "title" | "sub">> =
  {
    UI: { title: "UI", sub: "ОПЫТ" },
    API: { title: "API", sub: "ПРИЛОЖЕНИЕ" },
    REALTIME: { title: "ОНЛАЙН", sub: "СВЯЗЬ" },
    DATA: { title: "ДАННЫЕ", sub: "КОНТЕКСТ" },
    AI: { title: "ИИ", sub: "ИНТЕЛЛЕКТ" },
    DELIVERY: { title: "ДОСТАВКА", sub: "НЕПРЕРЫВНОСТЬ" },
  }

const ambientLinks = [
  { d: "M356 319C422 307 506 221 604 219", x: 356, y: 319 },
  { d: "M662 233C735 264 829 334 822 402", x: 662, y: 233 },
  { d: "M816 436C704 496 620 521 532 575", x: 816, y: 436 },
  { d: "M575 596C642 619 716 690 805 704", x: 575, y: 596 },
  { d: "M471 604C413 664 312 739 224 754", x: 471, y: 604 },
]

export default function SystemNetwork({
  locale,
  closing = false,
}: {
  locale: Locale
  closing?: boolean
}) {
  const id = useId()
  return (
    <svg
      className={
        "scene-svg system-network" + (closing ? " network-closing" : "")
      }
      viewBox="0 0 1120 900"
      aria-hidden="true"
      focusable="false"
      data-ambient-scene="network"
    >
      <defs>
        <pattern
          id={id + "-grid"}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M48 0H0V48"
            fill="none"
            stroke="#F3F1E9"
            strokeOpacity=".035"
          />
        </pattern>
        <linearGradient id={id + "-plane"} x2="1" y2="1">
          <stop stopColor="#26322B" stopOpacity=".85" />
          <stop offset="1" stopColor="#14191F" stopOpacity=".7" />
        </linearGradient>
        <radialGradient id={id + "-field"}>
          <stop stopColor="#D7FF64" stopOpacity=".06" />
          <stop offset="1" stopColor="#0B0D10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1120" height="900" fill={"url(#" + id + "-grid)"} />
      <ellipse
        cx="560"
        cy="490"
        rx="480"
        ry="420"
        fill={"url(#" + id + "-field)"}
      />
      <g
        className="network-orbits"
        fill="none"
        stroke="#A8AFBA"
        strokeOpacity=".13"
      >
        <path d="M90 500L560 84 1055 500 560 865Z" />
        <path d="M145 530L560 165 985 530 560 810Z" strokeDasharray="3 9" />
        <path d="M90 500H1055M560 84V865" strokeOpacity=".08" />
      </g>
      <g
        className="network-connections"
        fill="none"
        stroke="#D7FF64"
        strokeWidth="1.25"
      >
        <path className="draw-path" d="M356 319C422 307 506 221 604 219" />
        <path className="draw-path" d="M662 233C735 264 829 334 822 402" />
        <path className="draw-path" d="M816 436C704 496 620 521 532 575" />
        <path className="draw-path" d="M575 596C642 619 716 690 805 704" />
        <path className="draw-path" d="M471 604C413 664 312 739 224 754" />
        <path
          className="draw-path"
          d="M235 702C252 580 227 430 311 341"
          strokeDasharray="4 8"
          strokeOpacity=".45"
        />
      </g>
      <g
        className="ambient-links"
        fill="none"
        stroke="#D7FF64"
        strokeOpacity=".16"
      >
        {ambientLinks.map((link, index) => (
          <path key={index} data-ambient-path={index} d={link.d} />
        ))}
      </g>
      <g className="ambient-signals" fill="#D7FF64">
        {ambientLinks.map((link, index) => (
          <circle
            key={index}
            data-ambient-packet={index}
            cx={link.x}
            cy={link.y}
            r="5"
          />
        ))}
      </g>
      <circle
        className="ambient-pulse"
        cx="565"
        cy="408"
        r="35"
        fill="none"
        stroke="#D7FF64"
        strokeOpacity=".3"
      />
      <g fill="#D7FF64" className="network-packets">
        <circle className="packet" cx="457" cy="271" r="4" />
        <circle className="packet" cx="736" cy="302" r="4" />
        <circle className="packet" cx="679" cy="514" r="4" />
        <circle className="packet" cx="659" cy="646" r="4" />
        <circle className="packet" cx="369" cy="691" r="4" />
      </g>
      {nodes.map((node, index) => (
        <g key={node.n} transform={"translate(" + node.x + " " + node.y + ")"}>
          <g className="ambient-float" data-ambient-index={index}>
            <g className="network-node" data-depth={index % 2 === 0 ? -1 : 1}>
              <path
                d="M0 0L160-48 229-5 69 45Z"
                fill={"url(#" + id + "-plane)"}
                stroke={node.color}
                strokeOpacity=".35"
              />
              <path
                d="M0 0L69 45V124L0 79Z"
                fill="#14191F"
                fillOpacity=".8"
                stroke={node.color}
                strokeOpacity=".16"
              />
              <path
                d="M69 45L229-5V75L69 124Z"
                fill="#18221D"
                fillOpacity=".7"
                stroke={node.color}
                strokeOpacity=".26"
              />
              <path d="M69 45V124" stroke={node.color} strokeOpacity=".5" />
              <text
                x="32"
                y="13"
                fill={node.color}
                fontSize="12"
                className="svg-mono"
              >
                /{node.n}
              </text>
              <text
                x="84"
                y="65"
                fill="#F3F1E9"
                fontSize={node.title.length > 6 ? "23" : "32"}
                letterSpacing="-1"
              >
                {locale === "ru"
                  ? russianNodeLabels[node.title].title
                  : node.title}
              </text>
              <text
                x="85"
                y="91"
                fill="#A8AFBA"
                fontSize="9"
                className="svg-mono"
              >
                {locale === "ru" ? russianNodeLabels[node.title].sub : node.sub}
              </text>
              <circle cx="214" cy="12" r="3" fill={node.color} />
            </g>
          </g>
        </g>
      ))}
      <g className="network-center" transform="translate(520 408)">
        <path
          d="M0 0L45-27 91 0 45 27Z"
          fill="#D7FF64"
          fillOpacity=".14"
          stroke="#D7FF64"
          strokeOpacity=".6"
        />
        <text
          x="45"
          y="6"
          textAnchor="middle"
          fill="#D7FF64"
          fontSize="17"
          className="svg-mono"
        >
          SS
        </text>
      </g>
      <g fill="#A8AFBA" fontSize="10" className="svg-mono">
        <text x="65" y="110">
          {
            {
              tr: "SİSTEM / KATMANLAR",
              en: "SYSTEM / LAYERS",
              ru: "СИСТЕМА / СЛОИ",
            }[locale]
          }
        </text>
        <text x="940" y="810">
          {locale === "ru" ? "06 / НА СВЯЗИ" : "06 / CONNECTED"}
        </text>
      </g>
    </svg>
  )
}
