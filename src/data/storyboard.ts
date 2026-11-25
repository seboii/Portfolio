import type { Localized } from "../content"

export type SceneKind = "operations" | "collaboration" | "pose" | "intelligence"
export interface SystemChapter {
  id: string
  projectId: string
  kind: SceneKind
  number: string
  title: Localized
  concept: Localized
  steps: Localized<readonly string[]>
  labels: Localized<readonly string[]>
}

export const systemChapters: readonly SystemChapter[] = [
  {
    id: "operations",
    projectId: "operations",
    kind: "operations",
    number: "03",
    title: {
      tr: "Her rota.\nBir sinyal.",
      en: "Every route.\nA signal.",
      ru: "Каждый маршрут.\nОдин сигнал.",
    },
    concept: {
      tr: "Dağınık operasyon verisinden ortak bir görünüm.",
      en: "From scattered operational data to a shared view.",
      ru: "От разрозненных операционных данных к общей картине.",
    },
    steps: {
      tr: ["Kaynakları birleştir", "Riski görünür kıl", "Değişikliği ilet"],
      en: ["Connect the sources", "Make risk visible", "Deliver the change"],
      ru: [
        "Объединить источники",
        "Сделать риски видимыми",
        "Передать изменения",
      ],
    },
    labels: {
      tr: [
        "Farklı çalışma sayfalarından gelen operasyon verisi zamanlanmış işlerle okunur ve ortak bir modele dönüştürülür.",
        "Yapılandırılabilir kurallar gecikme ve riskleri belirler; uyarılar, KPI panoları ve risk haritalarıyla görünür olur.",
        "Risk uyarıları Redis pub/sub ve SignalR üzerinden arayüze ulaşır; ekipler değişiklikleri aynı operasyon görünümünde izler.",
      ],
      en: [
        "Scheduled jobs read operational data from separate worksheets and normalize it into a shared model.",
        "Configurable rules identify delays and risks, making them visible through alerts, KPI dashboards, and risk maps.",
        "Risk alerts reach the interface through Redis pub/sub and SignalR, keeping changes visible in a shared operations view.",
      ],
      ru: [
        "Задачи по расписанию считывают операционные данные из отдельных таблиц и приводят их к общей модели.",
        "Настраиваемые правила выявляют задержки и риски, отображая их в оповещениях, панелях KPI и на картах рисков.",
        "Оповещения о рисках поступают в интерфейс через Redis pub/sub и SignalR, позволяя видеть изменения в общей операционной картине.",
      ],
    },
  },
  {
    id: "collaboration",
    projectId: "bridge",
    kind: "collaboration",
    number: "04",
    title: {
      tr: "Mesafeyi\nbağlantıya çevir.",
      en: "Turn distance\ninto connection.",
      ru: "Превратить расстояние\nв связь.",
    },
    concept: {
      tr: "Görüşme, mesaj ve ortak çalışma. Aynı bağlamda.",
      en: "Conversation, messages, and shared work. One context.",
      ru: "Разговоры, сообщения и совместная работа. В одном контексте.",
    },
    steps: {
      tr: ["Bağlantıyı kur", "Bağlamı paylaş", "Birlikte çalış"],
      en: ["Establish a connection", "Share the context", "Work together"],
      ru: ["Установить связь", "Поделиться контекстом", "Работать вместе"],
    },
    labels: {
      tr: ["WebRTC", "Ekran paylaşımı", "Anotasyon"],
      en: ["WebRTC", "Screen sharing", "Annotation"],
      ru: ["WebRTC", "Демонстрация экрана", "Аннотации"],
    },
  },
  {
    id: "badhabinot",
    projectId: "badhabinot",
    kind: "pose",
    number: "05",
    title: {
      tr: "Hareket,\nveriye dönüşür.",
      en: "When movement\nbecomes data.",
      ru: "Когда движение\nстановится данными.",
    },
    concept: {
      tr: "Görsel sinyallerden yapılandırılmış analize.",
      en: "From visual signals to structured analysis.",
      ru: "От визуальных сигналов к структурированному анализу.",
    },
    steps: {
      tr: ["Hareketi izle", "Pozu yapılandır", "Analize bağla"],
      en: ["Track the movement", "Structure the pose", "Connect the analysis"],
      ru: [
        "Отследить движение",
        "Структурировать данные позы",
        "Подключить анализ",
      ],
    },
    labels: {
      tr: ["Poz çıkarımı", "Yapılandırılmış sinyal", "Analiz akışı"],
      en: ["Pose extraction", "Structured signal", "Analysis flow"],
      ru: ["Определение позы", "Структурированный сигнал", "Поток анализа"],
    },
  },
  {
    id: "intelligence",
    projectId: "logistics-assistant",
    kind: "intelligence",
    number: "06",
    title: {
      tr: "Veriden\nanlamlı bir adıma.",
      en: "From data\nto a meaningful step.",
      ru: "От данных\nк осмысленному действию.",
    },
    concept: {
      tr: "Uygulanan mimari temel. Sınırları tanımlanmış AI kapsamı.",
      en: "An implemented architectural foundation. A defined AI scope.",
      ru: "Реализованная архитектурная основа. Определённые границы возможностей ИИ.",
    },
    steps: {
      tr: ["Bağlamı ayır", "Yeteneği sınırla", "AI kapsamını tanımla"],
      en: [
        "Isolate the context",
        "Bound the capability",
        "Define the AI scope",
      ],
      ru: [
        "Изолировать контекст",
        "Ограничить возможности",
        "Определить задачи ИИ",
      ],
    },
    labels: {
      tr: ["Tenant bağlamı", "ToolRegistry", "Tanımlanan AI kapsamı"],
      en: ["Tenant context", "ToolRegistry", "Scoped AI capabilities"],
      ru: ["Контекст клиента", "ToolRegistry", "Планируемые возможности ИИ"],
    },
  },
]

