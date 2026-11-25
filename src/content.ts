export type Locale = "tr" | "en" | "ru"
export type Localized<T = string> = Readonly<Record<Locale, T>>
export type ProjectId = "operations" | "bridge" | "badhabinot"
export type ProjectVisibility = "confidential" | "private-repository" | "personal" | "team"

export interface Project {
  readonly id: string
  readonly slug: string
  readonly index: string
  readonly title: Localized
  readonly kicker: Localized
  readonly summary: Localized
  readonly problem: Localized
  readonly contribution: Localized
  readonly implemented: Localized<readonly string[]>
  readonly planned: Localized<readonly string[]>
  readonly architecture: Localized
  readonly technologies: readonly string[]
  readonly visibility: ProjectVisibility
  readonly status: Localized
  readonly sharing: Localized
  readonly outputs: Localized<readonly string[]> | null
  readonly verifiedLinks: Readonly<{
    repository: string | null
    demo: string | null
  }>
  readonly tone: "lime" | "blue" | "coral" | "neutral"
  readonly illustration: "operations" | "collaboration" | "pose" | null
  readonly visual: "operations" | "bridge" | "pose" | "system"
  readonly image: Readonly<{
    src: string
    alt: Localized
    width: number
    height: number
  }> | null
  // Compatibility aliases reference the same typed content, avoiding a second copy.
  readonly purpose: Localized
  readonly features: Localized<readonly string[]>
  readonly tech: readonly string[]
}

type ProjectInput = Omit<Project, "purpose" | "features" | "tech">
const defineProject = (data: ProjectInput): Project => ({
  ...data,
  purpose: data.problem,
  features: data.implemented,
  tech: data.technologies,
})
const emptyFeatures: Localized<readonly string[]> = { tr: [], en: [], ru: [] }
const privateSharing: Localized = {
  tr: "Proje gizlidir. Paylaşılabilecek teknik ayrıntıları iletişim üzerinden görüşebiliriz.",
  en: "This project is confidential. Get in touch to discuss the technical details I can share.",
  ru: "Проект конфиденциален. Свяжитесь со мной, чтобы обсудить технические детали, которыми я могу поделиться.",
}

interface SocialLink {
  label: Localized
  ariaLabel: Localized
  url: string
}

export const profile = {
  name: "Shakhobiddin Shamshiev",
  email: "shakho0303@gmail.com",
  linkedin: "https://www.linkedin.com/in/%C5%9Fahabettin-%C5%9F-703373285",
  socialLinks: [
    {
      label: { tr: "LinkedIn", en: "LinkedIn", ru: "LinkedIn" },
      ariaLabel: {
        tr: "LinkedIn profilini aç",
        en: "Open LinkedIn profile",
        ru: "Открыть профиль в LinkedIn",
      },
      url: "https://www.linkedin.com/in/%C5%9Fahabettin-%C5%9F-703373285",
    },
  ] as readonly SocialLink[],
  role: {
    tr: "Bilgisayar Mühendisi | Full-Stack Developer",
    en: "Computer Engineer | Full-Stack Developer",
    ru: "Компьютерный инженер | Фулстек-разработчик",
  },
  location: {
    tr: "İstanbul, Türkiye",
    en: "Istanbul, Türkiye",
    ru: "Стамбул, Турция",
  },
  cvDownload: null,
  domain: null,
  defaultLocale: "tr" as Locale,
} as const

export const profileNames: Localized = {
  tr: "Şehabettin Şamşiev",
  en: "Shakhobiddin Shamshiev",
  ru: "Shakhobiddin Shamshiev",
}

export const profileName = (locale: Locale): string => profileNames[locale]

export const featuredProjectIds: readonly ProjectId[] = [
  "operations",
  "bridge",
  "badhabinot",
]

