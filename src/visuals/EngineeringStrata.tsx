import type { Locale } from "../content"
import { engineeringLayers } from "../data/storyboard"

interface EngineeringStrataProps {
  locale: Locale
  activeLayer: string
}

export default function EngineeringStrata({
  locale,
  activeLayer,
}: EngineeringStrataProps) {
  return (
    <svg
      className="strata-art"
      viewBox="0 0 760 800"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="strata-axis draw-path"
        d="M440 72V670M128 165V625M665 180V640M354 295V710"
      />
      <path className="strata-ground" d="m104 647 338-119 249 143-338 120Z" />
      {[...engineeringLayers].reverse().map((layer) => {
        const index = engineeringLayers.findIndex(
          (item) => item.id === layer.id,
        )
        const y = 156 + index * 86
        return (
          <g
            key={layer.id}
            className={`stratum strata-plane${
              activeLayer === layer.id ? " strata-active" : ""
            }`}
            data-stratum={layer.id}
          >
            <path
              className="strata-edge"
              d={`M128 ${y}L354 ${y + 130}L666 ${y + 15}V${y + 32}L354 ${y + 147}L128 ${y + 17}Z`}
            />
            <path
              className="strata-surface draw-path"
              d={`M128 ${y}L440 ${y - 115}L666 ${y + 15}L354 ${y + 130}Z`}
            />
            <g
              className="strata-detail"
              transform={`matrix(.957 -.352 .753 .433 128 ${y})`}
            >
              {layer.id === "experience" && (
                <>
                  <rect x="35" y="38" width="254" height="215" rx="2" />
                  <path d="M35 79H289M60 101H145M60 119H169M60 165H257M60 185H241M60 205H213" />
                  <rect
                    className="strata-solid"
                    x="208"
                    y="105"
                    width="48"
                    height="39"
                  />
                  <circle cx="53" cy="59" r="4" />
                  <circle cx="69" cy="59" r="4" />
                  <circle cx="85" cy="59" r="4" />
                </>
              )}
              {layer.id === "application" && (
                <>
                  <path
                    className="draw-path"
                    d="M72 74H165V151H253M72 226H165V151"
                  />
                  <rect x="45" y="51" width="54" height="46" />
                  <rect x="45" y="203" width="54" height="46" />
                  <rect
                    className="strata-solid"
                    x="137"
                    y="128"
                    width="56"
                    height="46"
                  />
                  <rect x="228" y="128" width="54" height="46" />
                  <path d="m54 67-8 7 8 7m35-14 8 7-8 7M56 220H89M56 233H82M241 143H268M241 157H268" />
                </>
              )}
              {layer.id === "domain" && (
                <>
                  <path
                    className="draw-path"
                    d="M84 88 163 150 245 90M84 220 163 150 245 222"
                  />
                  <path d="m60 74 24-13 24 13v27l-24 14-24-14Zm160 2 25-14 25 14v27l-25 14-25-14ZM60 207l24-14 24 14v27l-24 14-24-14Zm160 1 25-14 25 14v27l-25 14-25-14Z" />
                  <circle className="strata-solid" cx="163" cy="150" r="30" />
                  <path className="strata-inverse" d="m152 150 8 8 16-17" />
                </>
              )}
              {layer.id === "data" && (
                <>
                  <path d="M49 88v112c0 21 86 21 86 0V88M185 122v112c0 21 86 21 86 0V122" />
                  <ellipse
                    className="strata-solid"
                    cx="92"
                    cy="88"
                    rx="43"
                    ry="17"
                  />
                  <ellipse cx="228" cy="122" rx="43" ry="17" />
                  <path d="M49 126c0 21 86 21 86 0M49 164c0 21 86 21 86 0M185 160c0 21 86 21 86 0M185 198c0 21 86 21 86 0M136 143h27v24h22" />
                </>
              )}
              {layer.id === "infrastructure" && (
                <>
                  {[65, 126, 187].map((top) => (
                    <g key={top}>
                      <rect x="40" y={top} width="248" height="40" />
                      <path d={`M67 ${top + 20}H198`} />
                      <circle
                        className="strata-solid"
                        cx="233"
                        cy={top + 20}
                        r="5"
                      />
                      <circle cx="255" cy={top + 20} r="5" />
                    </g>
                  ))}
                  <path
                    className="draw-path"
                    d="M164 43V65M164 105V126M164 166V187M164 227V254"
                  />
                </>
              )}
            </g>
            <path className="strata-leader" d={`M669 ${y + 27}h22`} />
            <text className="strata-label" x="704" y={y + 32}>
              {String(index + 1).padStart(2, "0")}
            </text>
            <text className="strata-caption" x="131" y={y + 24}>
              {layer.title[locale]}
            </text>
          </g>
        )
      })}
      <g className="strata-origin">
        <path d="M39 640v50h50" />
        <circle cx="39" cy="690" r="3" />
      </g>
    </svg>
  )
}