export const cinemaCopy = {
  tr: {
    prelude: "MÜHENDİSLİK / GERÇEK ZAMAN / VERİ / AI",
    heroClaim:
      "Gerçek zamanlı veri, yazılım mimarisi ve akıllı otomasyonun buluştuğu sistemler geliştiriyorum.",
    explore: "Sistemleri keşfet",
    contact: "İletişime geç",
    heroCaption: "Bir arayüzün ötesinde. Birlikte çalışan katmanlar.",
    researchEyebrow: "SİSTEMLERİN İÇİNDE YAŞADIĞI DÜNYA",
    researchTitle: "Sistemler tek başına\nvar olmaz.",
    researchLead:
      "Lojistik, iletişim ve AI. Farklı alanlarda ortak soru: doğru sinyal, doğru bağlama nasıl ulaşır?",
    source: "Kaynak",
    selected: "SEÇİLİ SİSTEMLER",
    context: "Bağlam",
    contribution: "Katkım",
    detail: "Sistemi incele",
    architecture: "Mimariyi keşfet",
    framework: "Mimari yapı",
    stage: "AKIŞ",
    foundation: "UYGULANAN TEMEL",
    scoped: "TANIMLANAN KAPSAM",
    approachEyebrow: "SİSTEMLERİ NASIL DÜŞÜNÜYORUM",
    approachTitle: "Arayüz,\nyalnızca yüzey.",
    approachBody:
      "Deneyimden altyapıya. Katmanları tek tek değil, aralarındaki ilişkiyi düşünerek.",
    layerLabel: "Mühendislik katmanını seç",
    aboutEyebrow: "MÜHENDİSLİK YOLCULUĞU",
    aboutTitle: "Merak.\nPratik.\nSistemler.",
    earlier: "DİĞER SİSTEMLER",
    earlierTitle: "Daha küçük ölçek.\nAynı dikkat.",
    otherDetails: "Çalışmayı incele",
    closing: "Birlikte, amacı olan\nsistemler geliştirelim.",
    closingBody:
      "Gerçek zamanlı uygulamalar, operasyon platformları ve veri odaklı bir fikir için bana yazın.",
    detailContext: "Sistemin bağlamı",
    featureWalk: "Sistem yürüyüşü",
    implemented: "Uygulanan bileşenler",
    planned: "Kapsamı belirlenen bileşenler",
    technology: "Teknoloji / bağlam",
    nextSystem: "Sonraki sistem",
  },
  en: {
    prelude: "ENGINEERING / REAL TIME / DATA / AI",
    heroClaim:
      "Building systems where real-time data, software architecture, and intelligent automation meet.",
    explore: "Explore systems",
    contact: "Contact",
    heroCaption: "Beyond an interface. Layers working together.",
    researchEyebrow: "THE WORLD THESE SYSTEMS LIVE IN",
    researchTitle: "Systems don't exist\nin isolation.",
    researchLead:
      "Logistics, communication, and AI. Different fields, one question: how does the right signal reach the right context?",
    source: "Source",
    selected: "SELECTED SYSTEMS",
    context: "Context",
    contribution: "My contribution",
    detail: "Explore system",
    architecture: "Explore the architecture",
    framework: "System architecture",
    stage: "FLOW",
    foundation: "IMPLEMENTED FOUNDATION",
    scoped: "DEFINED SCOPE",
    approachEyebrow: "HOW I THINK ABOUT SYSTEMS",
    approachTitle: "The interface\nis only the surface.",
    approachBody:
      "From experience to infrastructure. Thinking through the connections, not just the individual layers.",
    layerLabel: "Choose an engineering layer",
    aboutEyebrow: "AN ENGINEERING TRAJECTORY",
    aboutTitle: "Curiosity.\nPractice.\nSystems.",
    earlier: "OTHER SYSTEMS",
    earlierTitle: "A smaller scale.\nThe same care.",
    otherDetails: "Explore this work",
    closing: "Let's build systems\nthat move with purpose.",
    closingBody:
      "Write to me about a real-time application, an operations platform, or a data-driven idea.",
    detailContext: "The context of the system",
    featureWalk: "System walkthrough",
    implemented: "Implemented components",
    planned: "Scoped components",
    technology: "Technology / context",
    nextSystem: "Next system",
  },
  ru: {
    prelude: "ИНЖЕНЕРИЯ / РЕАЛЬНОЕ ВРЕМЯ / ДАННЫЕ / ИИ",
    heroClaim:
      "Разрабатываю системы, в которых встречаются данные в реальном времени, программная архитектура и интеллектуальная автоматизация.",
    explore: "Исследовать системы",
    contact: "Связаться",
    heroCaption: "Больше, чем интерфейс. Слои, работающие вместе.",
    researchEyebrow: "МИР, В КОТОРОМ РАБОТАЮТ СИСТЕМЫ",
    researchTitle: "Системы не существуют\nв изоляции.",
    researchLead:
      "Логистика, коммуникация и ИИ. Разные области, один вопрос: как нужный сигнал попадает в нужный контекст?",
    source: "Источник",
    selected: "ИЗБРАННЫЕ СИСТЕМЫ",
    context: "Контекст",
    contribution: "Мой вклад",
    detail: "Изучить систему",
    architecture: "Изучить архитектуру",
    framework: "Архитектура системы",
    stage: "ПОТОК",
    foundation: "РЕАЛИЗОВАННАЯ ОСНОВА",
    scoped: "ОПРЕДЕЛЁННЫЙ ОБЪЁМ",
    approachEyebrow: "КАК Я ПРОЕКТИРУЮ СИСТЕМЫ",
    approachTitle: "Интерфейс —\nтолько поверхность.",
    approachBody:
      "От пользовательского опыта до инфраструктуры. Продумываю связи между слоями, а не только сами слои.",
    layerLabel: "Выбрать инженерный слой",
    aboutEyebrow: "МОЙ ИНЖЕНЕРНЫЙ ПУТЬ",
    aboutTitle: "Любопытство.\nПрактика.\nСистемы.",
    earlier: "ДРУГИЕ СИСТЕМЫ",
    earlierTitle: "Меньший масштаб.\nТа же внимательность.",
    otherDetails: "Изучить проект",
    closing: "Давайте создавать системы\nс понятной целью.",
    closingBody:
      "Напишите мне о приложении реального времени, операционной платформе или идее на основе данных.",
    detailContext: "Контекст системы",
    featureWalk: "Как работает система",
    implemented: "Реализованные компоненты",
    planned: "Планируемые компоненты",
    technology: "Технологии / контекст",
    nextSystem: "Следующая система",
  },
} as const