export const projects: Readonly<Record<ProjectId, Project>> = {
  operations: defineProject({
    id: "operations",
    slug: "logistics-operations",
    index: "01",
    title: {
      tr: "Operations Manager",
      en: "Operations Manager",
      ru: "Operations Manager",
    },
    kicker: {
      tr: "Operasyon, risk ve raporlama",
      en: "Operations, risk, and reporting",
      ru: "Операции, риски и отчётность",
    },
    summary: {
      tr: "Dağınık çalışma sayfalarını operasyon verisine, risk uyarılarına ve canlı panolara dönüştüren lojistik platformu. Kara, deniz, hava ve tahsilat süreçleri ortak görünümde izlenir.",
      en: "A logistics platform turning scattered worksheets into operational data, risk alerts, and live dashboards. Road, sea, air, and collections processes share a common view.",
      ru: "Логистическая платформа, которая превращает разрозненные рабочие таблицы в операционные данные, предупреждения о рисках и обновляемые панели. Автомобильные, морские и воздушные перевозки, а также поступления платежей отслеживаются в едином представлении.",
    },
    problem: {
      tr: "Kara, deniz, hava ve tahsilat operasyonlarını ortak bir görünümde izlemek; gecikme ve riskleri görünür kılmak.",
      en: "Monitor road, sea, air, and collections operations in a shared view and make delays and risks visible.",
      ru: "Объединить мониторинг автомобильных, морских и воздушных перевозок и поступлений платежей, чтобы видеть задержки и риски.",
    },
    contribution: {
      tr: "ASP.NET Core 9 ile API/worker katmanlarını kurup Hangfire üzerinden çalışma sayfalarını okuma, veriyi normalleştirme ve EF Core ile PostgreSQL'e aktarma akışını geliştirdim. Risk kurallarını, KPI panolarını ve raporlamayı uyguladım; uyarıları Redis pub/sub üzerinden API'ye, SignalR ile React/TypeScript arayüzüne taşıyan canlı bildirim akışını oluşturdum. JWT ve rol tabanlı erişim bileşenlerini de uyguladım.",
      en: "I built the ASP.NET Core 9 API/worker layers and developed a Hangfire flow to read worksheets, normalize the data, and store it in PostgreSQL through EF Core. I implemented risk rules, KPI dashboards, and reporting, connecting alerts through Redis pub/sub to the API and through SignalR to the React/TypeScript interface. I also implemented JWT and role-based access components.",
      ru: "Я создал слои API и фоновой обработки на ASP.NET Core 9 и разработал процесс чтения рабочих таблиц через Hangfire, нормализации данных и сохранения в PostgreSQL с помощью EF Core. Реализовал правила выявления рисков, панели KPI и отчётность, а также передачу предупреждений через Redis pub/sub в API и далее через SignalR в интерфейс React/TypeScript. Кроме того, реализовал компоненты доступа на основе JWT и ролей.",
    },
    implemented: {
      tr: [
        "Hangfire ile zamanlanmış kaynak senkronizasyonu ve normalizasyon",
        "Çalışma sayfalarından tip güvenli PostgreSQL tablolarına veri eşleme",
        "Yapılandırılabilir risk kuralları, KPI panoları ve risk haritaları",
        "Para birimi bazında tahsilat takibi, satır yorumları ve görevler",
        "Excel raporları, SignalR bildirimleri ve JWT/rol erişim bileşenleri",
      ],
      en: [
        "Scheduled source synchronization and normalization with Hangfire",
        "Worksheet mapping to type-safe PostgreSQL tables",
        "Configurable risk rules, KPI dashboards, and risk maps",
        "Currency-based collections tracking, row comments, and tasks",
        "Excel reports, SignalR notifications, and JWT/role access components",
      ],
      ru: [
        "Плановая синхронизация источников и нормализация данных через Hangfire",
        "Преобразование рабочих таблиц в типизированные таблицы PostgreSQL",
        "Настраиваемые правила выявления рисков, панели KPI и карты рисков",
        "Учёт поступлений платежей по валютам, комментарии к строкам и задачи",
        "Отчёты Excel, уведомления SignalR и компоненты доступа на основе JWT и ролей",
      ],
    },
    planned: emptyFeatures,
    architecture: {
      tr: "Modular Monolith ve Clean Architecture temelinde ayrı API/worker katmanları; ASP.NET Core 9, EF Core ve PostgreSQL. Çalışma sayfası verisi normalizasyon ve risk motorundan geçer; uyarılar Redis pub/sub üzerinden API'ye, SignalR ile React/TypeScript arayüzüne taşınır. İncelenen sürümde operasyon ekranları ana platform arayüzüne bütünleşmiştir.",
      en: "Separate API/worker layers based on a Modular Monolith and Clean Architecture, using ASP.NET Core 9, EF Core, and PostgreSQL. Worksheet data passes through normalization and the risk engine; alerts travel through Redis pub/sub to the API and through SignalR to the React/TypeScript interface. In the reviewed version, operations screens are integrated into the main platform interface.",
      ru: "Отдельные слои API и фоновой обработки на основе модульного монолита и Clean Architecture с ASP.NET Core 9, EF Core и PostgreSQL. Данные рабочих таблиц проходят нормализацию и обработку движком рисков; предупреждения передаются через Redis pub/sub в API, а затем через SignalR в интерфейс React/TypeScript. В рассмотренной версии операционные экраны встроены в интерфейс основной платформы.",
    },
    technologies: [
      "ASP.NET Core 9",
      "EF Core",
      "PostgreSQL",
      "Redis",
      "Hangfire",
      "SignalR",
      "React",
      "TypeScript",
      "Docker",
    ],
    visibility: "confidential",
    status: {
      tr: "Gizli proje · anonim anlatım",
      en: "Confidential project · anonymized description",
      ru: "Конфиденциальный проект · описание без идентифицирующих деталей",
    },
    sharing: privateSharing,
    outputs: null,
    verifiedLinks: { repository: null, demo: null },
    tone: "lime",
    illustration: "operations",
    visual: "operations",
    image: null,
  }),
  bridge: defineProject({
    id: "bridge",
    slug: "real-time-collaboration",
    index: "02",
    title: { tr: "Bridge", en: "Bridge", ru: "Bridge" },
    kicker: {
      tr: "Görüşme, mesajlaşma ve ortak çalışma",
      en: "Meetings, messaging, and collaboration",
      ru: "Встречи, сообщения и совместная работа",
    },
    summary: {
      tr: "Görüşme, ekran paylaşımı, kalıcı mesajlaşma ve planlamayı aynı çalışma alanında birleştiren gerçek zamanlı web platformu.",
      en: "A real-time web platform bringing meetings, screen sharing, persistent messaging, and scheduling into one workspace.",
      ru: "Веб-платформа для работы в реальном времени, объединяющая встречи, демонстрацию экрана, переписку с сохранением истории и планирование в одном рабочем пространстве.",
    },
    problem: {
      tr: "Ekiplerin görüşme, mesajlaşma ve planlama ihtiyaçlarını ortak bir iletişim platformunda bir araya getirmek.",
      en: "Bring team meetings, messaging, and scheduling needs together in a shared communication platform.",
      ru: "Объединить встречи, переписку и планирование команды на общей коммуникационной платформе.",
    },
    contribution: {
      tr: "WebRTC görüşme ve ekran paylaşımını; anotasyonları, kalıcı mesajlaşmayı ve planlamayı uyguladım. React/TypeScript arayüzünü Node.js servislerine bağlayıp veri ve teslimat altyapısını kurdum.",
      en: "I implemented WebRTC calls and screen sharing, annotations, persistent messaging, and scheduling. I connected the React/TypeScript interface to Node.js services and established data and delivery foundations.",
      ru: "Я реализовал звонки и демонстрацию экрана через WebRTC, аннотации, переписку с сохранением истории и планирование. Связал интерфейс React/TypeScript с сервисами Node.js и подготовил инфраструктуру данных и поставки приложения.",
    },
    implemented: {
      tr: [
        "WebRTC sesli/görüntülü görüşme ve ekran paylaşımı",
        "Ekran üzerinde çizim ve metin anotasyonları",
        "Kalıcı toplantı bağlantıları, misafir erişimi ve toplantı içi sohbet",
        "Kalıcı mesajlaşma, takvim, planlama ve canlı çeviri",
        "Microsoft OAuth, dış kullanıcı onayı ve rol tabanlı yönetim",
        "PostgreSQL/Redis bileşenleri, Docker Compose ve CI kontrollü teslimat",
      ],
      en: [
        "WebRTC audio/video conferencing and screen sharing",
        "On-screen drawing and text annotations",
        "Permanent meeting links, guest access, and in-meeting chat",
        "Persistent messaging, calendars, scheduling, and live translation",
        "Microsoft OAuth, external-user approval, and role-based administration",
        "PostgreSQL/Redis components, Docker Compose, and CI-gated delivery",
      ],
      ru: [
        "Аудио- и видеозвонки и демонстрация экрана через WebRTC",
        "Рисование и текстовые аннотации поверх экрана",
        "Постоянные ссылки на встречи, гостевой доступ и чат внутри встречи",
        "Переписка с сохранением истории, календарь, планирование и перевод в реальном времени",
        "Microsoft OAuth, одобрение внешних пользователей и управление на основе ролей",
        "Компоненты PostgreSQL/Redis, Docker Compose и поставка с проверками CI",
      ],
    },
    planned: emptyFeatures,
    architecture: {
      tr: "React/TypeScript arayüzü Node.js, Express ve Socket.IO servisleriyle çalışır. WebRTC ses/video görüşmesi ve ekran paylaşımını destekler. PostgreSQL ve Redis veri katmanını; Docker Compose ve GitHub Actions teslimat akışını oluşturur.",
      en: "The React/TypeScript interface works with Node.js, Express, and Socket.IO services. WebRTC supports audio/video calls and screen sharing. PostgreSQL and Redis form the data layer; Docker Compose and GitHub Actions support delivery.",
      ru: "Интерфейс React/TypeScript работает с сервисами Node.js, Express и Socket.IO. WebRTC обеспечивает аудио- и видеозвонки и демонстрацию экрана. PostgreSQL и Redis образуют слой данных; Docker Compose и GitHub Actions поддерживают поставку приложения.",
    },
    technologies: [
      "Node.js",
      "Express",
      "Socket.IO",
      "WebRTC",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Docker Compose",
      "GitHub Actions",
    ],
    visibility: "confidential",
    status: {
      tr: "Gizli proje · anonim anlatım",
      en: "Confidential project · anonymized description",
      ru: "Конфиденциальный проект · описание без идентифицирующих деталей",
    },
    sharing: privateSharing,
    outputs: null,
    verifiedLinks: { repository: null, demo: null },
    tone: "blue",
    illustration: "collaboration",
    visual: "bridge",
    image: null,
  }),
  badhabinot: defineProject({
    id: "badhabinot",
    slug: "badhabinot",
    index: "03",
    title: { tr: "Badhabinot", en: "Badhabinot", ru: "Badhabinot" },
    kicker: {
      tr: "Hareketten sinyale, sinyalden bağlama",
      en: "From movement to signals, from signals to context",
      ru: "От движения к сигналам, от сигналов к контексту",
    },
    summary: {
      tr: "Kamera tabanlı poz ve davranış sinyallerini geçmiş, raporlama ve yerel AI sohbetiyle birleştiren kişisel bitirme projem.",
      en: "My personal graduation project combines camera-based pose and behavioral signals with history, reporting, and local AI chat.",
      ru: "Мой личный выпускной проект объединяет сигналы позы и поведения, полученные с камеры, с историей, отчётами и чатом на основе локального ИИ.",
    },
    problem: {
      tr: "Masa başı davranışlarını görünür kılmak; kamera sinyallerini bağlamsal hatırlatma ve geçmişe dayalı önerilere dönüştürmek. Tıbbi teşhis kapsam dışıdır.",
      en: "Make desk-based behavior visible and turn camera signals into contextual reminders and history-based suggestions. Medical diagnosis is outside the scope.",
      ru: "Сделать поведение за рабочим столом видимым и преобразовать сигналы камеры в контекстные напоминания и рекомендации на основе истории. Медицинская диагностика не входит в задачи проекта.",
    },
    contribution: {
      tr: "Spring Boot backend ile Python görü ve AI servislerini bütünleştirdim; poz analizi, olay/hatırlatıcı akışı, raporlama ve davranış geçmişine dayalı Türkçe sohbeti geliştirdim.",
      en: "I integrated the Spring Boot backend with Python vision and AI services, developing pose analysis, event/reminder flows, reporting, and Turkish chat grounded in behavioral history.",
      ru: "Я интегрировал бэкенд Spring Boot с сервисами компьютерного зрения и ИИ на Python. Разработал анализ позы, обработку событий и напоминаний, отчётность и чат на турецком языке с опорой на историю поведения.",
    },
    implemented: {
      tr: [
        "MediaPipe ve YOLOv8 ile poz ve davranış sinyali çıkarımı",
        "Spring Boot üzerinden Vision ve AI servis orkestrasyonu",
        "Davranış olayları, hatırlatıcılar, günlük rapor ve haftalık geçmiş",
        "Yerel Ollama ile davranış geçmişine dayalı Türkçe sohbet ve SSE akışı",
        "Açık onam ve ham kamera görüntüsünü kalıcı saklamayan tasarım",
        "Qwen2.5 tabanlı Türkçe koçluk modeli için QLoRA ince-ayar çalışması",
      ],
      en: [
        "Pose and behavioral signal extraction with MediaPipe and YOLOv8",
        "Vision and AI service orchestration through Spring Boot",
        "Behavioral events, reminders, daily reports, and weekly history",
        "Turkish chat grounded in behavioral history with local Ollama and SSE",
        "Explicit consent and a design without persistent raw camera images",
        "QLoRA fine-tuning work for a Qwen2.5-based Turkish coaching model",
      ],
      ru: [
        "Извлечение сигналов позы и поведения с помощью MediaPipe и YOLOv8",
        "Оркестрация сервисов Vision и AI через Spring Boot",
        "События поведения, напоминания, ежедневные отчёты и недельная история",
        "Чат на турецком языке с опорой на историю поведения через локальный Ollama и поток SSE",
        "Явное согласие пользователя и архитектура без постоянного хранения исходных кадров камеры",
        "Работа по дообучению методом QLoRA модели Qwen2.5 для рекомендаций на турецком языке",
      ],
    },
    planned: {
      tr: [
        "Etiketli veriyle öğrenilmiş 1D-CNN davranış sınıflandırıcısının eğitimi ve değerlendirmesi",
        "Daha kapsamlı frontend, coverage ve eşzamanlı yük testleri",
      ],
      en: [
        "Training and evaluation of a learned 1D-CNN behavior classifier using labeled data",
        "Broader frontend, coverage, and concurrent-load testing",
      ],
      ru: [
        "Обучение и оценка классификатора поведения 1D-CNN на размеченных данных",
        "Более широкое тестирование фронтенда, покрытия кода и одновременной нагрузки",
      ],
    },
    architecture: {
      tr: "React istemcisi Spring Boot backend ile konuşur; backend ayrı FastAPI Vision ve AI servislerini orkestre eder. Görü çıktıları olay/rapor verisine ve yerel Ollama sohbet bağlamına dönüşür. Auth, User ve Monitoring için üç bağımsız PostgreSQL veritabanı; Redis önbellek ve Docker Compose.",
      en: "The React client communicates with a Spring Boot backend that orchestrates separate FastAPI Vision and AI services. Vision outputs become event/report data and context for local Ollama chat. Three independent PostgreSQL databases cover Auth, User, and Monitoring, with Redis caching and Docker Compose.",
      ru: "Клиент React взаимодействует с бэкендом Spring Boot, который оркестрирует отдельные сервисы FastAPI Vision и AI. Результаты компьютерного зрения преобразуются в данные событий и отчётов и в контекст локального чата Ollama. Для Auth, User и Monitoring используются три независимые базы PostgreSQL, кеширование Redis и Docker Compose.",
    },
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Python",
      "FastAPI",
      "MediaPipe",
      "YOLOv8",
      "Pose Estimation",
      "Computer Vision",
      "REST API",
      "SSE",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Ollama",
      "Qwen2.5",
      "QLoRA",
      "Docker Compose",
      "GitHub Actions",
    ],
    visibility: "personal",
    status: {
      tr: "Kişisel bitirme projesi · öğrenilmiş görü katmanı gelecek çalışma",
      en: "Personal graduation project · learned vision layer is future work",
      ru: "Личный выпускной проект · обучаемый слой компьютерного зрения запланирован на будущее",
    },
    sharing: {
      tr: "Kaynak kodu herkese açık GitHub deposunda inceleyebilirsiniz.",
      en: "Explore the source code in the public GitHub repository.",
      ru: "Исходный код можно изучить в открытом репозитории GitHub.",
    },
    outputs: null,
    verifiedLinks: {
      repository: "https://github.com/seboii/Badhabinot",
      demo: null,
    },
    tone: "coral",
    illustration: "pose",
    visual: "pose",
    image: null,
  }),
}

