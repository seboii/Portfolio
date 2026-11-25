import type { Locale } from "../content"

type Point = readonly [number, number]
type Junction = readonly [number, number]

const hub: Point = [383, 317]
const angles = [
  -105, -83, -59, -34, -16, 5, 27, 39, 66, 84, 104, 123, 143, 163, 183, 204,
  220, 237,
]
const levels = [0.1, 0.18, 0.285, 0.395, 0.54, 0.695, 0.84, 0.99]
const number = (value: number) => value.toFixed(2)
const xy = ([x, y]: Point) => `${number(x)} ${number(y)}`
const random = (seed: number) => {
  let value = Math.imul(seed + 1, 1664525) + 1013904223
  value ^= value >>> 16
  value = Math.imul(value, 2246822519)
  value ^= value >>> 13
  return (value >>> 0) / 4294967296
}
const tips: readonly Point[] = angles.map((degrees, index) => {
  const angle = (degrees * Math.PI) / 180
  const reach = 0.88 + random(index + 20) * 0.23
  return [
    hub[0] + Math.cos(angle) * 335 * reach,
    hub[1] + Math.sin(angle) * 278 * reach,
  ]
})

// A slight strand bow, uneven spacing, and varied sag keep the silk restrained.
// Rounded module-defined coordinates stay fixed across SSR, locale, and active updates.
const rings: ReadonlyArray<ReadonlyArray<Point>> = levels.map((level, ring) =>
  tips.map(([x, y], spoke) => {
    const radius = level + (random(ring * 31 + spoke + 100) - 0.5) * 0.035
    const bend = Math.sin(level * Math.PI) * (random(spoke + 200) - 0.5) * 17
    const angle = (angles[spoke] * Math.PI) / 180
    return [
      hub[0] + (x - hub[0]) * radius - Math.sin(angle) * bend,
      hub[1] + (y - hub[1]) * radius + Math.cos(angle) * bend,
    ] as const
  }),
)
const radialControls: ReadonlyArray<ReadonlyArray<Point>> = tips.map(
  (_, spoke) =>
    rings.map((points, ring) => {
      const from = ring === 0 ? hub : rings[ring - 1][spoke]
      const to = points[spoke]
      const angle = (angles[spoke] * Math.PI) / 180
      const bow = (random(spoke * 23 + ring + 300) - 0.5) * 6
      return [
        (from[0] + to[0]) / 2 - Math.sin(angle) * bow,
        (from[1] + to[1]) / 2 + Math.cos(angle) * bow,
      ] as const
    }),
)
const ringControls: ReadonlyArray<ReadonlyArray<Point>> = rings.map(
  (points, ring) =>
    points.map((from, spoke) => {
      const to = points[(spoke + 1) % angles.length]
      const mid: Point = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
      const dx = hub[0] - mid[0]
      const dy = hub[1] - mid[1]
      const towardHub = Math.hypot(dx, dy)
      const sag =
        Math.hypot(to[0] - from[0], to[1] - from[1]) *
        (0.1 + random(ring * 37 + spoke + 400) * 0.18)
      return [
        mid[0] + (dx / towardHub) * sag,
        mid[1] + (dy / towardHub) * sag,
      ] as const
    }),
)
const spokePaths = tips.map(
  (_, spoke) =>
    `M${xy(hub)}${rings
      .map(
        (points, ring) =>
          `Q${xy(radialControls[spoke][ring])} ${xy(points[spoke])}`,
      )
      .join("")}`,
)
const ringPaths = rings.map(
  (points, ring) =>
    `M${xy(points[0])}${points
      .map(
        (_, spoke) =>
          `Q${xy(ringControls[ring][spoke])} ${xy(points[(spoke + 1) % angles.length])}`,
      )
      .join("")}Z`,
)

function route(junctions: readonly Junction[]) {
  const [firstRing, firstSpoke] = junctions[0]
  const start = rings[firstRing][firstSpoke]
  const segments = junctions.slice(1).map(([ring, spoke], index) => {
    const [previousRing, previousSpoke] = junctions[index]
    const control =
      previousSpoke === spoke
        ? radialControls[spoke][Math.max(previousRing, ring)]
        : ringControls[ring][
            (previousSpoke + 1) % angles.length === spoke
              ? previousSpoke
              : spoke
          ]
    return `Q${xy(control)} ${xy(rings[ring][spoke])}`
  })
  return `M${xy(start)}${segments.join("")}`
}
const stops: readonly Junction[] = [
  [5, 2],
  [4, 7],
  [5, 11],
  [4, 15],
]
const journeys = [
  route([
    [5, 2],
    [4, 2],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
    [4, 7],
  ]),
  route([
    [4, 7],
    [5, 7],
    [6, 7],
    [6, 8],
    [6, 9],
    [6, 10],
    [6, 11],
    [5, 11],
  ]),
  route([
    [5, 11],
    [4, 11],
    [3, 11],
    [2, 11],
    [2, 12],
    [2, 13],
    [2, 14],
    [2, 15],
    [3, 15],
    [4, 15],
  ]),
]
const stopPoints = stops.map(([ring, spoke]) => rings[ring][spoke])
const legGeometry = [
  { hip: [2.73, -1.33], knee: [12.88, -8.51], foot: [20.74, -17.66] },
  { hip: [1.61, -2.17], knee: [7.36, -11.96], foot: [7.42, -23.04] },
  { hip: [0.21, -2.31], knee: [-7.13, -10.7], foot: [-14.98, -21.89] },
  { hip: [-0.98, -1.75], knee: [-12.42, -6.1], foot: [-23.81, -10.88] },
  { hip: [2.73, 1.33], knee: [12.88, 8.51], foot: [20.74, 17.66] },
  { hip: [1.61, 2.17], knee: [7.36, 11.96], foot: [7.42, 23.04] },
  { hip: [0.21, 2.31], knee: [-7.13, 10.7], foot: [-14.98, 21.89] },
  { hip: [-0.98, 1.75], knee: [-12.42, 6.1], foot: [-23.81, 10.88] },
] as const
const legPhases = [0, Math.PI, 0, Math.PI, Math.PI, 0, Math.PI, 0]