export const engineeringLayers = [
  {
    id: "experience",
    title: { tr: "Deneyim", en: "Experience", ru: "Пользовательский опыт" },
    tools: "React / TypeScript",
    projectIds: ["bridge", "operations"],
    body: {
      tr: "Veri ve iş akışını anlaşılır bir arayüze dönüştürmek.",
      en: "Turn data and workflows into an understandable interface.",
      ru: "Превращать данные и рабочие процессы в понятный интерфейс.",
    },
  },
  {
    id: "application",
    title: { tr: "Uygulama", en: "Application", ru: "Приложение" },
    tools: "REST / WebRTC / SignalR / Socket.IO",
    projectIds: ["bridge", "operations"],
    body: {
      tr: "Arayüzün ihtiyaçlarını servisler ve gerçek zamanlı bağlantılarla karşılamak.",
      en: "Connect interface needs to services and real-time communication.",
      ru: "Связывать потребности интерфейса с сервисами и обменом данными в реальном времени.",
    },
  },
  {
    id: "domain",
    title: { tr: "Alan", en: "Domain", ru: "Предметная область" },
    tools: "Clean Architecture / Modular Monolith",
    projectIds: ["operations"],
    body: {
      tr: "Kuralları ve sorumlulukları sürdürülebilir bir yapıda tutmak.",
      en: "Keep rules and responsibilities in a maintainable structure.",
      ru: "Организовывать правила и зоны ответственности так, чтобы систему было удобно поддерживать.",
    },
  },
  {
    id: "data",
    title: { tr: "Veri", en: "Data", ru: "Данные" },
    tools: "PostgreSQL / Redis / SQL",
    projectIds: ["operations", "badhabinot"],
    body: {
      tr: "Veri modelini, erişim sınırlarını ve akışın tutarlılığını birlikte düşünmek.",
      en: "Consider the data model, access boundaries, and flow consistency together.",
      ru: "Рассматривать модель данных, границы доступа и согласованность потоков как единое целое.",
    },
  },
  {
    id: "infrastructure",
    title: { tr: "Altyapı", en: "Infrastructure", ru: "Инфраструктура" },
    tools: "Docker / CI / Hangfire",
    projectIds: ["operations", "bridge"],
    body: {
      tr: "Uygulamayı çalıştırma, zamanlama ve teslimat araçlarıyla tamamlamak.",
      en: "Complete the application with execution, scheduling, and delivery tools.",
      ru: "Дополнять приложение средствами запуска, планирования и доставки.",
    },
  },
] as const