export const otherProjects: readonly Project[] = [
  defineProject({
    id: "logistics-assistant",
    slug: "logistics-assistant",
    index: "04",
    title: {
      tr: "CargoTwin",
      en: "CargoTwin",
      ru: "CargoTwin",
    },
    kicker: {
      tr: "Mimari ve uygulama temeli",
      en: "Architecture and application foundation",
      ru: "Основа архитектуры и приложения",
    },
    summary: {
      tr: "Çok kiracılı, salt okunur lojistik asistanının veri, API ve arayüz temeli. E-posta analizi, agent orkestrasyonu ve RAG tamamlanmış özellikler değil, kapsamı belirlenen sonraki adımlardır.",
      en: "Data, API, and interface foundations for a multi-tenant, read-only logistics assistant. Email analysis, agent orchestration, and RAG are scoped next steps rather than completed features.",
      ru: "Основа данных, API и интерфейса многопользовательского логистического ассистента с изоляцией клиентов и доступом только для чтения. Анализ почты, оркестрация агентов и RAG относятся к запланированным следующим этапам, а не к завершённым функциям.",
    },
    problem: {
      tr: "E-posta ve operasyon kayıtlarını Türkçe/İngilizce sorularla analiz etmeyi hedefleyen, kiracı sınırlarını koruyan salt okunur bir asistan tasarlamak.",
      en: "Design a read-only assistant intended to analyze email and operational records through Turkish/English queries while preserving tenant boundaries.",
      ru: "Спроектировать ассистента с доступом только для чтения, который должен анализировать почту и операционные записи по запросам на турецком и английском языках, сохраняя изоляцию клиентов.",
    },
    contribution: {
      tr: "Çözüm, veri modeli, API sözleşmeleri, kimlik doğrulama ve CI temelini hazırladım; 12 ekranlı React arayüzü, demo veri akışları ve ToolRegistry destekli yetenek listesi geliştirdim.",
      en: "I prepared the solution, data model, API contracts, authentication, and CI foundation, and built a 12-screen React interface, demo-data flows, and a ToolRegistry-backed capability list.",
      ru: "Я подготовил основу решения, модель данных, контракты API, аутентификацию и CI. Создал интерфейс React из 12 экранов, процессы работы с демонстрационными данными и список возможностей на основе ToolRegistry.",
    },
    implemented: {
      tr: [
        "Veri modeli, API sözleşmeleri ve kiracı izolasyonu tasarımı",
        "Veritabanı, kimlik doğrulama ve CI temeli",
        "12 ekranlı React arayüzü ve örnek veriye dayalı demo akışları",
        "Sunucu tarafı ToolRegistry ile yetenek listesi",
      ],
      en: [
        "Data model, API contracts, and tenant-isolation design",
        "Database, authentication, and CI foundation",
        "12-screen React interface and flows using demonstration data",
        "Capability list backed by a server-side ToolRegistry",
      ],
      ru: [
        "Модель данных, контракты API и проектирование изоляции клиентов",
        "Основа базы данных, аутентификации и CI",
        "Интерфейс React из 12 экранов и процессы на демонстрационных данных",
        "Список возможностей на основе серверного ToolRegistry",
      ],
    },
    planned: {
      tr: [
        "E-posta analizi",
        "Agent orkestrasyonu",
        "Kritik olay tespiti",
        "PDF raporlama",
        "RAG modülleri",
      ],
      en: [
        "Email analysis",
        "Agent orchestration",
        "Critical-event detection",
        "PDF reporting",
        "RAG modules",
      ],
      ru: [
        "Анализ электронной почты",
        "Оркестрация агентов",
        "Выявление критических событий",
        "Отчёты PDF",
        "Модули RAG",
      ],
    },
    architecture: {
      tr: "Uygulanan temel: çözüm/veritabanı, kimlik doğrulama, API sözleşmeleri, CI, React demo akışları ve ToolRegistry yetenek listesi. Tanımlanan mimari yığın ASP.NET Core 9, React, PostgreSQL/pgvector, Redis, Microsoft Graph, OpenAI .NET SDK ve Docker Compose içerir. E-posta → analiz → agent → rapor/RAG akışı planlanan kapsamdır; erişim modeli Outlook yazma işlemlerini dışlar.",
      en: "Implemented foundation: solution/database, authentication, API contracts, CI, React demonstration flows, and the ToolRegistry capability list. The defined architectural stack includes ASP.NET Core 9, React, PostgreSQL/pgvector, Redis, Microsoft Graph, OpenAI .NET SDK, and Docker Compose. The email → analysis → agent → report/RAG flow is planned scope; the access model excludes Outlook write operations.",
      ru: "Реализованная основа: решение и база данных, аутентификация, контракты API, CI, демонстрационные процессы React и список возможностей ToolRegistry. Определённый архитектурный стек включает ASP.NET Core 9, React, PostgreSQL/pgvector, Redis, Microsoft Graph, OpenAI .NET SDK и Docker Compose. Процесс «почта → анализ → агент → отчёт/RAG» входит в запланированный объём работ; модель доступа исключает операции записи в Outlook.",
    },
    technologies: [
      "ASP.NET Core 9",
      "React",
      "PostgreSQL/pgvector",
      "Redis",
      "Microsoft Graph",
      "OpenAI .NET SDK",
      "Docker Compose",
    ],
    visibility: "confidential",
    status: {
      tr: "Mimari/uygulama temeli · AI modülleri kapsam aşamasında",
      en: "Architecture/application foundation · AI modules scoped",
      ru: "Основа архитектуры и приложения · объём модулей ИИ определён",
    },
    sharing: privateSharing,
    outputs: null,
    verifiedLinks: { repository: null, demo: null },
    tone: "neutral",
    illustration: null,
    visual: "system",
    image: null,
  }),
  defineProject({
    id: "mailops",
    slug: "mailops",
    index: "05",
    title: { tr: "Mailops", en: "Mailops", ru: "Mailops" },
    kicker: {
      tr: "E-posta analizi ve yönetimi",
      en: "Email analysis and management",
      ru: "Анализ электронной почты и управление записями",
    },
    summary: {
      tr: "E-posta analizi, kullanıcı raporlaması ve kayıt yönetimi. Teknik rapor; .NET merkez servisini Python işleme servisleriyle birleştiren asenkron bir mimariyi belgeler. Repository özel.",
      en: "Email analysis, user reporting, and record management. The technical report documents an asynchronous architecture combining a .NET core with Python processing services. The repository is private.",
      ru: "Анализ электронной почты, отчёты по пользователям и управление записями. Технический отчёт описывает асинхронную архитектуру, объединяющую центральный сервис .NET с сервисами обработки на Python. Репозиторий закрыт.",
    },
    problem: {
      tr: "E-posta verilerini filtrelemek, işlemek ve raporlamak için sürdürülebilir backend hizmetleri oluşturmak.",
      en: "Build maintainable backend services for filtering, processing, and reporting email data.",
      ru: "Создать поддерживаемые бэкенд-сервисы для фильтрации, обработки и формирования отчётов по электронной почте.",
    },
    contribution: {
      tr: "E-posta analizi, kullanıcı raporlama ve kayıt yönetimi modüllerini geliştirdim; veri filtreleme, işleme ve düzenleme backend servislerini tasarladım.",
      en: "I developed email analysis, user reporting, and record-management modules, and designed backend services for filtering, processing, and organizing data.",
      ru: "Я разработал модули анализа электронной почты, отчётов по пользователям и управления записями, а также спроектировал бэкенд-сервисы для фильтрации, обработки и упорядочивания данных.",
    },
    implemented: {
      tr: [
        "E-posta veri analizi",
        "Kullanıcı bazında raporlama",
        "E-posta kayıt yönetimi",
        "Filtreleme, işleme ve düzenleme backend servisleri",
        "Teknik raporda belgelenen Graph entegrasyonu ve kuyruk tabanlı temizleme/analiz akışı",
      ],
      en: [
        "Email data analysis",
        "User-based reporting",
        "Mail-record management",
        "Backend services for filtering, processing, and organizing data",
        "Graph integration and queue-based cleaning/analysis flow documented in the technical report",
      ],
      ru: [
        "Анализ данных электронной почты",
        "Отчёты по пользователям",
        "Управление записями электронной почты",
        "Бэкенд-сервисы фильтрации, обработки и упорядочивания данных",
        "Интеграция Graph и обработка очистки и анализа через очередь, описанные в техническом отчёте",
      ],
    },
    planned: emptyFeatures,
    architecture: {
      tr: "Teknik raporun belgelediği hibrit mimari: React/TypeScript arayüzü, özellik odaklı Vertical Slice .NET merkez API, RabbitMQ ile Python/FastAPI temizleme ve analiz servisleri. Microsoft Graph/OAuth veri alımı; PostgreSQL kalıcılık, Redis önbellek ve Docker Compose. CV'deki PostgreSQL/MySQL alternatiflerinden farklı olarak rapor PostgreSQL'i belirtir.",
      en: "Hybrid architecture documented in the technical report: a React/TypeScript interface, feature-based Vertical Slice .NET core API, and Python/FastAPI cleaning and analysis services connected through RabbitMQ. Microsoft Graph/OAuth ingestion, PostgreSQL persistence, Redis caching, and Docker Compose. The report specifies PostgreSQL, while the CV lists PostgreSQL/MySQL alternatives.",
      ru: "Гибридная архитектура, описанная в техническом отчёте: интерфейс React/TypeScript, центральный API .NET с подходом Vertical Slice по функциям и сервисы очистки и анализа Python/FastAPI, связанные через RabbitMQ. Получение данных через Microsoft Graph/OAuth, хранение в PostgreSQL, кеширование Redis и Docker Compose. В отчёте указан PostgreSQL, тогда как в резюме перечислены варианты PostgreSQL/MySQL.",
    },
    technologies: [
      "C#",
      ".NET / ASP.NET Core",
      "React / TypeScript",
      "Python",
      "FastAPI",
      "RabbitMQ",
      "MassTransit",
      "Microsoft Graph",
      "OAuth 2.0",
      "RESTful API",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Docker Compose",
      "Git",
      "AI/ML Integration",
      "Email Analytics",
      "User Reporting",
    ],
    visibility: "private-repository",
    status: {
      tr: "Kişisel proje · özel repository",
      en: "Personal project · private repository",
      ru: "Личный проект · закрытый репозиторий",
    },
    sharing: {
      tr: "Repository özeldir. Kod veya demo paylaşımı otomatik erişim garantisi vermez; kapsam iletişim üzerinden değerlendirilir.",
      en: "The repository is private. Code or demo requests do not guarantee access; sharing scope is reviewed through contact.",
      ru: "Репозиторий закрыт. Запрос кода или демонстрации не гарантирует доступ; допустимый объём материалов обсуждается при обращении.",
    },
    outputs: null,
    verifiedLinks: { repository: null, demo: null },
    tone: "neutral",
    illustration: null,
    visual: "system",
    image: null,
  }),
  defineProject({
    id: "otomark",
    slug: "otomark",
    index: "06",
    title: { tr: "OtoMARK", en: "OtoMARK", ru: "OtoMARK" },
    kicker: {
      tr: "Erken dönem ekip projesi",
      en: "Early team project",
      ru: "Ранний командный проект",
    },
    summary: {
      tr: "Üniversite bağlamında ekip olarak geliştirilen C++ otopark yönetimi masaüstü uygulaması.",
      en: "A C++ parking-management desktop application developed as a university team project.",
      ru: "Настольное приложение для управления парковкой на C++, разработанное командой в рамках университетского проекта.",
    },
    problem: {
      tr: "Kampüs otopark yönetimini ve operasyonel ihtiyaçlarını masaüstü uygulamasıyla desteklemek.",
      en: "Support campus parking management and operational needs with a desktop application.",
      ru: "Поддержать управление парковкой кампуса и связанные операционные задачи с помощью настольного приложения.",
    },
    contribution: {
      tr: "Sistem tasarımına, çekirdek mantığın uygulanmasına ve testlere katkıda bulundum.",
      en: "I contributed to system design, core logic implementation, and testing.",
      ru: "Я участвовал в проектировании системы, реализации основной логики и тестировании.",
    },
    implemented: {
      tr: [
        "C++ masaüstü otopark yönetimi uygulaması",
        "Sistem tasarımı, çekirdek mantık ve test katkısı",
      ],
      en: [
        "C++ desktop parking-management application",
        "Contribution to system design, core logic, and testing",
      ],
      ru: [
        "Настольное приложение для управления парковкой на C++",
        "Участие в проектировании системы, реализации основной логики и тестировании",
      ],
    },
    planned: emptyFeatures,
    architecture: {
      tr: "C++ ile geliştirilen otopark yönetimi masaüstü uygulaması.",
      en: "A parking management desktop application built with C++.",
      ru: "Настольное приложение для управления парковкой, разработанное на C++.",
    },
    technologies: ["C++"],
    visibility: "team",
    status: {
      tr: "Üniversite ekip projesi",
      en: "University team project",
      ru: "Университетский командный проект",
    },
    sharing: {
      tr: "OtoMARK bir ekip projesidir. Teknik ayrıntılar için bana ulaşabilirsiniz.",
      en: "OtoMARK is a team project. Get in touch for technical details.",
      ru: "OtoMARK — командный проект. Свяжитесь со мной, чтобы обсудить технические детали.",
    },
    outputs: null,
    verifiedLinks: { repository: null, demo: null },
    tone: "neutral",
    illustration: null,
    visual: "system",
    image: null,
  }),
]

