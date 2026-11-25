import type { Localized } from "../content"

export type ArchitectureProjectId = "operations" | "bridge" | "badhabinot" | "logistics-assistant" | "mailops" | "otomark"

export type ArchitectureState = "documented" | "foundation" | "planned"

export interface ArchitectureNode {
  readonly id: string
  readonly label: Localized
  readonly tag: Localized
  readonly description: Localized
  readonly state: ArchitectureState
  readonly x: number
  readonly y: number
}

export interface ArchitectureEdge {
  readonly from: string
  readonly to: string
  readonly kind: "documented" | "conceptual" | "planned"
  readonly label: Localized
  readonly bend?: number
}

export interface ArchitectureDiagram {
  readonly title: Localized
  readonly summary: Localized
  readonly nodes: readonly ArchitectureNode[]
  readonly edges: readonly ArchitectureEdge[]
}

const text = (tr: string, en: string, ru: string): Localized => ({ tr, en, ru })
const node = (
  id: string,
  label: Localized,
  tag: Localized,
  description: Localized,
  x: number,
  y: number,
  state: ArchitectureState = "documented",
): ArchitectureNode => ({ id, label, tag, description, x, y, state })
const edge = (
  from: string,
  to: string,
  label: Localized,
  kind: ArchitectureEdge["kind"] = "documented",
  bend = 35,
): ArchitectureEdge => ({ from, to, label, kind, bend })

export const architectureCopy = {
  heading: text(
    "Bileşenlerin birlikte çalışması",
    "How the components connect",
    "Как связаны компоненты",
  ),
  documented: text("Bileşen", "Component", "Компонент"),
  foundation: text(
    "Uygulanan temel",
    "Implemented foundation",
    "Реализованная основа",
  ),
  planned: text("Planlanan kapsam", "Planned scope", "Планируемые возможности"),
  components: text("Bileşenler", "Components", "Компоненты"),
  connections: text("Akış özeti", "Flow summary", "Схема взаимодействия"),
} as const