export default function ResearchTopology({
  active,
  locale,
}: {
  active: number
  locale: Locale
}) {
  const labels = {
    tr: ["ROTA / SİNYAL", "ANLIK / BAĞLANTI", "HAREKET / VERİ", "BAĞLAM / AI"],
    en: [
      "ROUTE / SIGNAL",
      "REAL TIME / CONNECTION",
      "MOVEMENT / DATA",
      "CONTEXT / AI",
    ],
    ru: [
      "МАРШРУТ / СИГНАЛ",
      "СВЯЗЬ / РЕАЛЬНОЕ ВРЕМЯ",
      "ДВИЖЕНИЕ / ДАННЫЕ",
      "КОНТЕКСТ / ИИ",
    ],
  }[locale]
  return (
    <svg
      className="scene-svg research-topology"
      data-scroll-scene="research"
      viewBox="0 0 850 680"
      aria-hidden="true"
    >
      <g
        className="research-topology-lines"
        fill="none"
        stroke="#C4CEC0"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {spokePaths.map((d, index) => (
          <path
            key={`spoke-${index}`}
            className="research-web-spoke"
            d={d}
            strokeWidth={number(0.64 + random(index + 600) * 0.35)}
            strokeOpacity={number(0.23 + random(index + 700) * 0.24)}
          />
        ))}
        {ringPaths.map((d, index) => (
          <path
            key={`ring-${index}`}
            className="research-web-ring"
            d={d}
            strokeWidth={number(0.5 + random(index + 800) * 0.3)}
            strokeOpacity={number(0.19 + random(index + 900) * 0.19)}
          />
        ))}
      </g>
      {stopPoints.map((point, index) => (
        <g
          className="research-node"
          data-research-node={index}
          key={index}
          transform={`translate(${xy(point)})`}
        >
          <circle
            r="3.50"
            fill="#0B0D10"
            stroke={index === active ? "#D7FF64" : "#BAC5B4"}
            strokeWidth="1.00"
          />
          <text
            x="34"
            y="-28"
            className="svg-mono"
            fontSize="12"
            fill={index === active ? "#D7FF64" : "#BAC5B4"}
          >
            0{index + 1}
          </text>
        </g>
      ))}
      <g fill="none" stroke="none">
        {journeys.map((d, index) => (
          <path key={index} data-research-path={index} d={d} />
        ))}
      </g>
      <g
        className="research-spider"
        data-research-spider
        transform={`translate(${xy(stopPoints[0])})`}
      >
        <g
          className="research-spider-legs"
          fill="none"
          stroke="#DDD5C1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {legGeometry.map(({ hip, knee, foot }, index) => (
            <g
              key={index}
              className="research-spider-leg"
              data-research-leg={index}
              data-research-leg-hip={xy(hip)}
              data-research-leg-knee={xy(knee)}
              data-research-leg-foot={xy(foot)}
              data-research-leg-side={index < 4 ? -1 : 1}
              data-research-leg-phase={number(legPhases[index])}
              strokeWidth={index % 4 < 2 ? "1.55" : "1.40"}
              strokeOpacity={index % 4 < 2 ? "0.96" : "0.86"}
            >
              <path
                data-research-leg-shape
                d={`M${xy(hip)}L${xy(knee)}L${xy(foot)}`}
              />
            </g>
          ))}
        </g>
        <g className="research-spider-body" data-research-body>
          <g transform="scale(0.70)">
            <path
              className="research-spider-abdomen"
              d="M-1.70-3.60C-4.20-6.45-11.90-6.15-13.35-1.30C-14.20 2.05-10.10 5.95-5.20 5.05C-2.95 4.65-0.90 2.75-0.80 0.50C-0.55-1.20-1.00-2.65-1.70-3.60Z"
              fill="#3D3B30"
              stroke="#BDB49E"
              strokeWidth="1.10"
            />
            <path
              d="M-10.85-2.55C-8.50-4.25-5.80-4.15-4.00-2.95"
              fill="none"
              stroke="#C6BDAB"
              strokeWidth="0.55"
              strokeLinecap="round"
              opacity="0.55"
            />
            <ellipse
              className="research-spider-thorax"
              cx="1.60"
              rx="4.40"
              ry="3.80"
              fill="#494536"
              stroke="#D7CEB8"
              strokeWidth="1.00"
            />
            <ellipse
              className="research-spider-head"
              cx="6.30"
              rx="2.60"
              ry="2.30"
              fill="#DBD2BD"
              stroke="#F0E7D4"
              strokeWidth="0.55"
            />
            <path
              d="M8.10-0.90Q10.20-0.75 10.65-1.60M8.10 0.90Q10.20 0.75 10.65 1.60"
              fill="none"
              stroke="#D7CEB8"
              strokeWidth="0.65"
              strokeLinecap="round"
            />
            <g fill="#39382F">
              <circle cx="7.35" cy="-0.75" r="0.42" />
              <circle cx="7.35" cy="0.75" r="0.42" />
            </g>
          </g>
        </g>
      </g>
      <text x="48" y="660" fill="#A8AFBA" fontSize="11" className="svg-mono">
        {labels[active]}
      </text>
    </svg>
  )
}