export interface SkillGroup {
  readonly index: string
  readonly title: Localized
  readonly tools: readonly string[]
  readonly relatedProjects: readonly string[]
}
export const skills: readonly SkillGroup[] = [
  {
    index: "01",
    title: {
      tr: "Backend & mimari",
      en: "Backend & architecture",
      ru: "Бэкенд и архитектура",
    },
    tools: [
      "ASP.NET Core",
      "Node.js",
      "Spring Boot",
      "REST API",
      "Clean Architecture",
    ],
    relatedProjects: ["operations", "bridge", "badhabinot"],
  },
  {
    index: "02",
    title: {
      tr: "Arayüz & gerçek zamanlı sistemler",
      en: "Interfaces & real-time systems",
      ru: "Интерфейсы и системы реального времени",
    },
    tools: [
      "React",
      "TypeScript",
      "SignalR",
      "Socket.IO",
      "WebRTC",
      "WebSocket",
    ],
    relatedProjects: ["operations", "bridge", "badhabinot"],
  },
  {
    index: "03",
    title: {
      tr: "Veri & AI entegrasyonu",
      en: "Data & AI integration",
      ru: "Данные и интеграция ИИ",
    },
    tools: ["PostgreSQL", "Redis", "Python", "SQL", "YOLOv8"],
    relatedProjects: ["badhabinot", "operations"],
  },
  {
    index: "04",
    title: {
      tr: "Teslimat araçları",
      en: "Delivery tools",
      ru: "Инструменты поставки приложения",
    },
    tools: ["Git", "Docker", "Docker Compose", "GitHub Actions", "Hangfire"],
    relatedProjects: ["operations", "bridge"],
  },
]

