import { renderToString } from "react-dom/server"
import App from "./App"
import { projects, otherProjects, type Locale } from "./content"
import {
  getPageSeo,
  injectPage,
  parseRoute,
  routePath,
  type SeoOptions,
} from "./seo"

export function renderPage(pathname: string, options: SeoOptions = {}) {
  const route = parseRoute(pathname, options.basePath)
  const seo = getPageSeo(route.locale, route.projectSlug, options)
  const html = renderToString(
    <App
      initialLocale={route.locale}
      initialProjectSlug={route.projectSlug}
      staticRender
    />,
  )
  return { html, seo, locale: route.locale, status: route.notFound ? 404 : 200 }
}

export function allRoutes() {
  const slugs = [...Object.values(projects), ...otherProjects].map(
    (project) => project.slug,
  )
  const locales: Locale[] = ["tr", "en", "ru"]
  return [
    ...locales.map((locale) => routePath(locale)),
    ...slugs.flatMap((slug) =>
      locales.map((locale) => routePath(locale, slug)),
    ),
  ]
}

export { injectPage }
