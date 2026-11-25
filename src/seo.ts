import {
  profile,
  profileName,
  projects,
  otherProjects,
  type Locale,
} from "./content"

export type SeoOptions = {
  siteUrl?: string
  allowIndex?: boolean
  basePath?: string
}

export type PortfolioRoute = {
  locale: Locale
  projectSlug: string | null
  notFound: boolean
}

interface BuildVariables {
  VITE_SITE_URL?: string
  VITE_ALLOW_INDEX?: string
  BASE_URL?: string
}

const buildEnv = (import.meta as ImportMeta & { env?: BuildVariables }).env
const publicProjects = [...Object.values(projects), ...otherProjects]

function mountPath(value = "/") {
  try {
    const pathname = new URL(value, "http://local.invalid").pathname
    return `/${pathname.split("/").filter(Boolean).join("/")}${
      pathname === "/" ? "" : "/"
    }`
  } catch {
    return "/"
  }
}

export function parseRoute(
  pathname: string,
  basePath = buildEnv?.BASE_URL || "/",
): PortfolioRoute {
  let routePath = pathname.split(/[?#]/)[0] || "/"
  const base = mountPath(basePath)
  if (base !== "/" && routePath.startsWith(base))
    routePath = `/${routePath.slice(base.length)}`
  const parts = routePath.split("/").filter(Boolean)
  const locale: Locale =
    parts[0] === "en" || parts[0] === "ru" ? parts[0] : "tr"
  if (locale !== "tr") parts.shift()
  if (!parts.length) return { locale, projectSlug: null, notFound: false }
  if (parts.length === 2 && parts[0] === "projects") {
    let projectSlug = parts[1]
    try {
      projectSlug = decodeURIComponent(projectSlug)
    } catch {
      /* Invalid paths become 404s. */
    }
    const exists = publicProjects.some(
      (project) => project.slug === projectSlug,
    )
    return { locale, projectSlug, notFound: !exists }
  }
  return { locale, projectSlug: "__not-found__", notFound: true }
}

export function routePath(locale: Locale, projectSlug: string | null = null) {
  return `${locale === "tr" ? "" : `/${locale}`}${
    projectSlug ? `/projects/${encodeURIComponent(projectSlug)}` : ""
  }/`
}

export function configuredSiteUrl(value = buildEnv?.VITE_SITE_URL) {
  if (!value?.trim()) return null
  try {
    const url = new URL(value)
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/`
    return url.href
  } catch {
    return null
  }
}

export function getPageSeo(
  locale: Locale,
  projectSlug: string | null = null,
  options: SeoOptions = {},
) {
  const project = projectSlug
    ? publicProjects.find((item) => item.slug === projectSlug)
    : null
  const notFound = Boolean(projectSlug && !project)
  const name = profileName(locale)
  const localizedSeo = {
    tr: {
      notFound: "Sayfa bulunamadı",
      notFoundDescription:
        "Aradığınız sayfa bulunamadı. Portfolyoya ve projelere dönebilirsiniz.",
      description: `${name}: gerçek zamanlı uygulamalar, operasyon platformları, backend ve full-stack geliştirme üzerine mühendislik portfolyosu.`,
    },
    en: {
      notFound: "Page not found",
      notFoundDescription:
        "The requested page was not found. Return to the portfolio and projects.",
      description: `${name}: an engineering portfolio of real-time applications, operations platforms, backend and full-stack development.`,
    },
    ru: {
      notFound: "Страница не найдена",
      notFoundDescription:
        "Запрашиваемая страница не найдена. Вернитесь к портфолио и проектам.",
      description: `${name}: инженерное портфолио — приложения реального времени, платформы управления операциями, backend и full-stack разработка.`,
    },
  }[locale]
  const title = notFound
    ? `${localizedSeo.notFound} — ${name}`
    : project
      ? `${project.title[locale]} — ${name}`
      : `${name} — ${profile.role[locale]}`
  const description = notFound
    ? localizedSeo.notFoundDescription
    : project?.summary[locale] || localizedSeo.description
  const siteUrl = configuredSiteUrl(options.siteUrl)
  const allowIndex = options.allowIndex ?? buildEnv?.VITE_ALLOW_INDEX === "true"
  const canonical =
    siteUrl && !notFound
      ? new URL(routePath(locale, projectSlug).slice(1), siteUrl).href
      : null
  const alternateTr =
    siteUrl && !notFound
      ? new URL(routePath("tr", projectSlug).slice(1), siteUrl).href
      : null
  const alternateEn =
    siteUrl && !notFound
      ? new URL(routePath("en", projectSlug).slice(1), siteUrl).href
      : null
  const alternateRu =
    siteUrl && !notFound
      ? new URL(routePath("ru", projectSlug).slice(1), siteUrl).href
      : null
  const structuredData = notFound
    ? null
    : project
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          inLanguage: locale,
          ...(canonical ? { url: canonical } : {}),
          about: {
            "@type": "Thing",
            name: project.title[locale],
            description: project.summary[locale],
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: title,
          description,
          inLanguage: locale,
          ...(canonical ? { url: canonical } : {}),
          mainEntity: {
            "@type": "Person",
            name,
            jobTitle: profile.role[locale],
          },
        }
  return {
    locale,
    title,
    description,
    notFound,
    canonical,
    alternateTr,
    alternateEn,
    alternateRu,
    structuredData,
    robots:
      allowIndex && siteUrl && !notFound
        ? "index, follow"
        : "noindex, nofollow",
    image: siteUrl
      ? new URL("share-image.png", siteUrl).href
      : `${mountPath(options.basePath || buildEnv?.BASE_URL)}share-image.png`,
    icon: `${mountPath(options.basePath || buildEnv?.BASE_URL)}favicon.svg`,
  }
}

export type PageSeo = ReturnType<typeof getPageSeo>

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

interface SeoTag {
  tag: string
  attrs: Record<string, string>
  text?: string
}

function tagsForSeo(seo: PageSeo) {
  const tags: SeoTag[] = [
    { tag: "title", attrs: {}, text: seo.title },
    { tag: "meta", attrs: { name: "description", content: seo.description } },
    { tag: "meta", attrs: { name: "robots", content: seo.robots } },
    {
      tag: "link",
      attrs: { rel: "icon", type: "image/svg+xml", href: seo.icon },
    },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:title", content: seo.title } },
    {
      tag: "meta",
      attrs: { property: "og:description", content: seo.description },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:locale",
        content: { tr: "tr_TR", en: "en_US", ru: "ru_RU" }[seo.locale],
      },
    },
    {
      tag: "meta",
      attrs: { property: "og:site_name", content: profileName(seo.locale) },
    },
    { tag: "meta", attrs: { property: "og:image", content: seo.image } },
    { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
    {
      tag: "meta",
      attrs: {
        property: "og:image:alt",
        content: `${profileName(seo.locale)} — ${profile.role[seo.locale]}`,
      },
    },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { tag: "meta", attrs: { name: "twitter:title", content: seo.title } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: seo.description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: seo.image } },
    {
      tag: "meta",
      attrs: {
        name: "twitter:image:alt",
        content: `${profileName(seo.locale)} — ${profile.role[seo.locale]}`,
      },
    },
    { tag: "meta", attrs: { name: "theme-color", content: "#151714" } },
  ]
  if (seo.canonical)
    tags.push(
      { tag: "link", attrs: { rel: "canonical", href: seo.canonical } },
      { tag: "meta", attrs: { property: "og:url", content: seo.canonical } },
    )
  if (seo.alternateTr && seo.alternateEn && seo.alternateRu)
    tags.push(
      {
        tag: "link",
        attrs: { rel: "alternate", hreflang: "tr", href: seo.alternateTr },
      },
      {
        tag: "link",
        attrs: { rel: "alternate", hreflang: "en", href: seo.alternateEn },
      },
      {
        tag: "link",
        attrs: { rel: "alternate", hreflang: "ru", href: seo.alternateRu },
      },
      {
        tag: "link",
        attrs: {
          rel: "alternate",
          hreflang: "x-default",
          href: seo.alternateTr,
        },
      },
    )
  return tags
}

export function renderHead(seo: PageSeo) {
  const tags = tagsForSeo(seo).map(({ tag, attrs, text }) => {
    const attrText = Object.entries(attrs)
      .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
      .join("")
    return ["meta", "link"].includes(tag)
      ? `<${tag} data-portfolio-seo${attrText}>`
      : `<${tag} data-portfolio-seo${attrText}>${escapeHtml(text || "")}</${tag}>`
  })
  if (seo.structuredData)
    tags.push(
      `<script data-portfolio-seo type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, "\\u003c")}</script>`,
    )
  return tags.join("\n    ")
}

export function applyDocumentHead(
  locale: Locale,
  projectSlug: string | null = null,
  options: SeoOptions = {},
) {
  if (typeof document === "undefined") return
  const seo = getPageSeo(locale, projectSlug, options)
  document.documentElement.lang = locale
  document.head
    .querySelectorAll("[data-portfolio-seo]")
    .forEach((element) => element.remove())
  for (const { tag, attrs, text } of tagsForSeo(seo)) {
    const element = document.createElement(tag)
    element.setAttribute("data-portfolio-seo", "")
    Object.entries(attrs).forEach(([key, value]) =>
      element.setAttribute(key, value),
    )
    if (text) element.textContent = text
    document.head.append(element)
  }
  if (seo.structuredData) {
    const script = document.createElement("script")
    script.setAttribute("data-portfolio-seo", "")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(seo.structuredData)
    document.head.append(script)
  }
}

/** Replace the scaffold metadata once; prerender and dev SSR use the same shell. */
export function injectPage(template: string, html: string, seo: PageSeo) {
  return template
    .replace(/<html\s+lang="[^"]*"/i, `<html lang="${seo.locale}"`)
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(
      /<meta\b[^>]*(?:name="(?:description|robots|twitter:[^"]*|theme-color)"|property="og:[^"]*")[^>]*>/gi,
      "",
    )
    .replace(/<link\b[^>]*rel="(?:icon|canonical|alternate)"[^>]*>/gi, "")
    .replace(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
      "",
    )
    .replace("<!-- portfolio:head -->", renderHead(seo))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}