export interface TimelineEntry {
  readonly id: string
  readonly year: string
  readonly title: Localized
  readonly date: Localized
  readonly description: Localized
}
export const timeline: readonly TimelineEntry[] = [
  {
    id: "freelance",
    year: "2025",
    title: {
      tr: "Software Engineer · Freelance",
      en: "Software Engineer · Freelance",
      ru: "Инженер-программист · Фриланс",
    },
    date: { tr: "Başlangıç: 2025", en: "Started in 2025", ru: "С 2025 года" },
    description: {
      tr: "Gereksinim analizi, web/backend geliştirme, teknik danışmanlık, hata ayıklama, performans iyileştirme ve mimari karar desteği.",
      en: "Requirements analysis, web/backend development, technical consulting, debugging, performance improvements, and architecture decision support.",
      ru: "Анализ требований, разработка веб-приложений и бэкенда, технические консультации, отладка, улучшение производительности и помощь в принятии архитектурных решений.",
    },
  },
  {
    id: "data-miner",
    year: "2024",
    title: {
      tr: "Data Miner · OLS Logistics",
      en: "Data Miner · OLS Logistics",
      ru: "Специалист по анализу данных · OLS Logistics",
    },
    date: {
      tr: "Temmuz–Eylül 2024",
      en: "July–September 2024",
      ru: "Июль–сентябрь 2024",
    },
    description: {
      tr: "Python ve SQL ile veri madenciliği, segmentasyon, hedef kitle belirleme, tahmine dayalı modelleme ve veri hazırlama.",
      en: "Data mining, segmentation, audience identification, predictive modeling, and data preparation with Python and SQL.",
      ru: "Интеллектуальный анализ данных, сегментация, определение целевой аудитории, прогнозное моделирование и подготовка данных с помощью Python и SQL.",
    },
  },
  {
    id: "education",
    year: "B.Eng.",
    title: {
      tr: "İstanbul Rumeli Üniversitesi",
      en: "Istanbul Rumeli University",
      ru: "Стамбульский университет Румели",
    },
    date: {
      tr: "Bilgisayar Mühendisliği · Lisans mezunu",
      en: "Computer Engineering · B.Eng. graduate",
      ru: "Компьютерная инженерия · Бакалавр",
    },
    description: {
      tr: "Mühendislik ve Doğa Bilimleri Fakültesi",
      en: "Faculty of Engineering and Natural Sciences",
      ru: "Факультет инженерии и естественных наук",
    },
  },
]

