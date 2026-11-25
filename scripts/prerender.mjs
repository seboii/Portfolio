import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const { renderPage, allRoutes, injectPage } = await import(
  pathToFileURL(path.join(root, ".prerender", "entry-server.js")).href
)
const template = await readFile(path.join(dist, "index.html"), "utf8")
const routes = allRoutes()

for (const route of routes) {
  const page = renderPage(route)
  if (page.status !== 200)
    throw new Error(`Cannot prerender a non-existent route: ${route}`)
  const directory = path.join(dist, route.replace(/^\/+|\/+$/g, ""))
  await mkdir(directory, { recursive: true })
  await writeFile(
    path.join(directory, "index.html"),
    injectPage(template, page.html, page.seo),
    "utf8",
  )
}

for (const locale of ["tr", "en", "ru"]) {
  const prefix = locale === "tr" ? "" : locale
  const notFound = renderPage(
    `/${prefix ? `${prefix}/` : ""}projects/__not-found__/`,
  )
  await writeFile(
    path.join(dist, prefix, "404.html"),
    injectPage(template, notFound.html, notFound.seo),
    "utf8",
  )
}
const home = renderPage("/")
const indexingAllowed = home.seo.robots === "index, follow"

if (indexingAllowed && home.seo.canonical) {
  const xmlEscape = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll('"', "&quot;")
  const entries = routes.map((route) => {
    const { seo } = renderPage(route)
    return `  <url><loc>${xmlEscape(seo.canonical)}</loc><xhtml:link rel="alternate" hreflang="tr" href="${xmlEscape(seo.alternateTr)}"/><xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(seo.alternateEn)}"/><xhtml:link rel="alternate" hreflang="ru" href="${xmlEscape(seo.alternateRu)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(seo.alternateTr)}"/></url>`
  })
  await writeFile(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`,
  )
  const sitemapUrl = new URL("sitemap.xml", home.seo.canonical).href
  await writeFile(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`,
  )
} else {
  await writeFile(path.join(dist, "robots.txt"), "User-agent: *\nDisallow: /\n")
}

await writeFile(
  path.join(dist, "prerender-routes.json"),
  `${JSON.stringify(routes, null, 2)}\n`,
)
console.log(
  `Prerendered ${routes.length} routes in three languages and three localized 404 pages. Indexing: ${
    indexingAllowed ? "enabled" : "disabled"
  }.`,
)
