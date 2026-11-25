import type { Locale } from "../content"
import type { SceneKind } from "../data/storyboard"
import LogisticsScene from "./LogisticsScene"
import CollaborationScene from "./CollaborationScene"
import PoseScene from "./PoseScene"
import IntelligenceScene from "./IntelligenceScene"

export default function SystemScene({
  kind,
  locale,
}: {
  kind: SceneKind
  locale: Locale
}) {
  if (kind === "operations") return <LogisticsScene locale={locale} />
  if (kind === "collaboration") return <CollaborationScene locale={locale} />
  if (kind === "pose") return <PoseScene locale={locale} />
  return <IntelligenceScene locale={locale} />
}