export const languages: readonly Localized[] = [
  {
    tr: "Özbekçe · Ana dil",
    en: "Uzbek · Native",
    ru: "Узбекский · Родной язык",
  },
  {
    tr: "Türkçe · Ana dil",
    en: "Turkish · Native",
    ru: "Турецкий · Родной язык",
  },
  {
    tr: "Rusça · İleri",
    en: "Russian · Advanced",
    ru: "Русский · Продвинутый уровень",
  },
  {
    tr: "İngilizce · Orta",
    en: "English · Intermediate",
    ru: "Английский · Средний уровень",
  },
]

const trCopy = {
  nav: ["Projeler", "Hakkımda", "Deneyim", "İletişim"],
  role: profile.role.tr,
  claim:
    "Gerçek zamanlı uygulamalar, operasyon platformları ve veri odaklı çözümler geliştiriyorum.",
  location: profile.location.tr,
  viewWork: "Projelerimi incele",
  contact: "İletişime geç",
  selected: "Seçili çalışmalar",
  selectedIntro: "Arayüzden veri katmanına. Birlikte çalışan sistemler.",
  representative: "Temsili arayüz · örnek veri",
  conceptual: "Kavramsal görselleştirme",
  purpose: "Bağlam & amaç",
  contribution: "Katkım",
  details: "Projeyi incele",
  other: "Diğer çalışmalar",
  otherIntro: "Farklı problemler, aynı mühendislik merakı.",
  approachEyebrow: "Mühendislik yaklaşımı",
  approachTitle: "Arayüzün arkasındaki sistem de önemli.",
  approachBody:
    "Backend, veri modeli ve arayüzü birlikte düşünerek anlaşılır, sürdürülebilir uygulamalar geliştirmeye odaklanıyorum.",
  about: "Hakkımda",
  bio: "Bilgisayar mühendisliği eğitimimi backend ve full-stack geliştirme pratiğiyle birleştiriyorum. REST API tasarımı, veritabanı odaklı uygulamalar ve gerçek zamanlı sistemler üzerinde çalışıyorum; AI entegrasyonlarını da bu bütünün bir parçası olarak ele alıyorum.",
  experience: "Deneyim & eğitim",
  freelance: "Software Engineer · Freelance",
  current: "Başlangıç: 2025",
  miner: "Data Miner · OLS Logistics",
  minerDate: "Temmuz–Eylül 2024",
  school: "İstanbul Rumeli Üniversitesi",
  degree: "Bilgisayar Mühendisliği · Lisans mezunu",
  contactEyebrow: "İletişim",
  contactTitle: "Bir sonraki projeyi konuşalım.",
  contactBody:
    "Ürün geliştirme, gerçek zamanlı sistemler veya veri odaklı bir fikir için bana yazın.",
  sendMail: "E-posta gönder",
  copyMail: "Adresi kopyala",
  copied: "E-posta adresi kopyalandı.",
  copyError:
    "Adres kopyalanamadı. E-posta bağlantısını kullanabilir veya adresi seçip kopyalayabilirsiniz.",
  requestCv: "CV iste",
  linkedin: "LinkedIn profilini aç",
  back: "Tüm projelere dön",
  overview: "Genel bakış",
  implemented: "Uygulanan özellikler",
  planned: "Kapsamı belirlenen özellikler",
  architecture: "Teknik yaklaşım",
  technologies: "Teknolojiler",
  boundaries: "Paylaşım sınırları",
  boundaryText: privateSharing.tr,
  publicBoundary: projects.badhabinot.sharing.tr,
  viewRepo: "GitHub deposunu aç",
  viewDemo: "Demoyu aç",
  requestDetails: "Teknik ayrıntı iste",
  nextProject: "Sonraki çalışma",
  openMenu: "Menüyü aç",
  closeMenu: "Menüyü kapat",
  skip: "İçeriğe atla",
  home: "Ana sayfa",
  navigation: "Ana gezinme",
  language: "Dil seçimi",
  motion: "Hareketi azalt",
  motionEnabled: "Hareket azaltıldı",
  motionDisabled: "Standart hareket",
  scroll: "Akışı keşfet",
  featured: "SEÇİLİ ÇALIŞMA",
  flowLabel: "Arayüz, API, veri ve teslimat için dekoratif kavramsal akış",
  related: "İlgili çalışmalar",
  languageSkills: "Diller",
  notFound: "Bu proje bulunamadı.",
  notFoundBody: "Seçili çalışmalara dönerek projeleri inceleyebilirsiniz.",
  siteDescription:
    "Şehabettin Şamşiev — Bilgisayar Mühendisi ve Full-Stack Developer. Gerçek zamanlı uygulamalar, lojistik platformları ve veri odaklı projeler.",
  footer: "Engineering in Motion",
} as const