// Original diagram positions and curves explain the cited component summaries.
// They do not reproduce private deployment topology or source PDF artwork.
export const architectures: Readonly<Record<ArchitectureProjectId, ArchitectureDiagram>> =
  {
    operations: {
      title: text(
        "Kaynak veriden canlı operasyona",
        "From source data to live operations",
        "От исходных данных к оперативной работе",
      ),
      summary: text(
        "Normalizasyon ve risk değerlendirmesi, çalışma sayfası verisini canlı arayüze taşır.",
        "Normalization and risk evaluation carry worksheet data into the live interface.",
        "Нормализация и оценка рисков передают данные из таблиц в интерфейс в реальном времени.",
      ),
      nodes: [
        node(
          "source",
          text("Çalışma sayfası", "Worksheet", "Рабочая таблица"),
          text("KAYNAK", "SOURCE", "ИСТОЧНИК"),
          text(
            "Operasyon verisinin kaynak çalışma sayfaları.",
            "Source worksheets holding operational data.",
            "Исходные таблицы с операционными данными.",
          ),
          120,
          230,
        ),
        node(
          "worker",
          text("Worker", "Worker", "Обработчик"),
          text("HANGFIRE", "HANGFIRE", "HANGFIRE"),
          text(
            "Zamanlanmış okuma, veri eşleme ve normalizasyon.",
            "Scheduled reading, data mapping, and normalization.",
            "Чтение по расписанию, сопоставление и нормализация данных.",
          ),
          340,
          120,
        ),
        node(
          "risk",
          text("Takip & risk", "Tracking & risk", "Отслеживание и риски"),
          text("POSTGRESQL", "POSTGRESQL", "POSTGRESQL"),
          text(
            "Takip kayıtları ve yapılandırılabilir risk kuralları.",
            "Tracking records and configurable risk rules.",
            "Записи отслеживания и настраиваемые правила оценки рисков.",
          ),
          550,
          230,
        ),
        node(
          "events",
          text("Olay akışı", "Event flow", "Поток событий"),
          text("REDIS PUB/SUB", "REDIS PUB/SUB", "REDIS PUB/SUB"),
          text(
            "Uyarı olaylarının yayınlanması ve API köprüsüne taşınması.",
            "Publication of alert events and delivery to the API bridge.",
            "Публикация событий оповещения и их передача в связующий API.",
          ),
          710,
          445,
        ),
        node(
          "api",
          text("API köprüsü", "API bridge", "Связующий API"),
          text("API / SIGNALR", "API / SIGNALR", "API / SIGNALR"),
          text(
            "API katmanından SignalR ile canlı bildirim yayını.",
            "Live notifications through SignalR from the API layer.",
            "Оповещения в реальном времени через SignalR из слоя API.",
          ),
          945,
          245,
        ),
        node(
          "ui",
          text("Operasyon panosu", "Operations dashboard", "Панель операций"),
          text("REACT", "REACT", "REACT"),
          text(
            "Ana platforma bütünleşmiş React/TypeScript operasyon ekranları.",
            "React/TypeScript operations screens integrated into the main platform.",
            "Операционные экраны на React/TypeScript, встроенные в основную платформу.",
          ),
          970,
          520,
        ),
      ],
      edges: [
        edge(
          "source",
          "worker",
          text(
            "Okuma ve normalizasyon",
            "Read and normalize",
            "Чтение и нормализация",
          ),
          "documented",
          -35,
        ),
        edge(
          "worker",
          "risk",
          text("Takip verisi", "Tracking data", "Данные отслеживания"),
          "documented",
          -35,
        ),
        edge(
          "risk",
          "events",
          text("Risk uyarıları", "Risk alerts", "Оповещения о рисках"),
          "documented",
          50,
        ),
        edge(
          "events",
          "api",
          text(
            "Pub/sub bildirimi",
            "Pub/sub notification",
            "Оповещения pub/sub",
          ),
          "documented",
          -35,
        ),
        edge(
          "api",
          "ui",
          text(
            "SignalR canlı akışı",
            "SignalR live stream",
            "Поток событий SignalR",
          ),
          "documented",
          55,
        ),
      ],
    },
    bridge: {
      title: text(
        "Medya ve ortak çalışma akışları",
        "Media and collaboration flows",
        "Медиа и совместная работа",
      ),
      summary: text(
        "WebRTC medya akışı ve gerçek zamanlı uygulama iletişimi.",
        "WebRTC media and real-time application communication.",
        "Передача медиа через WebRTC и обмен данными приложения в реальном времени.",
      ),
      nodes: [
        node(
          "client",
          text(
            "Ortak çalışma alanı",
            "Shared workspace",
            "Общее рабочее пространство",
          ),
          text(
            "REACT / TYPESCRIPT",
            "REACT / TYPESCRIPT",
            "REACT / TYPESCRIPT",
          ),
          text(
            "Görüşme, ekran paylaşımı, anotasyon ve sohbet arayüzü.",
            "Meeting, screen-sharing, annotation, and chat interface.",
            "Интерфейс встреч, демонстрации экрана, аннотаций и чата.",
          ),
          180,
          320,
        ),
        node(
          "media",
          text("Medya", "Media", "Медиа"),
          text("WEBRTC", "WEBRTC", "WEBRTC"),
          text(
            "Ses, görüntü ve ekran paylaşımı özellikleri.",
            "Audio, video, and screen-sharing features.",
            "Аудио, видео и демонстрация экрана.",
          ),
          550,
          100,
        ),
        node(
          "realtime",
          text(
            "Gerçek zamanlı kanal",
            "Real-time channel",
            "Канал реального времени",
          ),
          text("SOCKET.IO", "SOCKET.IO", "SOCKET.IO"),
          text(
            "Uygulamanın gerçek zamanlı iletişim bileşeni.",
            "The application's real-time communication component.",
            "Компонент обмена данными приложения в реальном времени.",
          ),
          550,
          510,
        ),
        node(
          "services",
          text(
            "Uygulama servisleri",
            "Application services",
            "Сервисы приложения",
          ),
          text("NODE.JS / EXPRESS", "NODE.JS / EXPRESS", "NODE.JS / EXPRESS"),
          text(
            "Mesajlaşma, planlama ve erişim özellikleri için servisler.",
            "Services supporting messaging, scheduling, and access features.",
            "Сервисы обмена сообщениями, планирования и управления доступом.",
          ),
          900,
          300,
        ),
        node(
          "data",
          text("Veri bileşenleri", "Data components", "Компоненты данных"),
          text(
            "POSTGRESQL / REDIS",
            "POSTGRESQL / REDIS",
            "POSTGRESQL / REDIS",
          ),
          text(
            "PostgreSQL ve Redis veri bileşenleri.",
            "PostgreSQL and Redis data components.",
            "Компоненты хранения и обработки данных на PostgreSQL и Redis.",
          ),
          920,
          535,
        ),
      ],
      edges: [
        edge(
          "client",
          "media",
          text(
            "Görüşme ve ekran paylaşımı",
            "Calls and screen sharing",
            "Звонки и демонстрация экрана",
          ),
          "conceptual",
          -80,
        ),
        edge(
          "client",
          "realtime",
          text(
            "Gerçek zamanlı uygulama iletişimi",
            "Real-time application communication",
            "Обмен данными в реальном времени",
          ),
          "conceptual",
          80,
        ),
        edge(
          "realtime",
          "services",
          text(
            "Mesajlaşma ve koordinasyon",
            "Messaging and coordination",
            "Сообщения и координация",
          ),
          "conceptual",
          35,
        ),
        edge(
          "services",
          "data",
          text("Veri erişimi", "Data access", "Доступ к данным"),
          "conceptual",
          -45,
        ),
      ],
    },
    badhabinot: {
      title: text(
        "Gözlemden bağlama dayalı yanıta",
        "From observation to grounded response",
        "От наблюдения к ответу на основе данных",
      ),
      summary: text(
        "Spring Boot orkestrasyonu, ayrı görüntü ve AI servislerini davranış geçmişiyle birleştirir.",
        "Spring Boot orchestration combines separate vision and AI services with behavior history.",
        "Оркестрация на Spring Boot объединяет отдельные сервисы компьютерного зрения и ИИ с историей поведения.",
      ),
      nodes: [
        node(
          "client",
          text("Gözlem & sohbet", "Observation & chat", "Наблюдение и чат"),
          text("REACT / SSE", "REACT / SSE", "REACT / SSE"),
          text(
            "Kullanıcı arayüzü Spring Boot ile iletişim kurar; sohbet yanıtları SSE ile aktarılır.",
            "The interface communicates with Spring Boot; chat responses stream through SSE.",
            "Интерфейс взаимодействует со Spring Boot; ответы чата передаются потоком через SSE.",
          ),
          150,
          315,
        ),
        node(
          "core",
          text("Orkestrasyon", "Orchestration", "Оркестрация"),
          text("SPRING BOOT", "SPRING BOOT", "SPRING BOOT"),
          text(
            "Kullanıcı, izleme, raporlama ve servis koordinasyonu.",
            "User, monitoring, reporting, and service coordination.",
            "Управление пользователями, мониторинг, отчётность и координация сервисов.",
          ),
          535,
          300,
        ),
        node(
          "vision",
          text("Görüntü sinyalleri", "Vision signals", "Сигналы изображения"),
          text(
            "FASTAPI / MEDIAPIPE / YOLO",
            "FASTAPI / MEDIAPIPE / YOLO",
            "FASTAPI / MEDIAPIPE / YOLO",
          ),
          text(
            "Görüntü servisinde MediaPipe ve YOLOv8 ile türetilen sinyaller; mevcut davranış yorumları kural tabanlıdır.",
            "Signals derived using MediaPipe and YOLOv8 in the vision service; current behavior interpretation is rule-based.",
            "Сигналы, полученные с помощью MediaPipe и YOLOv8 в сервисе компьютерного зрения; текущая интерпретация поведения основана на правилах.",
          ),
          365,
          90,
        ),
        node(
          "ai",
          text("Bağlama dayalı AI", "Grounded AI", "ИИ с опорой на данные"),
          text("PYTHON / FASTAPI", "PYTHON / FASTAPI", "PYTHON / FASTAPI"),
          text(
            "Davranış geçmişine dayanan Türkçe sohbet ve rapor bağlamı.",
            "Turkish chat and reporting context grounded in behavior history.",
            "Контекст чата на турецком языке и отчётов, основанный на истории поведения.",
          ),
          825,
          100,
        ),
        node(
          "model",
          text(
            "Yerel dil modeli",
            "Local language model",
            "Локальная языковая модель",
          ),
          text("OLLAMA / QWEN2.5", "OLLAMA / QWEN2.5", "OLLAMA / QWEN2.5"),
          text(
            "Yerel Ollama ve Qwen2.5 entegrasyonu.",
            "Local Ollama and Qwen2.5 integration.",
            "Интеграция локальных Ollama и Qwen2.5.",
          ),
          1000,
          330,
        ),
        node(
          "data",
          text(
            "Ayrı veri bağlamları",
            "Separate data contexts",
            "Раздельные контексты данных",
          ),
          text(
            "3 POSTGRESQL / REDIS",
            "3 POSTGRESQL / REDIS",
            "3 POSTGRESQL / REDIS",
          ),
          text(
            "Auth, User ve Monitoring için üç PostgreSQL bağlamı; Redis geçici durum ve önbellek desteği.",
            "Three PostgreSQL contexts for Auth, User, and Monitoring; Redis supports temporary state and caching.",
            "Три контекста PostgreSQL для Auth, User и Monitoring; Redis обеспечивает хранение временного состояния и кеширование.",
          ),
          360,
          525,
        ),
        node(
          "learned",
          text("Öğrenilmiş model", "Learned model", "Обученная модель"),
          text("1D-CNN", "1D-CNN", "1D-CNN"),
          text(
            "Etiketli veri, eğitilmiş model ve değerlendirme tamamlanmış kabul edilmez.",
            "Labeled data, a trained model, and evaluation are not treated as complete.",
            "Размеченные данные, обученная модель и её оценка пока не считаются завершёнными.",
          ),
          800,
          540,
          "planned",
        ),
      ],
      edges: [
        edge(
          "client",
          "core",
          text(
            "İstekler ve SSE yanıtları",
            "Requests and SSE responses",
            "Запросы и ответы SSE",
          ),
          "documented",
          50,
        ),
        edge(
          "core",
          "vision",
          text(
            "Görüntü işleme koordinasyonu",
            "Vision-processing coordination",
            "Координация обработки изображений",
          ),
          "documented",
          -25,
        ),
        edge(
          "core",
          "ai",
          text(
            "Davranış geçmişi ve sohbet",
            "Behavior history and chat",
            "История поведения и чат",
          ),
          "documented",
          45,
        ),
        edge(
          "ai",
          "model",
          text("Yerel çıkarım", "Local inference", "Локальный инференс"),
          "documented",
          -30,
        ),
        edge(
          "core",
          "data",
          text(
            "Ayrı veri bağlamları",
            "Separate data contexts",
            "Раздельные контексты данных",
          ),
          "documented",
          20,
        ),
        edge(
          "vision",
          "learned",
          text(
            "Gelecekte öğrenilmiş değerlendirme",
            "Future learned evaluation",
            "Будущая оценка обученной модели",
          ),
          "planned",
          -100,
        ),
      ],
    },
    "logistics-assistant": {
      title: text(
        "Hazır temel, sonraki AI kapsamı",
        "Built foundation, next AI scope",
        "Готовая основа и дальнейшие возможности ИИ",
      ),
      summary: text(
        "Üç temel bileşen ve dört planlanan AI alanı.",
        "Three foundation components and four planned AI areas.",
        "Три базовых компонента и четыре планируемых направления ИИ.",
      ),
      nodes: [
        node(
          "ui",
          text("Arayüz & demo", "Interface & demo", "Интерфейс и демо"),
          text("REACT / 12 EKRAN", "REACT / 12 SCREENS", "REACT / 12 ЭКРАНОВ"),
          text(
            "12 ekranlı arayüz ve örnek veri akışları.",
            "A 12-screen interface and demonstration data flows.",
            "Интерфейс из 12 экранов и потоки демонстрационных данных.",
          ),
          160,
          180,
          "foundation",
        ),
        node(
          "context",
          text(
            "Veri & API temeli",
            "Data & API foundation",
            "Основа данных и API",
          ),
          text("KİRACI BAĞLAMI", "TENANT CONTEXT", "КОНТЕКСТ КЛИЕНТА"),
          text(
            "Veri modeli, API sözleşmeleri, kimlik doğrulama ve kiracı izolasyonu tasarımı.",
            "Data model, API contracts, authentication, and tenant-isolation design.",
            "Модель данных, контракты API, аутентификация и проектирование изоляции клиентов.",
          ),
          550,
          100,
          "foundation",
        ),
        node(
          "tools",
          text("Yetenek listesi", "Capability list", "Список возможностей"),
          text("TOOLREGISTRY", "TOOLREGISTRY", "TOOLREGISTRY"),
          text(
            "Sunucu tarafı yeteneklerin ToolRegistry ile tanımlanması.",
            "Server-side capabilities defined through ToolRegistry.",
            "Серверные возможности, описанные в ToolRegistry.",
          ),
          970,
          185,
          "foundation",
        ),
        node(
          "email",
          text("E-posta analizi", "Email analysis", "Анализ почты"),
          text("PLANLANAN", "PLANNED", "ПЛАНИРУЕТСЯ"),
          text(
            "Salt okunur e-posta analizi için kapsam.",
            "Scope for read-only email analysis.",
            "Планируемый анализ электронной почты в режиме только для чтения.",
          ),
          130,
          495,
          "planned",
        ),
        node(
          "agents",
          text("Agent & olaylar", "Agents & events", "Агенты и события"),
          text("PLANLANAN", "PLANNED", "ПЛАНИРУЕТСЯ"),
          text(
            "Agent orkestrasyonu ve kritik olay tespiti kapsamı.",
            "Scoped agent orchestration and critical-event detection.",
            "Планируемая оркестрация агентов и обнаружение критических событий.",
          ),
          405,
          505,
          "planned",
        ),
        node(
          "rag",
          text("RAG", "RAG", "RAG"),
          text("PLANLANAN", "PLANNED", "ПЛАНИРУЕТСЯ"),
          text(
            "Kaynak bağlamı getirme modülleri için kapsam.",
            "Scope for retrieval-augmented context modules.",
            "Планируемые модули получения контекста с помощью поиска.",
          ),
          690,
          505,
          "planned",
        ),
        node(
          "reports",
          text("PDF raporlama", "PDF reporting", "Отчёты PDF"),
          text("PLANLANAN", "PLANNED", "ПЛАНИРУЕТСЯ"),
          text(
            "PDF raporlama modülleri için kapsam.",
            "Scope for PDF-reporting modules.",
            "Планируемые модули формирования отчётов PDF.",
          ),
          975,
          495,
          "planned",
        ),
      ],
      edges: [
        edge(
          "ui",
          "context",
          text(
            "Demo veri ve API sözleşmeleri",
            "Demo data and API contracts",
            "Демоданные и контракты API",
          ),
          "conceptual",
          -20,
        ),
        edge(
          "context",
          "tools",
          text(
            "Tanımlanan yetenekler",
            "Defined capabilities",
            "Определённые возможности",
          ),
          "conceptual",
          -20,
        ),
        edge(
          "context",
          "email",
          text(
            "Sonraki e-posta kapsamı",
            "Next email scope",
            "Дальнейшая работа с почтой",
          ),
          "planned",
          25,
        ),
        edge(
          "email",
          "agents",
          text(
            "Planlanan analiz ve orkestrasyon",
            "Planned analysis and orchestration",
            "Планируемый анализ и оркестрация",
          ),
          "planned",
          35,
        ),
        edge(
          "agents",
          "rag",
          text(
            "Planlanan kaynak bağlamı",
            "Planned source context",
            "Планируемый контекст источников",
          ),
          "planned",
          35,
        ),
        edge(
          "rag",
          "reports",
          text(
            "Planlanan raporlama",
            "Planned reporting",
            "Планируемая отчётность",
          ),
          "planned",
          35,
        ),
      ],
    },
    mailops: {
      title: text(
        "E-postadan işlenmiş kayda",
        "From email to processed record",
        "От письма к обработанной записи",
      ),
      summary: text(
        "Vertical Slice merkez API, kuyruk üzerinden ayrı temizleme ve analiz servislerini koordine eder.",
        "The Vertical Slice core API coordinates separate cleaning and analysis services through a queue.",
        "Основной API с архитектурой Vertical Slice координирует отдельные сервисы очистки и анализа через очередь.",
      ),
      nodes: [
        node(
          "graph",
          text("E-posta kaynağı", "Email source", "Источник почты"),
          text("MICROSOFT GRAPH", "MICROSOFT GRAPH", "MICROSOFT GRAPH"),
          text(
            "Graph/OAuth aracılığıyla e-posta verisi alımı.",
            "Email data ingestion through Graph/OAuth.",
            "Получение данных электронной почты через Graph/OAuth.",
          ),
          130,
          185,
        ),
        node(
          "core",
          text("Merkez API", "Core API", "Основной API"),
          text(
            ".NET / VERTICAL SLICE",
            ".NET / VERTICAL SLICE",
            ".NET / VERTICAL SLICE",
          ),
          text(
            "Özellik odaklı API ve asenkron iş akışı koordinasyonu.",
            "Feature-based API and asynchronous workflow coordination.",
            "API, организованный по функциям, и координация асинхронных рабочих процессов.",
          ),
          430,
          100,
        ),
        node(
          "queue",
          text("İş kuyruğu", "Work queue", "Очередь задач"),
          text("RABBITMQ", "RABBITMQ", "RABBITMQ"),
          text(
            ".NET ile Python servisleri arasında kuyruk tabanlı iletişim.",
            "Queue-based communication between .NET and Python services.",
            "Обмен данными через очередь между сервисами .NET и Python.",
          ),
          690,
          265,
        ),
        node(
          "clean",
          text("Temizleme", "Cleaning", "Очистка"),
          text("PYTHON / FASTAPI", "PYTHON / FASTAPI", "PYTHON / FASTAPI"),
          text(
            "E-posta içeriğinin temizlenmesi ve işlenmeye hazırlanması.",
            "Cleaning email content and preparing it for processing.",
            "Очистка содержимого писем и подготовка к обработке.",
          ),
          980,
          115,
        ),
        node(
          "analyze",
          text("Analiz", "Analysis", "Анализ"),
          text("PYTHON / FASTAPI", "PYTHON / FASTAPI", "PYTHON / FASTAPI"),
          text(
            "Temizlenmiş verinin analiz servisiyle işlenmesi.",
            "Processing cleaned data through the analysis service.",
            "Обработка очищенных данных сервисом анализа.",
          ),
          980,
          445,
        ),
        node(
          "records",
          text("Kayıt & rapor", "Records & reports", "Записи и отчёты"),
          text(
            "POSTGRESQL / REACT",
            "POSTGRESQL / REACT",
            "POSTGRESQL / REACT",
          ),
          text(
            "Sonuçların kalıcılığı, kayıt yönetimi ve kullanıcı raporlama arayüzü.",
            "Result persistence, record management, and the user-reporting interface.",
            "Сохранение результатов, управление записями и пользовательский интерфейс отчётности.",
          ),
          470,
          525,
        ),
      ],
      edges: [
        edge(
          "graph",
          "core",
          text("Veri alımı", "Ingestion", "Получение данных"),
          "documented",
          -35,
        ),
        edge(
          "core",
          "queue",
          text("İş talepleri", "Work requests", "Запросы на обработку"),
          "documented",
          -20,
        ),
        edge(
          "queue",
          "clean",
          text("Temizleme işi", "Cleaning work", "Задача очистки"),
          "documented",
          -30,
        ),
        edge(
          "clean",
          "queue",
          text("Temizlenmiş veri", "Cleaned data", "Очищенные данные"),
          "documented",
          -80,
        ),
        edge(
          "queue",
          "analyze",
          text("Analiz işi", "Analysis work", "Задача анализа"),
          "documented",
          -50,
        ),
        edge(
          "analyze",
          "queue",
          text("İşlenmiş sonuç", "Processed result", "Обработанный результат"),
          "documented",
          -30,
        ),
        edge(
          "queue",
          "core",
          text("Sonuç tüketimi", "Result consumption", "Получение результатов"),
          "documented",
          -75,
        ),
        edge(
          "core",
          "records",
          text(
            "Kalıcılık ve raporlama",
            "Persistence and reporting",
            "Хранение и отчётность",
          ),
          "documented",
          70,
        ),
      ],
    },
    otomark: {
      title: text(
        "Küçük bir sistemin çekirdek mantığı",
        "Core logic of a small system",
        "Основная логика небольшой системы",
      ),
      summary: text(
        "C++ masaüstü ekip projesinde tasarım, çekirdek mantık ve test katkısı.",
        "Design, core-logic, and testing contributions to a C++ desktop team project.",
        "Вклад в проектирование, основную логику и тестирование командного настольного проекта на C++.",
      ),
      nodes: [
        node(
          "input",
          text(
            "Operasyon ihtiyacı",
            "Operational need",
            "Потребность в управлении",
          ),
          text("OTOPARK", "PARKING", "ПАРКОВКА"),
          text(
            "Kampüs otopark yönetimi için uygulama ihtiyacı.",
            "Application needs for campus parking management.",
            "Потребности приложения для управления парковкой кампуса.",
          ),
          170,
          310,
        ),
        node(
          "desktop",
          text(
            "Masaüstü uygulaması",
            "Desktop application",
            "Настольное приложение",
          ),
          text("C++", "C++", "C++"),
          text(
            "Ekip olarak geliştirilen otopark yönetimi uygulaması.",
            "A parking-management application developed as a team.",
            "Приложение для управления парковкой, разработанное командой.",
          ),
          550,
          130,
        ),
        node(
          "logic",
          text("Çekirdek mantık", "Core logic", "Основная логика"),
          text("EKİP KATKISI", "TEAM CONTRIBUTION", "ВКЛАД В КОМАНДЕ"),
          text(
            "Sistem tasarımı ve çekirdek mantığın uygulanmasına katkı.",
            "Contribution to system design and core-logic implementation.",
            "Вклад в проектирование системы и реализацию основной логики.",
          ),
          910,
          320,
        ),
        node(
          "tests",
          text("Test katkısı", "Testing contribution", "Вклад в тестирование"),
          text("DOĞRULAMA", "VALIDATION", "ПРОВЕРКА"),
          text(
            "Ekip projesinde test çalışmalarına katkı.",
            "Contribution to testing in the team project.",
            "Участие в тестировании командного проекта.",
          ),
          550,
          530,
        ),
      ],
      edges: [
        edge(
          "input",
          "desktop",
          text(
            "Masaüstü iş akışı",
            "Desktop workflow",
            "Процессы настольного приложения",
          ),
          "conceptual",
          -60,
        ),
        edge(
          "desktop",
          "logic",
          text("Çekirdek işlemler", "Core operations", "Основные операции"),
          "conceptual",
          -60,
        ),
        edge(
          "logic",
          "tests",
          text("Mantığın doğrulanması", "Logic validation", "Проверка логики"),
          "conceptual",
          -30,
        ),
      ],
    },
  }

export const getArchitecture = (
  projectId: string,
): ArchitectureDiagram | null =>
  Object.prototype.hasOwnProperty.call(architectures, projectId)
    ? architectures[(projectId as ArchitectureProjectId)]
    : null
