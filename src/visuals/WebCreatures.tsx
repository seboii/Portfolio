import { useId, type CSSProperties } from "react"
import "../styles/web-creatures.css"

interface FlyCreatureProps {
  color?: string
  active?: boolean
}

interface SpiderCreatureProps {
  active?: boolean
  looking?: "left" | "right" | "down" | "center"
}

const spiderLegs = [
  {
    d: "M99 98L73 78L48 45L24 27",
    joints: [
      [73, 78],
      [48, 45],
    ],
    pivot: "99px 98px",
  },
  {
    d: "M97 108L72 102L43 88L13 101",
    joints: [
      [72, 102],
      [43, 88],
    ],
    pivot: "97px 108px",
  },
  {
    d: "M98 119L68 132L45 151L26 175",
    joints: [
      [68, 132],
      [45, 151],
    ],
    pivot: "98px 119px",
  },
  {
    d: "M103 128L94 151L79 170L85 192",
    joints: [
      [94, 151],
      [79, 170],
    ],
    pivot: "103px 128px",
  },
  {
    d: "M121 98L147 78L172 45L196 27",
    joints: [
      [147, 78],
      [172, 45],
    ],
    pivot: "121px 98px",
  },
  {
    d: "M123 108L148 102L177 88L207 101",
    joints: [
      [148, 102],
      [177, 88],
    ],
    pivot: "123px 108px",
  },
  {
    d: "M122 119L152 132L175 151L194 175",
    joints: [
      [152, 132],
      [175, 151],
    ],
    pivot: "122px 119px",
  },
  {
    d: "M117 128L126 151L141 170L135 192",
    joints: [
      [126, 151],
      [141, 170],
    ],
    pivot: "117px 128px",
  },
] as const