export type SiteCopy = {
  readonly [Key in keyof typeof trCopy]: Key extends "nav"
    ? readonly [string, string, string, string]
    : string
}

const enCopy: SiteCopy = {
  nav: ["Projects", "About", "Experience", "Contact"],
  role: profile.role.en,
  claim:
    "I build real-time applications, operations platforms, and data-driven solutions.",
  location: profile.location.en,
  viewWork: "Explore projects",
  contact: "Get in touch",
  selected: "Selected work",
  selectedIntro: "From interface to data. Systems that work together.",
  representative: "Representative interface · sample data",
  conceptual: "Conceptual visualization",
  purpose: "Context & purpose",
  contribution: "My contribution",
  details: "View project",
  other: "Other work",
  otherIntro: "Different problems, the same engineering curiosity.",
  approachEyebrow: "Engineering approach",
  approachTitle: "The system behind the interface matters, too.",
  approachBody:
    "I focus on building clear, maintainable applications by thinking about backend, data models, and interfaces together.",
  about: "About",
  bio: "I combine my computer engineering background with backend and full-stack development. I work on REST API design, database-driven applications, and real-time systems, treating AI integrations as part of that wider product.",
  experience: "Experience & education",
  freelance: "Software Engineer · Freelance",
  current: "Started in 2025",
  miner: "Data Miner · OLS Logistics",
  minerDate: "July–September 2024",
  school: "Istanbul Rumeli University",
  degree: "Computer Engineering · B.Eng. graduate",
  contactEyebrow: "Contact",
  contactTitle: "Let’s talk about the next project.",
  contactBody:
    "Write to me about product development, real-time systems, or a data-driven idea.",
  sendMail: "Send an email",
  copyMail: "Copy address",
  copied: "Email address copied.",
  copyError:
    "The address could not be copied. Use the email link, or select and copy the address.",
  requestCv: "Request CV",
  linkedin: "Open LinkedIn profile",
  back: "Back to all projects",
  overview: "Overview",
  implemented: "Implemented features",
  planned: "Scoped features",
  architecture: "Technical approach",
  technologies: "Technologies",
  boundaries: "Sharing boundaries",
  boundaryText: privateSharing.en,
  publicBoundary: projects.badhabinot.sharing.en,
  viewRepo: "Open GitHub repository",
  viewDemo: "Open demo",
  requestDetails: "Request technical details",
  nextProject: "Next project",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  skip: "Skip to content",
  home: "Home",
  navigation: "Main navigation",
  language: "Language selection",
  motion: "Reduce motion",
  motionEnabled: "Motion reduced",
  motionDisabled: "Standard motion",
  scroll: "Explore the flow",
  featured: "SELECTED WORK",
  flowLabel:
    "Decorative conceptual flow for interface, API, data, and delivery",
  related: "Related work",
  languageSkills: "Languages",
  notFound: "This project could not be found.",
  notFoundBody: "Return to selected work to explore the projects.",
  siteDescription:
    "Shakhobiddin Shamshiev — Computer Engineer and Full-Stack Developer. Real-time applications, logistics platforms, and data-driven projects.",
  footer: "Engineering in Motion",
}

