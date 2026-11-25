import type { Localized } from "../content"

export interface ProjectMedia {
  readonly id: string
  readonly src: string
  readonly width: number
  readonly height: number
  readonly title: Localized
  readonly description: Localized
  readonly alt: Localized
}

const media: Readonly<Record<string, readonly ProjectMedia[]>> = {
  bridge: [
    {
      id: "dashboard",
      src: "/projects/bridge/dashboard.png",
      width: 1903,
      height: 985,
      title: {
        tr: "Çalışma alanı",
        en: "Workspace",
        ru: "Рабочее пространство",
      },
      description: {
        tr: "Anlık toplantı, planlama ve bağlantıyla katılma.",
        en: "Instant meetings, scheduling, and joining by link.",
        ru: "Быстрый запуск встреч, планирование и подключение по ссылке.",
      },
      alt: {
        tr: "Bridge ana ekranı: hızlı toplantı işlemleri, toplantı geçmişi ve kişiler.",
        en: "Bridge dashboard with meeting shortcuts, recent meetings, and contacts.",
        ru: "Главный экран Bridge с быстрым запуском встреч, недавними встречами и контактами.",
      },
    },
    {
      id: "lobby",
      src: "/projects/bridge/lobby.png",
      width: 723,
      height: 730,
      title: {
        tr: "Toplantıya hazırlık",
        en: "Before the meeting",
        ru: "Перед встречей",
      },
      description: {
        tr: "Katılmadan önce mikrofon ve kamera seçimi.",
        en: "Microphone and camera selection before joining.",
        ru: "Выбор микрофона и камеры перед подключением.",
      },
      alt: {
        tr: "Bridge toplantı öncesi ekranı: kamera önizlemesi ve ses/görüntü cihazı seçimi.",
        en: "Bridge pre-meeting screen with camera preview and audio/video device selection.",
        ru: "Экран подготовки к встрече в Bridge с предпросмотром камеры и выбором аудио- и видеоустройств.",
      },
    },
    {
      id: "meeting",
      src: "/projects/bridge/meeting.png",
      width: 1917,
      height: 988,
      title: {
        tr: "Canlı görüşme",
        en: "Live meeting",
        ru: "Встреча в реальном времени",
      },
      description: {
        tr: "Katılımcı alanı ve görüşme kontrolleri.",
        en: "Participant view and meeting controls.",
        ru: "Область участников и элементы управления встречей.",
      },
      alt: {
        tr: "Bridge canlı görüşme ekranı: katılımcı alanı, mikrofon, kamera, paylaşım ve sohbet kontrolleri.",
        en: "Bridge live meeting with participant view, microphone, camera, sharing, and chat controls.",
        ru: "Экран встречи Bridge с областью участников и управлением микрофоном, камерой, демонстрацией экрана и чатом.",
      },
    },
    {
      id: "screenshare",
      src: "/projects/bridge/screenshare.png",
      width: 1907,
      height: 927,
      title: {
        tr: "Ekran paylaşımı",
        en: "Screen sharing",
        ru: "Демонстрация экрана",
      },
      description: {
        tr: "Paylaşılan ekran, araçlar ve katılımcı görünümü.",
        en: "Shared screen, tools, and participant view.",
        ru: "Демонстрация экрана, инструменты и область участника.",
      },
      alt: {
        tr: "Bridge ekran paylaşımı: paylaşılan portfolyo, katılımcı kutusu ve toplantı araç çubuğu.",
        en: "Bridge screen sharing with a shared portfolio, participant tile, and meeting toolbar.",
        ru: "Демонстрация экрана в Bridge: открытое портфолио, окно участника и панель управления встречей.",
      },
    },
    {
      id: "admin",
      src: "/projects/bridge/admin.png",
      width: 1887,
      height: 978,
      title: {
        tr: "Kullanıcı yönetimi",
        en: "User management",
        ru: "Управление пользователями",
      },
      description: {
        tr: "Kullanıcı arama, çevrimiçi durum ve son giriş bilgileri.",
        en: "User search, online status, and last sign-in information.",
        ru: "Поиск пользователей, статус присутствия и сведения о последнем входе.",
      },
      alt: {
        tr: "Bridge yönetim paneli: kullanıcı arama, hesap listesi ve çevrimiçi durumlar.",
        en: "Bridge administration panel with user search, account list, and online status.",
        ru: "Панель управления Bridge с поиском пользователей, списком учётных записей и статусами присутствия.",
      },
    },
  ],
  badhabinot: [
    {
      id: "dashboard",
      src: "/projects/badhabinot/dashboard.png",
      width: 1900,
      height: 986,
      title: {
        tr: "Canlı izleme",
        en: "Live monitoring",
        ru: "Мониторинг в реальном времени",
      },
      description: {
        tr: "Kamera önizlemesi, oturum kontrolleri ve canlı analiz paneli.",
        en: "Camera preview, session controls, and a live analysis panel.",
        ru: "Предпросмотр камеры, управление сеансом и панель анализа в реальном времени.",
      },
      alt: {
        tr: "Badhabinot canlı izleme ekranı: kamera karesi üzerinde poz işaretleri, izleme kontrolleri ve analiz kartları.",
        en: "Badhabinot live monitoring screen with pose landmarks over a camera frame, monitoring controls, and analysis cards.",
        ru: "Экран мониторинга Badhabinot с ключевыми точками позы поверх кадра камеры, управлением мониторингом и карточками анализа.",
      },
    },
    {
      id: "enrollment",
      src: "/projects/badhabinot/enrollment.png",
      width: 1906,
      height: 979,
      title: { tr: "Yüz kaydı", en: "Face enrollment", ru: "Регистрация лица" },
      description: {
        tr: "Kamera önizlemesi ve kare yakalama ilerlemesi.",
        en: "Camera preview and frame-capture progress.",
        ru: "Предпросмотр камеры и ход захвата кадров.",
      },
      alt: {
        tr: "Badhabinot yüz kaydı penceresi: kamera önizlemesi, kare yakalama ilerlemesi ve kameraya bakma yönergesi.",
        en: "Badhabinot face-enrollment dialog with camera preview, frame-capture progress, and an instruction to face the camera.",
        ru: "Окно регистрации лица в Badhabinot с предпросмотром камеры, ходом захвата кадров и указанием смотреть в камеру.",
      },
    },
    {
      id: "reports",
      src: "/projects/badhabinot/reports.png",
      width: 1896,
      height: 986,
      title: { tr: "Günlük rapor", en: "Daily report", ru: "Ежедневный отчёт" },
      description: {
        tr: "Tarihe göre günlük özet, hatırlatıcılar ve olay kayıtları.",
        en: "Daily summary, reminders, and event records by date.",
        ru: "Сводка за день, напоминания и записи событий по датам.",
      },
      alt: {
        tr: "Badhabinot rapor ekranı: tarih seçimi, analiz ve hatırlatıcı göstergeleri, günlük özet ve olay listesi.",
        en: "Badhabinot reports screen with date selection, analysis and reminder indicators, a daily summary, and an event list.",
        ru: "Экран отчётов Badhabinot с выбором даты, индикаторами анализа и напоминаний, сводкой за день и списком событий.",
      },
    },
    {
      id: "chat",
      src: "/projects/badhabinot/chat.png",
      width: 1919,
      height: 971,
      title: {
        tr: "Veriye dayalı sohbet",
        en: "Data-grounded chat",
        ru: "Чат на основе данных",
      },
      description: {
        tr: "Sohbet akışı, yanıt bağlamı ve önerilen sorular.",
        en: "Conversation flow, response context, and suggested questions.",
        ru: "История диалога, контекст ответа и предлагаемые вопросы.",
      },
      alt: {
        tr: "Badhabinot sohbet ekranı: mesaj akışı, soru girişi, veri bağlamı ve önerilen sorular.",
        en: "Badhabinot chat screen with a message thread, question input, data context, and suggested questions.",
        ru: "Экран чата Badhabinot с перепиской, полем вопроса, контекстом данных и предлагаемыми вопросами.",
      },
    },
    {
      id: "admin",
      src: "/projects/badhabinot/admin.png",
      width: 1898,
      height: 981,
      title: {
        tr: "Kullanıcı ve AI ayarları",
        en: "User and AI settings",
        ru: "Настройки пользователей и ИИ",
      },
      description: {
        tr: "Kullanıcı kayıtları, hesap bilgileri ve yerel model yapılandırması.",
        en: "User records, account information, and local-model configuration.",
        ru: "Записи пользователей, сведения об учётных записях и настройка локальной модели.",
      },
      alt: {
        tr: "Badhabinot yönetim ekranı: kullanıcı listesi, hesap ayarları ve yerel Ollama modeli için yapılandırma alanları.",
        en: "Badhabinot administration screen with a user list, account settings, and configuration fields for a local Ollama model.",
        ru: "Экран управления Badhabinot со списком пользователей, настройками учётных записей и полями конфигурации локальной модели Ollama.",
      },
    },
    {
      id: "coverage",
      src: "/projects/badhabinot/coverage.png",
      width: 1256,
      height: 597,
      title: {
        tr: "Backend test kapsamı",
        en: "Backend test coverage",
        ru: "Покрытие тестами бэкенда",
      },
      description: {
        tr: "Paketlere göre instruction ve branch kapsamını gösteren rapor.",
        en: "A report of instruction and branch coverage by package.",
        ru: "Отчёт о покрытии инструкций и ветвей по пакетам.",
      },
      alt: {
        tr: "Badhabinot backend test kapsam raporu: paketler, instruction ve branch kapsamı ile satır, metot ve sınıf sütunları.",
        en: "Badhabinot backend coverage report with packages, instruction and branch coverage, and line, method, and class columns.",
        ru: "Отчёт о покрытии тестами бэкенда Badhabinot: пакеты, покрытие инструкций и ветвей, а также столбцы строк, методов и классов.",
      },
    },
  ],
}

const emptyMedia: readonly ProjectMedia[] = []
export const getProjectMedia = (projectId: string) =>
  media[projectId] || emptyMedia
export const projectMediaSrc = (src: string) =>
  import.meta.env.BASE_URL.replace(/\/$/, "") + src