/** A polished widow silhouette with articulated limbs and an illuminated hourglass. */
export function SpiderCreature({
  active = false,
  looking = "center",
}: SpiderCreatureProps) {
  const id = useId().replace(/:/g, "")
  const eyeOffset = looking === "left" ? -1 : looking === "right" ? 1 : 0

  return (
    <svg
      className={`web-creature web-creature--spider web-creature--look-${looking}${
        active ? " web-creature--active" : ""
      }`}
      viewBox="0 0 220 210"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-web-creature="spider"
    >
      <defs>
        <radialGradient id={`${id}-spider-shell`} cx=".3" cy=".2" r=".85">
          <stop stopColor="#3C4C5B" />
          <stop offset=".28" stopColor="#19222D" />
          <stop offset=".6" stopColor="#080C13" />
          <stop offset="1" stopColor="#020408" />
        </radialGradient>
        <linearGradient
          id={`${id}-spider-leg`}
          x1="25"
          y1="28"
          x2="180"
          y2="184"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#708898" />
          <stop offset=".35" stopColor="#253746" />
          <stop offset=".72" stopColor="#597182" />
          <stop offset="1" stopColor="#253542" />
        </linearGradient>
        <radialGradient id={`${id}-spider-aura`}>
          <stop stopColor="#E84858" stopOpacity=".08" />
          <stop offset="1" stopColor="#E84858" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        className="web-spider-aura"
        cx="110"
        cy="100"
        rx="87"
        ry="87"
        fill={`url(#${id}-spider-aura)`}
      />
      <g className="web-spider-pose">
        <g className="web-spider-legs">
          {spiderLegs.map((leg, index) => (
            <g
              key={index}
              className={`web-spider-leg web-spider-leg--${
                index % 2 === 0 ? "a" : "b"
              }`}
              style={
                {
                  "--leg-pivot": leg.pivot,
                  "--leg-delay": `${index * -0.36}s`,
                } as CSSProperties
              }
            >
              <path
                d={leg.d}
                stroke="#03070D"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={leg.d}
                stroke={`url(#${id}-spider-leg)`}
                strokeWidth="3.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={leg.d}
                stroke="#ADCDDB"
                strokeOpacity=".38"
                strokeWidth=".65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {leg.joints.map(([cx, cy], joint) => (
                <g key={joint}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill="#101B25"
                    stroke="#718C9C"
                    strokeWidth=".7"
                  />
                  <circle
                    cx={cx - 0.4}
                    cy={cy - 0.6}
                    r=".6"
                    fill="#C8E2EB"
                    fillOpacity=".65"
                  />
                </g>
              ))}
            </g>
          ))}
        </g>
        <g className="web-spider-body">
          <path
            d="M104 92L101 107H119L116 92"
            fill="#101925"
            stroke="#425768"
            strokeWidth="1"
          />
          <path
            className="widow-shell"
            d="M110 24C89 24 75 41 76 64C77 87 90 102 110 103C130 102 143 87 144 64C145 41 131 24 110 24Z"
            fill={`url(#${id}-spider-shell)`}
            stroke="var(--creature-edge)"
            strokeWidth="1.3"
          />
          <path
            d="M84 53C86 39 97 31 108 30"
            stroke="#D3E4EA"
            strokeOpacity=".6"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M86 59C88 46 94 42 99 40"
            stroke="#8BA6BA"
            strokeOpacity=".22"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M136 65C135 80 128 91 116 96"
            stroke="#415C74"
            strokeOpacity=".65"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M89 58V73L96 80M131 52V72L124 79"
            stroke="#506677"
            strokeOpacity=".55"
            strokeWidth=".8"
          />
          <circle cx="89" cy="57" r="1.4" fill="#7994A3" fillOpacity=".7" />
          <circle cx="131" cy="52" r="1.4" fill="#7994A3" fillOpacity=".7" />
          <path
            className="widow-hourglass"
            d="M100 50H120L110 63L120 77H100L110 63Z"
            fill="#EF4054"
          />
          <path
            d="M103 53H116L109 62"
            stroke="#FF8994"
            strokeOpacity=".6"
            strokeWidth=".8"
          />
          <ellipse
            cx="110"
            cy="115"
            rx="16"
            ry="19"
            fill={`url(#${id}-spider-shell)`}
            stroke="var(--creature-edge)"
            strokeWidth="1"
          />
          <path
            d="M102 102L99 111V121M118 103L121 111V119"
            stroke="#7891A2"
            strokeOpacity=".55"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M108 101V109M112 121V127"
            stroke="#EC5666"
            strokeOpacity=".6"
            strokeWidth="1"
          />
          <path
            d="M101 126L96 138L100 146M119 126L124 138L120 146"
            stroke="#5E7688"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse
            cx="110"
            cy="135"
            rx="11"
            ry="9"
            fill="#070D15"
            stroke="#566D7E"
            strokeWidth="1"
          />
          <path
            d="M104 142L106 149L109 146M116 142L114 149L111 146"
            fill="#101C29"
            stroke="#7D96A7"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {[104, 108, 112, 116].map((cx, index) => (
            <circle
              key={cx}
              cx={cx + eyeOffset}
              cy={index === 0 || index === 3 ? 134 : 136}
              r="1.25"
              fill="#EF6A78"
            />
          ))}
        </g>
      </g>
    </svg>
  )
}

const flyLegs = [
  "M66 62L54 55L44 49L36 53",
  "M64 75L51 80L41 77L34 82",
  "M65 85L54 100L49 112L44 115",
  "M84 62L96 55L106 49L114 53",
  "M86 75L99 80L109 77L116 82",
  "M85 85L96 100L101 112L106 115",
] as const