const ruCopy: SiteCopy = {
  nav: ["Проекты", "Обо мне", "Опыт", "Контакты"],
  role: profile.role.ru,
  claim:
    "Я разрабатываю приложения реального времени, операционные платформы и решения на основе данных.",
  location: profile.location.ru,
  viewWork: "Посмотреть проекты",
  contact: "Связаться со мной",
  selected: "Избранные работы",
  selectedIntro: "От интерфейса до слоя данных. Системы, работающие вместе.",
  representative: "Иллюстративный интерфейс · пример данных",
  conceptual: "Концептуальная визуализация",
  purpose: "Контекст и цель",
  contribution: "Мой вклад",
  details: "Посмотреть проект",
  other: "Другие работы",
  otherIntro: "Разные задачи, тот же инженерный интерес.",
  approachEyebrow: "Инженерный подход",
  approachTitle: "Система за интерфейсом тоже важна.",
  approachBody:
    "Я стремлюсь создавать понятные и поддерживаемые приложения, рассматривая бэкенд, модель данных и интерфейс как единое целое.",
  about: "Обо мне",
  bio: "Я объединяю образование в области компьютерной инженерии с практикой разработки бэкенда и полнофункциональных веб-приложений. Работаю над проектированием REST API, приложениями на основе баз данных и системами реального времени; интеграцию ИИ рассматриваю как часть продукта в целом.",
  experience: "Опыт и образование",
  freelance: "Инженер-программист · Фриланс",
  current: "С 2025 года",
  miner: "Специалист по анализу данных · OLS Logistics",
  minerDate: "Июль–сентябрь 2024",
  school: "Стамбульский университет Румели",
  degree: "Компьютерная инженерия · Бакалавр",
  contactEyebrow: "Контакты",
  contactTitle: "Обсудим следующий проект.",
  contactBody:
    "Напишите мне, если хотите обсудить разработку продукта, системы реального времени или идею на основе данных.",
  sendMail: "Написать письмо",
  copyMail: "Скопировать адрес",
  copied: "Адрес электронной почты скопирован.",
  copyError:
    "Не удалось скопировать адрес. Воспользуйтесь ссылкой электронной почты или выделите и скопируйте адрес вручную.",
  requestCv: "Запросить резюме",
  linkedin: "Открыть профиль в LinkedIn",
  back: "Вернуться ко всем проектам",
  overview: "Обзор",
  implemented: "Реализованные функции",
  planned: "Запланированные функции",
  architecture: "Технический подход",
  technologies: "Технологии",
  boundaries: "Условия доступа к материалам",
  boundaryText: privateSharing.ru,
  publicBoundary: projects.badhabinot.sharing.ru,
  viewRepo: "Открыть репозиторий GitHub",
  viewDemo: "Открыть демонстрацию",
  requestDetails: "Запросить технические детали",
  nextProject: "Следующий проект",
  openMenu: "Открыть меню",
  closeMenu: "Закрыть меню",
  skip: "Перейти к содержимому",
  home: "Главная",
  navigation: "Основная навигация",
  language: "Выбор языка",
  motion: "Уменьшить анимацию",
  motionEnabled: "Анимация уменьшена",
  motionDisabled: "Обычная анимация",
  scroll: "Посмотреть, как всё связано",
  featured: "ИЗБРАННАЯ РАБОТА",
  flowLabel:
    "Декоративная схема связей между интерфейсом, API, данными и поставкой приложения",
  related: "Связанные проекты",
  languageSkills: "Языки",
  notFound: "Проект не найден.",
  notFoundBody: "Вернитесь к избранным работам, чтобы посмотреть проекты.",
  siteDescription:
    "Shakhobiddin Shamshiev — компьютерный инженер и фулстек-разработчик. Приложения реального времени, логистические платформы и проекты на основе данных.",
  footer: "Инженерия в движении",
}

export const copy: Readonly<Record<Locale, SiteCopy>> = {
  tr: trCopy,
  en: enCopy,
  ru: ruCopy,
}
