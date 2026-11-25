import { useId, type CSSProperties } from "react"

const center = [900, 486] as const
const anchors = [
  [173, -80],
  [558, -125],
  [1065, -65],
  [1445, -50],
  [1690, 172],
  [1695, 426],
  [1650, 785],
  [1320, 1000],
  [968, 1030],
  [632, 972],
  [260, 960],
  [-45, 737],
  [-130, 415],
  [-90, 122],
] as const

// Unequal anchor lengths and silk tension keep the web irregular.
function silkPoint(ring: number, strand: number) {
  const index = (strand + anchors.length) % anchors.length
  const anchor = anchors[index]
  const fraction = ring / 11
  const tension =
    Math.sin(index * 2.37 + ring * 0.76) * 0.023 * Math.sin(fraction * Math.PI)
  const reach = fraction + tension
  const dx = anchor[0] - center[0],
    dy = anchor[1] - center[1]
  const sway =
    Math.sin(index * 1.8 + ring * 1.31) * 13 * Math.sin(fraction * Math.PI)
  const length = Math.hypot(dx, dy)
  return [
    center[0] + dx * reach - (dy / length) * sway,
    center[1] + dy * reach + (dx / length) * sway,
  ]
}

export const defaultFlyPositions = [
  { x: 82, y: 25 },
  { x: 75, y: 48 },
  { x: 89, y: 73 },
  { x: 65, y: 83 },
  { x: 39, y: 82 },
  { x: 15, y: 74 },
]

export function distributeFlies(surface: HTMLElement, seed: number) {
  const bounds = surface.getBoundingClientRect()
  const title = surface.querySelector(".web-identity")?.getBoundingClientRect()
  const compact = bounds.width <= 700
  let state = seed
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
  const candidates = anchors
    .flatMap((_, strand) =>
      Array.from({ length: 9 }, (_, index) => {
        const p = silkPoint(index + 2, strand)
        return { x: p[0] / 16, y: p[1] / 9 }
      }),
    )
    .filter((p) => {
      const x = (bounds.width * p.x) / 100,
        y = (bounds.height * p.y) / 100
      if (p.x < 8 || p.x > 92 || p.y < 20 || p.y > 85) return false
      if (
        title &&
        x > title.left - bounds.left - 25 &&
        x < title.right - bounds.left + 25 &&
        y > title.top - bounds.top - 25 &&
        y < title.bottom - bounds.top + 32
      )
        return false
      return (
        Math.hypot(x - bounds.width * 0.5625, y - bounds.height * 0.54) >
        (compact ? 71 : 114)
      )
    })
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  const chosen: typeof defaultFlyPositions = []
  for (const gap of [compact ? 83 : 145, compact ? 66 : 108]) {
    for (const p of candidates) {
      if (chosen.length === 6) break
      if (
        chosen.every(
          (other) =>
            Math.hypot(
              ((p.x - other.x) * bounds.width) / 100,
              ((p.y - other.y) * bounds.height) / 100,
            ) >= gap,
        )
      )
        chosen.push(p)
    }
  }
  return chosen.length === 6 ? chosen : defaultFlyPositions
}

export default function OrganicWeb() {
  const uid = useId().replace(/:/g, "")
  const rings = Array.from({ length: 10 }, (_, ring) =>
    anchors
      .map((_, strand) => {
        // Small open seams suggest repaired and weathered silk.
        if (
          (strand === 3 && ring > 5 && ring < 9) ||
          (strand === 11 && ring === 7)
        )
          return ""
        const a = silkPoint(ring + 1, strand),
          b = silkPoint(ring + 1, strand + 1)
        const mx = (a[0] + b[0]) / 2,
          my = (a[1] + b[1]) / 2
        const sag = 0.07 + Math.sin(strand * 2.3 + ring) * 0.03
        return `M${a[0]},${a[1]}Q${mx + (center[0] - mx) * sag},${my + (center[1] - my) * sag} ${b[0]},${b[1]}`
      })
      .join(" "),
  )
  return (
    <svg
      className="spider-web-svg"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}fade`} cx="56%" cy="54%" r="75%">
          <stop offset="0" stopColor="white" stopOpacity=".6" />
          <stop offset=".48" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity=".1" />
        </radialGradient>
        <mask id={`${uid}mask`}>
          <rect width="1600" height="900" fill={`url(#${uid}fade)`} />
        </mask>
      </defs>
      <g
        className="web-fabric"
        mask={`url(#${uid}mask)`}
        fill="none"
        stroke="currentColor"
        strokeWidth=".75"
      >
        {rings.map((d, i) => (
          <path
            className="web-silk-ring"
            key={i}
            d={d}
            opacity={i % 3 === 0 ? 0.62 : 0.36}
          />
        ))}
        {anchors.map((_, strand) => (
          <path
            key={strand}
            className="web-silk-anchor"
            d={Array.from({ length: 12 }, (_, ring) => {
              const p = silkPoint(ring, strand)
              return `${ring ? "L" : "M"}${p[0]},${p[1]}`
            }).join(" ")}
            opacity={strand % 3 === 0 ? 0.68 : 0.43}
          />
        ))}
        <g className="web-frayed-silk" strokeWidth=".5" opacity=".24">
          <path d="M-40 705Q214 681 328 798M1210 960Q1399 774 1605 808M1385 -10Q1412 118 1620 182M-10 136Q211 108 372 220" />
          <path d="M1585 177Q1504 312 1670 426M210 867Q340 801 462 944M1470 713l48 27-11 31M268 141l-38-49 62-47" />
        </g>
        <g className="web-silk-highlight" strokeWidth="1" opacity=".35">
          <path className="web-current" d={rings[3]} />
          <path className="web-current web-current-two" d={rings[7]} />
        </g>
        {Array.from({ length: 22 }, (_, i) => {
          const p = silkPoint(2 + (i % 8), (i * 5) % anchors.length)
          return (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={i % 5 === 0 ? 1.8 : 0.85}
              className={i % 5 === 0 ? "web-dewdrop" : undefined}
              style={{ "--dew-delay": `${i * -0.47}s` } as CSSProperties}
              fill="currentColor"
              stroke="none"
              opacity=".58"
            />
          )
        })}
      </g>
    </svg>
  )
}
