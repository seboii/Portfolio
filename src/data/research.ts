import type { Localized } from "../content"

export type ResearchVisualizationType = "route-network" | "peer-network" | "pose-skeleton" | "bounded-pipeline"

export type ResearchProject = "operations" | "bridge" | "badhabinot" | "logistics-assistant"

export interface ResearchSignal {
  readonly id: string
  readonly title: Localized
  readonly statement: Localized
  readonly source: string
  readonly publisher: string
  /** Source edition year; COCO uses its dataset edition, not a documentation date. */
  readonly year: number
  readonly url: string
  readonly accessDate: string
  readonly relatedProject: ResearchProject
  readonly visualizationType: ResearchVisualizationType
}

// Industry context, never evidence of an individual's implementation or results.
// Every visualization is an original conceptual interpretation of the short statement.
export const researchSignals: readonly ResearchSignal[] = [
  {
    id: "logistics-resilience",
    title: {
      tr: "Riskler görünür olduğunda",
      en: "When risks become visible",
      ru: "Когда риски становятся видимыми",
    },
    statement: {
      tr: "DHL'nin 2026 Radar'ı, yapay zekâ analitiğini kesintileri öngörmeyle; tedarik zinciri çeşitlendirmesini dayanıklılıkla ilişkilendiriyor.",
      en: "DHL's 2026 Radar connects AI analytics with anticipating disruptions, and supply-chain diversification with resilience.",
      ru: "В отчёте DHL Radar за 2026 год аналитика ИИ связана с прогнозированием сбоев, а диверсификация цепочек поставок — с устойчивостью.",
    },
    source: "DHL Logistics Trend Radar 8.0 — official release",
    publisher: "DHL Group",
    year: 2026,
    url: "https://group.dhl.com/en/media-relations/press-releases/2026/ai-takes-action-while-people-remain-at-the-center-of-logistics-finds-dhl-logistics-trend-radar.html",
    accessDate: "2026-10-06",
    relatedProject: "operations",
    visualizationType: "route-network",
  },
  {
    id: "realtime-connections",
    title: {
      tr: "Mesafeden bağlantıya",
      en: "From distance to connection",
      ru: "От расстояния к связи",
    },
    statement: {
      tr: "WebRTC standardı, tarayıcılar ve uyumlu cihazlar arasında medya ile uygulama verisinin gerçek zamanlı aktarımını tanımlar.",
      en: "The WebRTC standard defines real-time exchange of media and application data between browsers and compatible devices.",
      ru: "Стандарт WebRTC определяет обмен медиа и данными приложений в реальном времени между браузерами и совместимыми устройствами.",
    },
    source: "WebRTC: Real-Time Communication in Browsers",
    publisher: "W3C",
    year: 2025,
    url: "https://www.w3.org/TR/2025/REC-webrtc-20250313/",
    accessDate: "2026-10-06",
    relatedProject: "bridge",
    visualizationType: "peer-network",
  },
  {
    id: "movement-to-data",
    title: {
      tr: "Hareket → Veri",
      en: "Movement → Data",
      ru: "Движение → Данные",
    },
    statement: {
      tr: "COCO'nun 2017 insan pozu şeması, vücudu 17 işaret noktasıyla temsil eder. Her nokta konum ve görünürlük bilgisi taşır.",
      en: "COCO's 2017 human-pose schema represents the body with 17 landmarks. Each point carries position and visibility information.",
      ru: "Схема позы человека COCO 2017 описывает тело с помощью 17 ключевых точек. Каждая точка содержит сведения о положении и видимости.",
    },
    source: "COCO Keypoints 2017 — Ultralytics documentation",
    publisher: "Ultralytics / COCO",
    year: 2017,
    url: "https://docs.ultralytics.com/datasets/pose/coco",
    accessDate: "2026-10-06",
    relatedProject: "badhabinot",
    visualizationType: "pose-skeleton",
  },
  {
    id: "bounded-intelligence",
    title: {
      tr: "Ölçüm. Bağlam. Sınırlar.",
      en: "Evaluation. Context. Boundaries.",
      ru: "Оценка. Контекст. Границы.",
    },
    statement: {
      tr: "Stanford'ın 2026 AI Index bulguları, yapay zekâ yeteneklerinin hızla ilerlediğini; bunları ölçme ve yönetme becerisinin aynı hızda gelişmediğini vurguluyor.",
      en: "Stanford's 2026 AI Index findings highlight rapid capability gains while our ability to measure and manage AI develops more slowly.",
      ru: "Выводы Stanford AI Index за 2026 год подчёркивают быстрый рост возможностей ИИ, тогда как наши методы его оценки и управления развиваются медленнее.",
    },
    source: "AI Index Report 2026 — official findings",
    publisher: "Stanford HAI",
    year: 2026,
    url: "https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report",
    accessDate: "2026-10-06",
    relatedProject: "logistics-assistant",
    visualizationType: "bounded-pipeline",
  },
]
