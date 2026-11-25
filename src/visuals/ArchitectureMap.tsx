import { useId } from "react"
import type { Locale } from "../content"
import {
  architectureCopy,
  getArchitecture,
  type ArchitectureEdge,
  type ArchitectureNode,
} from "../data/architectures"
import "../styles/architecture.css"

interface ArchitectureMapProps {
  projectId: string
  locale: Locale
}

const wrapLabel = (label: string): readonly string[] => {
  if (label.length <= 22) return [label]
  const words = label.split(" ")
  let first = ""
  while (words.length > 1 && (first + " " + words[0]).trim().length <= 22) {
    first = (first + " " + words.shift()).trim()
  }
  return first ? [first, words.join(" ")] : [label]
}

const connectionPath = (
  from: ArchitectureNode,
  to: ArchitectureNode,
  bend: number,
): string => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy) || 1
  const startX = from.x + (dx / distance) * 37
  const startY = from.y + (dy / distance) * 37
  const endX = to.x - (dx / distance) * 43
  const endY = to.y - (dy / distance) * 43
  const controlX = (from.x + to.x) / 2 - (dy / distance) * bend
  const controlY = (from.y + to.y) / 2 + (dx / distance) * bend
  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
}

export default function ArchitectureMap({
  projectId,
  locale,
}: ArchitectureMapProps) {
  const reactId = useId()
  const diagram = getArchitecture(projectId)
  if (!diagram) return null

  const markerId = `architecture-arrow-${reactId.replace(/:/g, "")}`
  const headingId = `architecture-title-${reactId.replace(/:/g, "")}`
  const nodeById = new Map(diagram.nodes.map((node) => [node.id, node]))
  const states = [...new Set(diagram.nodes.map((node) => node.state))]

  const renderConnection = (edge: ArchitectureEdge, index: number) => {
    const from = nodeById.get(edge.from)
    const to = nodeById.get(edge.to)
    if (!from || !to) return null
    return (
      <path
        key={`${edge.from}-${edge.to}-${index}`}
        className={`architecture-connection architecture-connection--${edge.kind}`}
        d={connectionPath(from, to, edge.bend ?? 35)}
        markerEnd={`url(#${markerId})`}
      />
    )
  }

  return (
    <figure
      className={`architecture-map architecture-map--${projectId}`}
      aria-labelledby={headingId}
    >
      <div className="architecture-intro">
        <p className="architecture-eyebrow">
          {architectureCopy.heading[locale]}
        </p>
        <h3 id={headingId}>{diagram.title[locale]}</h3>
        <p className="architecture-summary">{diagram.summary[locale]}</p>
      </div>
      <div className="architecture-art">
        <svg viewBox="0 0 1120 665" aria-hidden="true" focusable="false">
          <defs>
            <marker
              id={markerId}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6" className="architecture-arrow" />
            </marker>
          </defs>
          <g className="architecture-orbits">
            <ellipse cx="560" cy="320" rx="490" ry="245" />
            <ellipse
              cx="560"
              cy="320"
              rx="365"
              ry="170"
              transform="rotate(-16 560 320)"
            />
            <path d="M65 590 C300 480 470 640 650 570 S960 430 1080 570" />
          </g>
          <g>{diagram.edges.map(renderConnection)}</g>
          {diagram.nodes.map((node, index) => (
            <g
              key={node.id}
              className={`architecture-node architecture-node--${node.state}`}
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle className="architecture-node-halo" r="46" />
              <circle className="architecture-node-ring" r="31" />
              <circle
                className="architecture-node-dot"
                r="5"
                cx="25"
                cy="-22"
              />
              <text
                className="architecture-node-index"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {String(index + 1).padStart(2, "0")}
              </text>
              <text
                className="architecture-node-tag"
                y="-58"
                textAnchor="middle"
              >
                {node.tag[locale]}
              </text>
              <text
                className="architecture-node-label"
                y="68"
                textAnchor="middle"
              >
                {wrapLabel(node.label[locale]).map((line, lineIndex) => (
                  <tspan key={line} x="0" dy={lineIndex === 0 ? 0 : 25}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="architecture-caption">
        <ul
          className="architecture-legend"
          aria-label={
            {
              tr: "Şema açıklaması",
              en: "Diagram legend",
              ru: "Обозначения на схеме",
            }[locale]
          }
        >
          {states.map((state) => (
            <li
              key={state}
              className={`architecture-legend-item architecture-legend-item--${state}`}
            >
              <span aria-hidden="true" />
              {architectureCopy[state][locale]}
            </li>
          ))}
        </ul>
        <p className="architecture-list-heading">
          {architectureCopy.components[locale]}
        </p>
        <ol className="architecture-components">
          {diagram.nodes.map((node) => (
            <li
              key={node.id}
              className={`architecture-component architecture-component--${node.state}`}
            >
              <div className="architecture-component-heading">
                <strong>{node.label[locale]}</strong>
                {node.state === "planned" && (
                  <span>{architectureCopy.planned[locale]}</span>
                )}
              </div>
              <p>{node.description[locale]}</p>
            </li>
          ))}
        </ol>
        <details className="architecture-flows">
          <summary>{architectureCopy.connections[locale]}</summary>
          <ul>
            {diagram.edges.map((edge, index) => {
              const from = nodeById.get(edge.from)
              const to = nodeById.get(edge.to)
              if (!from || !to) return null
              return (
                <li key={`${edge.from}-${edge.to}-${index}`}>
                  <strong>
                    {from.label[locale]} → {to.label[locale]}
                  </strong>
                  <span>
                    {edge.label[locale]}
                    {edge.kind === "planned"
                      ? ` · ${architectureCopy.planned[locale]}`
                      : ""}
                  </span>
                </li>
              )
            })}
          </ul>
        </details>
      </figcaption>
    </figure>
  )
}
