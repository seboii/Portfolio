import { useId } from "react"
import type { Locale } from "../content"
import { worldLandPath, worldPoint } from "./world-map"

type Point = readonly [number, number]
const xy = ([x, y]: Point) => `${x.toFixed(2)} ${y.toFixed(2)}`
const hubs = [
  worldPoint(-74, 40.7),
  worldPoint(29, 41),
  worldPoint(121.5, 31.2),
  worldPoint(18.4, -33.9),
  worldPoint(151.2, -33.9),
  worldPoint(-46.6, -23.6),
]
const connections = [
  { from: 0, to: 1, control: [479, 90] },
  { from: 1, to: 2, control: [768, 119] },
  { from: 1, to: 3, control: [696, 337] },
  { from: 2, to: 4, control: [1020, 345] },
  { from: 0, to: 5, control: [304, 332] },
  { from: 3, to: 2, control: [816, 455] },
] as const
const routes = connections.map(({ from, to, control }) => ({
  start: hubs[from],
  d: `M${xy(hubs[from])}Q${xy(control)} ${xy(hubs[to])}`,
}))

export default function LogisticsScene({ locale }: { locale: Locale }) {
  const id = useId()
  const dots = `${id}-dots`
  const landClip = `${id}-land-clip`
  const glow = `${id}-regional-glow`

  return (
    <svg
      className="scene-svg logistics-art"
      viewBox="0 0 1160 640"
      aria-hidden="true"
      focusable="false"
      data-ambient-scene="operations"
      data-map-style="square-dot"
      data-map-source="natural-earth-110m-land"
      data-map-language={locale}
    >
      <defs>
        <pattern
          id={dots}
          width="7.50"
          height="7.50"
          patternUnits="userSpaceOnUse"
        >
          <rect
            className="map-dot"
            x="1.40"
            y="1.40"
            width="4.50"
            height="4.50"
            fill="#52D991"
          />
        </pattern>
        <clipPath id={landClip}>
          <path d={worldLandPath} clipRule="evenodd" />
        </clipPath>
        <radialGradient id={glow}>
          <stop stopColor="#B7FFCE" stopOpacity="0.35" />
          <stop offset="0.36" stopColor="#64EAA1" stopOpacity="0.17" />
          <stop offset="1" stopColor="#40CE85" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${landClip})`}>
        {hubs.map(([cx, cy], index) => (
          <circle
            key={index}
            className="ambient-map-glow"
            cx={cx}
            cy={cy}
            r={index === 1 ? "58.00" : "45.00"}
            fill={`url(#${glow})`}
            opacity="0.65"
          />
        ))}
      </g>
      <g className="map-land" clipPath={`url(#${landClip})`}>
        <rect
          className="ambient-map-light"
          width="1160"
          height="640"
          fill={`url(#${dots})`}
        />
      </g>

      <g
        className="ambient-links"
        fill="none"
        stroke="#6DEBA4"
        strokeWidth="1.00"
        strokeOpacity="0.16"
      >
        {routes.map((route, index) => (
          <path key={index} data-ambient-path={index} d={route.d} />
        ))}
      </g>
      <g className="ambient-signals" fill="#CAFFDC">
        {routes.map(({ start: [cx, cy] }, index) => (
          <circle
            key={index}
            className="ambient-route-packet"
            data-ambient-packet={index}
            data-ambient-offset={(index * 0.15).toFixed(2)}
            cx={cx}
            cy={cy}
            r="2.70"
          />
        ))}
      </g>
      <g className="map-stations">
        {hubs.map(([x, y], index) => (
          <g key={index} transform={`translate(${xy([x, y])})`}>
            <circle
              className="ambient-pulse"
              r="10.00"
              fill="none"
              stroke="#91EDB8"
              strokeWidth="0.90"
              strokeOpacity="0.40"
            />
            <circle
              r="4.20"
              fill="#13271D"
              stroke="#90F0B5"
              strokeWidth="1.10"
            />
            <circle r="1.65" fill="#D0FFE0" />
          </g>
        ))}
      </g>

      <g data-operation-layer="0">
        <g
          className="logistics-routes"
          fill="none"
          stroke="#96F3BA"
          strokeWidth="1.35"
          strokeOpacity="0.64"
        >
          {routes.map((route, index) => (
            <path key={index} className="draw-path route-line" d={route.d} />
          ))}
        </g>
        <g fill="none" stroke="#B6FCCC" strokeWidth="1.00">
          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(${xy(hubs[index])})`}>
              <path d="M-12-12H-7M-12-12V-7M12-12H7M12-12V-7M-12 12H-7M-12 12V7M12 12H7M12 12V7" />
            </g>
          ))}
        </g>
      </g>
      <g data-operation-layer="1">
        <g
          className="risk-layer"
          transform={`translate(${xy(hubs[1])})`}
          fill="none"
          stroke="#B5FFD1"
        >
          <circle className="risk-ring" r="22.00" strokeWidth="1.40" />
          <circle
            className="risk-ring"
            r="36.00"
            strokeWidth="0.90"
            strokeOpacity="0.34"
            strokeDasharray="2 6"
          />
          <path d="M-4.50 0L0-4.50 4.50 0 0 4.50Z" fill="#C8FFDA" />
        </g>
        <path
          className="operation-risk-corridor"
          d={routes[2].d}
          fill="none"
          stroke="#A7F9C2"
          strokeWidth="2.10"
          strokeOpacity="0.80"
          strokeDasharray="3 8"
        />
      </g>
      <g data-operation-layer="2">
        <g
          className="operation-notifications"
          fill="none"
          stroke="#C7FFDB"
          strokeWidth="1.40"
        >
          {[0, 3, 4].map((index) => (
            <g key={index} transform={`translate(${xy(hubs[index])})`}>
              <circle r="17.00" strokeOpacity="0.60" />
              <path d="M-6.00 0L-1.00 5.00 8.00-6.00" />
              <path
                d="M-25.00-9.00A26.60 26.60 0 0 1-18.00-20.00M18.00 20.00A26.60 26.60 0 0 0 25.00 9.00"
                strokeOpacity="0.35"
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}