/** Compact digital fly: glass wings, a slim shell, and six understated legs. */
export function FlyCreature({
  color = "#D7FF64",
  active = false,
}: FlyCreatureProps) {
  const id = useId().replace(/:/g, "")

  return (
    <svg
      className={`web-creature web-creature--fly${
        active ? " web-creature--active" : ""
      }`}
      style={{ "--creature-accent": color } as CSSProperties}
      viewBox="0 0 150 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-web-creature="fly"
    >
      <defs>
        <linearGradient
          id={`${id}-fly-shell`}
          x1="64"
          y1="40"
          x2="84"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6B8396" />
          <stop offset=".32" stopColor="#26394A" />
          <stop offset="1" stopColor="#07111D" />
        </linearGradient>
        <linearGradient
          id={`${id}-fly-wing`}
          x1="28"
          y1="43"
          x2="70"
          y2="91"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6F5FF" stopOpacity=".65" />
          <stop offset=".5" stopColor="#9CCDE4" stopOpacity=".3" />
          <stop offset="1" stopColor="#8BC0D7" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <g className="web-fly-body">
        <g className="web-fly-legs">
          {flyLegs.map((d, index) => (
            <g
              key={d}
              className={`web-fly-leg web-fly-leg--${
                index % 2 === 0 ? "a" : "b"
              }`}
              style={{ "--leg-delay": `${index * -0.26}s` } as CSSProperties}
            >
              <path
                d={d}
                stroke="#0D1823"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={d}
                stroke="var(--creature-leg-edge)"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
        <g className="web-fly-wing web-fly-wing--left">
          <path
            d="M69 73C61 59 41 40 25 44C11 48 20 76 35 88C47 98 61 96 70 84Z"
            fill={`url(#${id}-fly-wing)`}
            stroke="var(--creature-wing-edge)"
            strokeWidth="1.2"
          />
          <path
            d="M66 78L29 51M50 64L36 79M57 84L37 88"
            stroke="var(--creature-wing-edge)"
            strokeOpacity=".5"
            strokeWidth=".85"
            strokeLinejoin="round"
          />
          <path
            d="M30 51L50 63L58 82L38 86Z"
            fill="var(--creature-accent)"
            fillOpacity=".1"
          />
          <path
            d="M28 47C20 48 21 59 25 66"
            stroke="#F0FAFF"
            strokeOpacity=".7"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>
        <g className="web-fly-wing web-fly-wing--right">
          <path
            d="M81 73C89 59 109 40 125 44C139 48 130 76 115 88C103 98 89 96 80 84Z"
            fill={`url(#${id}-fly-wing)`}
            stroke="var(--creature-wing-edge)"
            strokeWidth="1.2"
          />
          <path
            d="M84 78L121 51M100 64L114 79M93 84L113 88"
            stroke="var(--creature-wing-edge)"
            strokeOpacity=".5"
            strokeWidth=".85"
            strokeLinejoin="round"
          />
          <path
            d="M120 51L100 63L92 82L112 86Z"
            fill="var(--creature-accent)"
            fillOpacity=".1"
          />
          <path
            d="M122 47C130 48 129 59 125 66"
            stroke="#F0FAFF"
            strokeOpacity=".7"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M68 82C62 95 65 115 75 124C85 115 88 95 82 82Z"
          fill={`url(#${id}-fly-shell)`}
          stroke="var(--creature-edge)"
          strokeWidth="1.2"
        />
        <path
          d="M66 96Q75 101 84 96M68 107Q75 111 82 107"
          stroke="#8DAABD"
          strokeOpacity=".7"
          strokeWidth="1"
        />
        <path
          d="M71 89C69 99 71 111 75 117"
          stroke="#C4DDEB"
          strokeOpacity=".55"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          className="web-fly-led"
          d="M75 93V98M75 104V109M75 115V117"
          stroke="var(--creature-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse
          cx="75"
          cy="71"
          rx="11"
          ry="15"
          fill={`url(#${id}-fly-shell)`}
          stroke="var(--creature-edge)"
          strokeWidth="1.1"
        />
        <path
          d="M70 62L69 77M80 62L81 77"
          stroke="#9DB9CA"
          strokeOpacity=".55"
          strokeWidth=".9"
          strokeLinecap="round"
        />
        <path
          className="web-fly-led"
          d="M75 63V74"
          stroke="var(--creature-accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M70 45L67 37L63 35M80 45L83 37L87 35"
          stroke="var(--creature-leg-edge)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <ellipse
          cx="75"
          cy="49"
          rx="9"
          ry="9"
          fill="#182B3C"
          stroke="#7F9CAF"
          strokeWidth="1"
        />
        <ellipse
          cx="68.5"
          cy="49"
          rx="4.5"
          ry="6"
          fill="#213D4C"
          stroke="#92B5C7"
          strokeWidth=".8"
        />
        <ellipse
          cx="81.5"
          cy="49"
          rx="4.5"
          ry="6"
          fill="#213D4C"
          stroke="#92B5C7"
          strokeWidth=".8"
        />
        <path
          className="web-fly-led"
          d="M67 46V50M83 46V50"
          stroke="var(--creature-accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M71 42L75 40L79 42"
          stroke="#D0E7F2"
          strokeOpacity=".75"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export default function WebCreatures() {
  return <SpiderCreature />
}
