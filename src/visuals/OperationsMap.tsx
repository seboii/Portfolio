import { useId, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"
import type { Locale } from "../content"
import { worldLandPath, worldPoint } from "./world-map"
import "../styles/operations-map.css"

type View = "routes" | "risk" | "data"
type Point = readonly [number, number]
type Hub = {
  name: string
  code: string
  point: Point
  label: Point
  anchor?: "end"
}

const hubs: readonly Hub[] = [
  {
    name: "New York",
    code: "NYC",
    point: worldPoint(-74, 40.7),
    label: [-14, -19],
    anchor: "end",
  },
  {
    name: "İstanbul",
    code: "IST",
    point: worldPoint(29, 41),
    label: [15, -18],
  },
  {
    name: "Shanghai",
    code: "SHA",
    point: worldPoint(121.5, 31.2),
    label: [13, -18],
  },
  {
    name: "Cape Town",
    code: "CPT",
    point: worldPoint(18.4, -33.9),
    label: [-14, 27],
    anchor: "end",
  },
  {
    name: "Sydney",
    code: "SYD",
    point: worldPoint(151.2, -33.9),
    label: [12, 25],
  },
  {
    name: "São Paulo",
    code: "GRU",
    point: worldPoint(-46.6, -23.6),
    label: [-14, 26],
    anchor: "end",
  },
]

const xy = ([x, y]: Point) => `${x} ${y}`
const shipmentRoutes = [
  {
    id: "OLS-2048",
    from: 1,
    to: 0,
    control: [451, 53] as Point,
    mode: { tr: "Hava kargo", en: "Air freight", ru: "Авиаперевозка" },
    eta: "14:40",
    progress: 72,
    risk: false,
    cargo: "1.240 kg",
  },
  {
    id: "OLS-2051",
    from: 2,
    to: 1,
    control: [764, 65] as Point,
    mode: {
      tr: "Deniz taşımacılığı",
      en: "Ocean freight",
      ru: "Морская перевозка",
    },
    eta: "18:20",
    progress: 48,
    risk: true,
    cargo: "24 TEU",
  },
  {
    id: "OLS-2063",
    from: 2,
    to: 4,
    control: [1076, 295] as Point,
    mode: { tr: "Hava kargo", en: "Air freight", ru: "Авиаперевозка" },
    eta: "21:15",
    progress: 34,
    risk: false,
    cargo: "860 kg",
  },
  {
    id: "OLS-2070",
    from: 0,
    to: 5,
    control: [261, 294] as Point,
    mode: {
      tr: "Deniz taşımacılığı",
      en: "Ocean freight",
      ru: "Морская перевозка",
    },
    eta: "09:30",
    progress: 86,
    risk: false,
    cargo: "18 TEU",
  },
  {
    id: "OLS-2082",
    from: 1,
    to: 3,
    control: [735, 311] as Point,
    mode: {
      tr: "Deniz taşımacılığı",
      en: "Ocean freight",
      ru: "Морская перевозка",
    },
    eta: "16:10",
    progress: 61,
    risk: false,
    cargo: "32 TEU",
  },
].map((route) => ({
  ...route,
  path: `M${xy(hubs[route.from].point)}Q${xy(route.control)} ${xy(hubs[route.to].point)}`,
}))

const copy = {
  tr: {
    subtitle: "Lojistik Operasyon Platformu",
    demo: "Etkileşimli ürün konsepti",
    sample: "Örnek veri",
    routes: "Rota akışı",
    risk: "Risk görünümü",
    data: "Veri kalitesi",
    layers: "Harita görünümü",
    region: "Küresel operasyon ağı",
    mapDescription:
      "New York, İstanbul, Shanghai, Cape Town, Sydney ve São Paulo arasındaki örnek sevkiyat rotalarını gösteren dünya haritası.",
    live: "Simülasyon aktif",
    selected: "Seçili sevkiyat",
    routeSelect: "İncelenecek sevkiyatı seç",
    healthy: "Plan dahilinde",
    delayed: "İzleme gerekli",
    cargo: "Yük",
    eta: "Tahmini varış",
    progress: "Rota ilerlemesi",
    routeNote: "Konum, rota ve durum tek bir operasyon görünümünde.",
    riskNote: "Shanghai → İstanbul: örnek liman yoğunluğu uyarısı.",
    dataNote: "Örnek telemetri akışı: son konum ve veri bütünlüğü.",
    alert: "Liman yoğunluğu",
    alertDescription: "Shanghai çıkışında örnek gecikme sinyali.",
    quality: "Veri akışı sağlıklı",
    qualityDescription: "Son örnek güncelleme 8 sn önce.",
    routeSummary: "Rota izleniyor",
    routeSummaryDescription: "Seçili örnek sevkiyatın konumu güncel.",
    active: "Aktif sevkiyat",
    hubs: "Operasyon merkezi",
    attention: "Risk sinyali",
    fresh: "Veri güncelliği",
    normal: "Aktif rota",
    selectedLegend: "Seçili rota",
    riskLegend: "Risk sinyali",
    dataLegend: "Doğrulanan veri",
    disclaimer: "Bu gösterimdeki rotalar ve metrikler temsili veridir.",
  },
  en: {
    subtitle: "Logistics Operations Platform",
    demo: "Interactive product concept",
    sample: "Sample data",
    routes: "Route flow",
    risk: "Risk view",
    data: "Data quality",
    layers: "Map view",
    region: "Global operations network",
    mapDescription:
      "World map showing sample shipment routes between New York, Istanbul, Shanghai, Cape Town, Sydney and São Paulo.",
    live: "Simulation active",
    selected: "Selected shipment",
    routeSelect: "Select a shipment to inspect",
    healthy: "On schedule",
    delayed: "Needs attention",
    cargo: "Cargo",
    eta: "Estimated arrival",
    progress: "Route progress",
    routeNote: "Location, routes and status in one operations view.",
    riskNote: "Shanghai → Istanbul: sample port congestion alert.",
    dataNote: "Sample telemetry: latest location and data integrity.",
    alert: "Port congestion",
    alertDescription: "Sample delay signal at the Shanghai departure hub.",
    quality: "Data stream healthy",
    qualityDescription: "Last sample update 8 seconds ago.",
    routeSummary: "Tracking route",
    routeSummaryDescription:
      "The selected sample shipment location is current.",
    active: "Active shipments",
    hubs: "Operations hubs",
    attention: "Risk signal",
    fresh: "Data freshness",
    normal: "Active route",
    selectedLegend: "Selected route",
    riskLegend: "Risk signal",
    dataLegend: "Verified data",
    disclaimer: "Routes and metrics in this view use illustrative data.",
  },
  ru: {
    subtitle: "Платформа логистических операций",
    demo: "Интерактивная концепция продукта",
    sample: "Пример данных",
    routes: "Маршруты",
    risk: "Риски",
    data: "Качество данных",
    layers: "Вид карты",
    region: "Глобальная сеть операций",
    mapDescription:
      "Карта мира с примерами маршрутов доставки между Нью-Йорком, Стамбулом, Шанхаем, Кейптауном, Сиднеем и Сан-Паулу.",
    live: "Симуляция активна",
    selected: "Выбранная отправка",
    routeSelect: "Выбрать отправку для просмотра",
    healthy: "По графику",
    delayed: "Требует внимания",
    cargo: "Груз",
    eta: "Ожидаемое прибытие",
    progress: "Прогресс маршрута",
    routeNote: "Положение, маршруты и статусы в одном представлении.",
    riskNote: "Шанхай → Стамбул: пример предупреждения о загрузке порта.",
    dataNote: "Пример телеметрии: последнее положение и целостность данных.",
    alert: "Загруженность порта",
    alertDescription: "Пример сигнала задержки при отправлении из Шанхая.",
    quality: "Поток данных исправен",
    qualityDescription: "Последнее обновление примера — 8 секунд назад.",
    routeSummary: "Маршрут отслеживается",
    routeSummaryDescription:
      "Положение выбранной отправки в примере актуально.",
    active: "Активные отправки",
    hubs: "Центры операций",
    attention: "Сигнал риска",
    fresh: "Актуальность данных",
    normal: "Активный маршрут",
    selectedLegend: "Выбранный маршрут",
    riskLegend: "Сигнал риска",
    dataLegend: "Проверенные данные",
    disclaimer:
      "Маршруты и показатели в этом представлении основаны на условных данных.",
  },
} as const

const views: readonly View[] = ["routes", "risk", "data"]

export default function OperationsMap({
  locale,
  compact = false,
}: {
  locale: Locale
  compact?: boolean
}) {
  const id = useId().replace(/:/g, "")
  const [view, setView] = useState<View>("routes")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const t = copy[locale]
  const selected = shipmentRoutes[selectedIndex]
  const russianCities: Record<string, string> = {
    NYC: "Нью-Йорк",
    IST: "Стамбул",
    SHA: "Шанхай",
    CPT: "Кейптаун",
    SYD: "Сидней",
    GRU: "Сан-Паулу",
  }
  const cityName = (hub: Hub) =>
    locale === "ru"
      ? russianCities[hub.code]
      : locale === "en" && hub.code === "IST"
        ? "Istanbul"
        : hub.name
  const handleViewKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next: number | undefined
    if (event.key === "ArrowRight") next = (index + 1) % views.length
    if (event.key === "ArrowLeft")
      next = (index + views.length - 1) % views.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = views.length - 1
    if (next === undefined) return
    event.preventDefault()
    setView(views[next])
    document.getElementById(`${id}-tab-${views[next]}`)?.focus()
  }

  return (
    <div
      className={`operations-console${compact ? " ops-map--compact" : ""}`}
      data-demo-visual="operations"
      data-operation-view={view}
      data-map-source="natural-earth-110m-land"
      data-map-language={locale}
    >
      <header className="ops-header">
        <div className="ops-brand">
          <span className="ops-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <div>
            <p className="ops-product-name">Operations Manager</p>
            <p className="ops-product-subtitle">{t.subtitle}</p>
          </div>
        </div>
        <span className="ops-demo-badge">
          <span aria-hidden="true" />
          {t.sample}
        </span>
      </header>

      <div className="ops-toolbar">
        <div className="ops-tabs" role="tablist" aria-label={t.layers}>
          {views.map((item, index) => (
            <button
              key={item}
              type="button"
              role="tab"
              id={`${id}-tab-${item}`}
              aria-controls={`${id}-panel`}
              aria-selected={view === item}
              tabIndex={view === item ? 0 : -1}
              onClick={() => setView(item)}
              onKeyDown={(event) => handleViewKey(event, index)}
            >
              <span
                className={`ops-tab-icon ops-tab-icon--${item}`}
                aria-hidden="true"
              />
              {t[item]}
            </button>
          ))}
        </div>
        <span className="ops-network-title">
          {t.region} <span>06</span>
        </span>
      </div>

      <div
        className="ops-workspace"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${view}`}
      >
        <div className="ops-map-main">
          <div className="ops-map-meta">
            <span>
              <i aria-hidden="true" />
              {t.live}
            </span>
            <span>UTC +03:00</span>
          </div>
          <svg
            className="ops-world"
            viewBox="0 18 1100 545"
            role="img"
            aria-label={t.mapDescription}
            data-map-source="natural-earth-110m-land"
            data-map-language={locale}
          >
            <defs>
              <pattern
                id={`${id}-grid`}
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M80 0H0V80"
                  fill="none"
                  stroke="#7e8999"
                  strokeOpacity="0.065"
                  strokeWidth="0.8"
                />
              </pattern>
              <pattern
                id={`${id}-dots`}
                width="5.5"
                height="5.5"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  className="ops-map-dot"
                  cx="1.5"
                  cy="1.5"
                  r="0.8"
                  fill="#718174"
                  fillOpacity="0.34"
                />
              </pattern>
              <clipPath id={`${id}-land`}>
                <path d={worldLandPath} clipRule="evenodd" />
              </clipPath>
              <radialGradient id={`${id}-glow`}>
                <stop stopColor="#D7FF64" stopOpacity="0.08" />
                <stop offset="1" stopColor="#D7FF64" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect
              x="0"
              y="18"
              width="1100"
              height="545"
              fill={`url(#${id}-grid)`}
            />
            <circle cx="639" cy="218" r="290" fill={`url(#${id}-glow)`} />
            <path
              className="ops-world-land"
              d={worldLandPath}
              fill="#1c2525"
              fillRule="evenodd"
              stroke="#536058"
              strokeOpacity="0.36"
              strokeWidth="0.7"
            />
            <rect
              x="0"
              y="18"
              width="1100"
              height="545"
              clipPath={`url(#${id}-land)`}
              fill={`url(#${id}-dots)`}
            />
            <text
              className="ops-ocean-label"
              x="417"
              y="336"
              textAnchor="middle"
            >
              {locale === "ru" ? "АТЛАНТИЧЕСКИЙ ОКЕАН" : "ATLANTIC OCEAN"}
            </text>
            <text
              className="ops-ocean-label"
              x="812"
              y="435"
              textAnchor="middle"
            >
              {locale === "ru" ? "ИНДИЙСКИЙ ОКЕАН" : "INDIAN OCEAN"}
            </text>
            <g className="ops-route-network" fill="none">
              {shipmentRoutes.map((route, index) => {
                const active = selectedIndex === index
                const risk = view === "risk" && route.risk
                const color = risk ? "#F8A267" : active ? "#D7FF64" : "#81ADF5"
                return (
                  <g
                    key={route.id}
                    className={`${
                      active ? "ops-route-selected" : "ops-route-muted"
                    }${risk ? " ops-route-risk" : ""}`}
                  >
                    <path
                      d={route.path}
                      stroke={color}
                      strokeWidth={active || risk ? 1.9 : 1.1}
                      strokeOpacity={active || risk ? 0.8 : 0.25}
                      strokeDasharray={risk ? "5 5" : undefined}
                    />
                    <path
                      className="ops-route-packet"
                      d={route.path}
                      pathLength="100"
                      stroke={color}
                      strokeWidth={active ? 3.2 : 2.4}
                      strokeLinecap="round"
                      strokeDasharray="0.7 99.3"
                      style={
                        {
                          "--packet-delay": `${-index * 2.3}s`,
                          "--packet-duration": `${10 + index * 1.8}s`,
                        } as CSSProperties
                      }
                    />
                  </g>
                )
              })}
            </g>
            {view === "risk" && (
              <g
                className="ops-risk-halo"
                transform={`translate(${xy(hubs[2].point)})`}
              >
                <circle r="30" fill="#F8A267" fillOpacity="0.07" />
                <circle
                  className="ops-hub-pulse"
                  r="23"
                  fill="none"
                  stroke="#F8A267"
                  strokeWidth="1"
                />
                <circle
                  r="40"
                  fill="none"
                  stroke="#F8A267"
                  strokeOpacity="0.3"
                  strokeDasharray="2 5"
                />
              </g>
            )}
            <g className="ops-hubs">
              {hubs.map((hub, index) => {
                const active = selected.from === index || selected.to === index
                const risk = view === "risk" && index === 2
                const color = risk ? "#F8A267" : active ? "#D7FF64" : "#94ADBF"
                return (
                  <g key={hub.code} transform={`translate(${xy(hub.point)})`}>
                    {active && (
                      <circle
                        className="ops-hub-pulse"
                        r="13"
                        fill="none"
                        stroke={color}
                        strokeWidth="0.8"
                        style={{ animationDelay: `${index * -0.8}s` }}
                      />
                    )}
                    <circle
                      r={active ? 6 : 4.5}
                      fill="#101719"
                      stroke={color}
                      strokeWidth="1.4"
                    />
                    <circle r={active ? 2.6 : 1.5} fill={color} />
                    <text
                      className={
                        active ? "ops-hub-label is-active" : "ops-hub-label"
                      }
                      x={hub.label[0]}
                      y={hub.label[1]}
                      textAnchor={hub.anchor ?? "start"}
                    >
                      {cityName(hub)}
                    </text>
                    {view === "data" && (
                      <g transform="translate(9 4)">
                        <rect
                          x="0"
                          y="0"
                          width="28"
                          height="13"
                          rx="3"
                          fill="#16251e"
                          stroke="#8CD5AF"
                          strokeWidth="0.5"
                        />
                        <text
                          className="ops-data-check"
                          x="14"
                          y="9.5"
                          textAnchor="middle"
                        >
                          {locale === "ru" ? "ОК" : "OK"}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </g>
            <g className="ops-map-scale" transform="translate(35 510)">
              <path
                d="M0 0V5H75V0M37.5 0V5"
                fill="none"
                stroke="#65716d"
                strokeWidth="1"
              />
              <text x="0" y="20">
                0
              </text>
              <text x="75" y="20" textAnchor="end">
                {locale === "ru" ? "2 000 км" : "2,000 km"}
              </text>
            </g>
          </svg>
          <div className="ops-map-legend" aria-label={t.layers}>
            <span>
              <i className="ops-legend-line" />
              {t.selectedLegend}
            </span>
            <span>
              <i
                className={`ops-legend-line ops-legend-line--${
                  view === "risk" ? "orange" : "blue"
                }`}
              />
              {view === "risk" ? t.riskLegend : t.normal}
            </span>
            {view === "data" && (
              <span>
                <i className="ops-legend-check">✓</i>
                {t.dataLegend}
              </span>
            )}
          </div>
          <p className="ops-view-note">
            {view === "routes"
              ? t.routeNote
              : view === "risk"
                ? t.riskNote
                : t.dataNote}
          </p>
        </div>

        <aside
          className="ops-shipment-panel"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="ops-panel-label">
            <span>{t.selected}</span>
            <span className="ops-selection-dot" aria-hidden="true" />
          </div>
          <strong className="ops-shipment-id">{selected.id}</strong>
          <span
            className={`ops-status${selected.risk ? " ops-status--risk" : ""}`}
          >
            <i aria-hidden="true" />
            {selected.risk ? t.delayed : t.healthy}
          </span>
          <div className="ops-itinerary">
            <div>
              <span>{hubs[selected.from].code}</span>
              <strong>{cityName(hubs[selected.from])}</strong>
            </div>
            <span className="ops-itinerary-arrow" aria-hidden="true">
              →
            </span>
            <div>
              <span>{hubs[selected.to].code}</span>
              <strong>{cityName(hubs[selected.to])}</strong>
            </div>
          </div>
          <span className="ops-freight-mode">{selected.mode[locale]}</span>
          <dl className="ops-shipment-details">
            <div>
              <dt>{t.cargo}</dt>
              <dd>
                {locale === "ru"
                  ? selected.cargo.replace(" kg", " кг")
                  : selected.cargo}
              </dd>
            </div>
            <div>
              <dt>{t.eta}</dt>
              <dd>
                {selected.eta}
                <small>UTC +03</small>
              </dd>
            </div>
          </dl>
          <div className="ops-progress-label">
            <span>{t.progress}</span>
            <strong>{selected.progress}%</strong>
          </div>
          <div
            className="ops-progress-track"
            role="progressbar"
            aria-label={t.progress}
            aria-valuenow={selected.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${selected.progress}%` }} />
          </div>
          <div className={`ops-insight ops-insight--${view}`}>
            <span className="ops-insight-icon" aria-hidden="true">
              {view === "risk" ? "!" : view === "data" ? "✓" : "↗"}
            </span>
            <div>
              <strong>
                {view === "risk"
                  ? t.alert
                  : view === "data"
                    ? t.quality
                    : t.routeSummary}
              </strong>
              <p>
                {view === "risk"
                  ? t.alertDescription
                  : view === "data"
                    ? t.qualityDescription
                    : t.routeSummaryDescription}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div
        className="ops-route-selector"
        role="group"
        aria-label={t.routeSelect}
      >
        {shipmentRoutes.slice(0, 3).map((route, index) => (
          <button
            type="button"
            key={route.id}
            aria-pressed={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            <span
              className={`ops-route-indicator${
                route.risk ? " ops-route-indicator--risk" : ""
              }`}
              aria-hidden="true"
            />
            <span>
              {hubs[route.from].code}
              <i aria-hidden="true"> → </i>
              {hubs[route.to].code}
            </span>
            <span className="ops-route-button-id">{route.id}</span>
          </button>
        ))}
      </div>

      <div className="ops-kpis" aria-label={`${t.sample}: ${t.region}`}>
        <div>
          <span>{t.active}</span>
          <strong>
            128<small>{locale === "ru" ? "ДЕМО" : "DEMO"}</small>
          </strong>
        </div>
        <div>
          <span>{t.hubs}</span>
          <strong>
            06<small>{locale === "ru" ? "ЦЕНТРЫ" : "HUBS"}</small>
          </strong>
        </div>
        <div>
          <span>{t.attention}</span>
          <strong className="ops-risk-number">
            01<small>{t.sample}</small>
          </strong>
        </div>
        <div>
          <span>{t.fresh}</span>
          <strong>
            8<small>{locale === "ru" ? "СЕК" : "SEC"}</small>
          </strong>
        </div>
      </div>
      <footer className="ops-footer">
        <span>{t.demo}</span>
        <span>{t.disclaimer}</span>
      </footer>
    </div>
  )
}
