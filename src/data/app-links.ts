export interface AppLink {
  readonly id: string
  readonly name: string
  readonly mark: "behavior" | "bridge" | "operations" | "cargo" | "mail" | "parking"
  readonly color: string
  readonly siteUrl: string | null
}

// Add a complete https:// URL to siteUrl when an application site is ready.
// The strip opens that site directly; null keeps its card marked as coming soon.
export const appLinks: readonly AppLink[] = [
  {
    id: "badhabinot",
    name: "Badhabinot",
    mark: "behavior",
    color: "#d7ff64",
    siteUrl: null,
  },
  {
    id: "bridge",
    name: "Bridge",
    mark: "bridge",
    color: "#a6c9ff",
    siteUrl: null,
  },
  {
    id: "operations",
    name: "Operations Manager",
    mark: "operations",
    color: "#d7ff64",
    siteUrl: null,
  },
  {
    id: "logistics-assistant",
    name: "CargoTwin",
    mark: "cargo",
    color: "#c7db95",
    siteUrl: null,
  },
  {
    id: "mailops",
    name: "Mailops",
    mark: "mail",
    color: "#c1b2ef",
    siteUrl: null,
  },
  {
    id: "otomark",
    name: "OtoMARK",
    mark: "parking",
    color: "#efa98a",
    siteUrl: null,
  },
]
