// Usage: node scripts/verify-hosting.mjs [origin] [canonical-origin]
// Example: node scripts/verify-hosting.mjs http://127.0.0.1:8080 https://sshakho.com
// This checks the served production site without reading local credentials.
const failures = []
const assets = new Map()
let requests = 0

function check(condition, path, requirement, actual) {
  if (!condition)
    failures.push({
      path,
      requirement,
      ...(actual === undefined ? {} : { actual }),
    })
}

function originArgument(value) {
  const url = new URL(value)
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "Arguments must be HTTP(S) origins without credentials or paths",
    )
  return url.origin
}

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(
    ([tag]) => {
      const attributes = {}
      for (const match of tag.matchAll(
        /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g,
      ))
        attributes[match[1].toLowerCase()] = decode(
          match[2] ?? match[3] ?? match[4],
        )
      return attributes
    },
  )
}

function pageMetadata(html) {
  const links = tags(html, "link")
  const meta = tags(html, "meta")
  return {
    language: tags(html, "html")[0]?.lang,
    canonicals: links.filter((tag) => tag.rel === "canonical"),
    robots: meta.find((tag) => tag.name === "robots")?.content,
    scripts: tags(html, "script").filter((tag) => tag.src),
    styles: links.filter((tag) => tag.rel === "stylesheet" && tag.href),
  }
}

function robotsTokens(value = "") {
  return value
    .toLowerCase()
    .split(",")
    .map((token) => token.trim())
    .sort()
    .join(",")
}

function languageFor(path) {
  return /^\/(en|ru)(?:\/|$)/.exec(path)?.[1] || "tr"
}

async function inBatches(items, action) {
  for (let index = 0; index < items.length; index += 6)
    await Promise.all(items.slice(index, index + 6).map(action))
}

async function main() {
  const origin = originArgument(process.argv[2] || "https://sshakho.com")
  const canonicalOrigin = originArgument(
    process.argv[3] || "https://sshakho.com",
  )

  async function get(path, accept = "text/html") {
    requests += 1
    try {
      const response = await fetch(new URL(path, `${origin}/`), {
        redirect: "manual",
        signal: AbortSignal.timeout(15_000),
        headers: { Accept: accept },
      })
      return { response, body: await response.text() }
    } catch (error) {
      check(false, path, "HTTP request completes", error.name)
      return null
    }
  }

  const manifest = await get("/prerender-routes.json", "application/json")
  let routes = []
  if (manifest) {
    check(
      manifest.response.status === 200,
      "/prerender-routes.json",
      "HTTP 200",
      manifest.response.status,
    )
    try {
      const discovered = JSON.parse(manifest.body)
      const valid =
        Array.isArray(discovered) &&
        discovered.length > 0 &&
        discovered.length <= 1000 &&
        discovered.every(
          (route) =>
            typeof route === "string" && /^\/(?:[a-z\d-]+\/)*$/.test(route),
        ) &&
        new Set(discovered).size === discovered.length
      check(
        valid,
        "/prerender-routes.json",
        "Unique absolute route paths ending with /",
      )
      if (valid) routes = discovered
    } catch {
      check(false, "/prerender-routes.json", "Valid route JSON")
    }
  }
  for (const home of ["/", "/en/", "/ru/"])
    check(routes.includes(home), "/prerender-routes.json", `Contains ${home}`)

  await inBatches(routes, async (path) => {
    const result = await get(path)
    if (!result) return
    const { response, body } = result
    const page = pageMetadata(body)
    check(response.status === 200, path, "HTTP 200", response.status)
    check(
      response.headers.get("content-type")?.includes("text/html"),
      path,
      "HTML content type",
    )
    check(
      page.language === languageFor(path),
      path,
      "Localized HTML language",
      page.language,
    )
    check(
      page.canonicals.length === 1 &&
        page.canonicals[0].href === `${canonicalOrigin}${path}`,
      path,
      "Canonical URL matches the public domain and route",
    )
    check(
      robotsTokens(page.robots) === "follow,index",
      path,
      "Indexable robots metadata",
      page.robots,
    )
    check(
      !/\bnoindex\b/i.test(response.headers.get("x-robots-tag") || ""),
      path,
      "No noindex HTTP header",
    )
    check(
      page.scripts.length > 0 && page.styles.length > 0,
      path,
      "Includes JavaScript and CSS assets",
    )
    for (const [value, type] of [
      ...page.scripts.map((tag) => [tag.src, "js"]),
      ...page.styles.map((tag) => [tag.href, "css"]),
    ]) {
      const assetUrl = new URL(value, `${origin}${path}`)
      const isLocal =
        assetUrl.origin === origin && assetUrl.pathname.startsWith("/assets/")
      check(isLocal, path, "Build assets are served locally from /assets/")
      if (isLocal) assets.set(`${assetUrl.pathname}${assetUrl.search}`, type)
    }
  })

  await inBatches([...assets], async ([path, type]) => {
    const result = await get(path, "*/*")
    if (!result) return
    check(
      result.response.status === 200,
      path,
      "HTTP 200 asset",
      result.response.status,
    )
    const contentType = result.response.headers.get("content-type") || ""
    check(
      type === "js"
        ? /(?:javascript|ecmascript)/i.test(contentType)
        : /text\/css/i.test(contentType),
      path,
      `Correct ${type.toUpperCase()} content type`,
    )
    check(
      result.body.trim().length > 0 && !/^\s*<!doctype html/i.test(result.body),
      path,
      "Non-empty asset rather than HTML fallback",
    )
  })

  const redirect = await get("/en")
  if (redirect) {
    check(
      [301, 308].includes(redirect.response.status),
      "/en",
      "Permanent trailing-slash redirect",
      redirect.response.status,
    )
    check(
      redirect.response.headers.get("location") === "/en/",
      "/en",
      "Relative redirect Location /en/",
    )
  }

  const missingRoutes = [
    "/__hosting-smoke-missing__/",
    "/en/__hosting-smoke-missing__/",
    "/ru/__hosting-smoke-missing__/",
  ]
  await inBatches(missingRoutes, async (path) => {
    const result = await get(path)
    if (!result) return
    const page = pageMetadata(result.body)
    check(
      result.response.status === 404,
      path,
      "HTTP 404",
      result.response.status,
    )
    check(
      result.response.headers.get("content-type")?.includes("text/html"),
      path,
      "HTML error page",
    )
    check(
      page.language === languageFor(path),
      path,
      "Localized 404 language",
      page.language,
    )
    check(
      robotsTokens(page.robots) === "nofollow,noindex",
      path,
      "Non-indexable 404 metadata",
      page.robots,
    )
    check(page.canonicals.length === 0, path, "404 has no canonical URL")
  })

  const hiddenPaths = [
    "/src/App.tsx",
    "/src/main.tsx",
    "/.env",
    "/.env.production",
    "/.secrets/",
    "/.secrets/cloudflared-token",
    "/.git/config",
  ]
  await inBatches(hiddenPaths, async (path) => {
    const result = await get(path, "*/*")
    if (result)
      check(
        [403, 404].includes(result.response.status),
        path,
        "Source and private files are unavailable",
        result.response.status,
      )
  })

  const sitemap = await get("/sitemap.xml", "application/xml")
  if (sitemap) {
    check(
      sitemap.response.status === 200,
      "/sitemap.xml",
      "HTTP 200 sitemap",
      sitemap.response.status,
    )
    const locations = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => decode(match[1]),
    )
    const expected = routes.map((route) => `${canonicalOrigin}${route}`)
    check(
      locations.length === expected.length &&
        new Set(locations).size === expected.length &&
        expected.every((url) => locations.includes(url)),
      "/sitemap.xml",
      "Every served route appears once on the public domain",
    )
    const alternates = [...sitemap.body.matchAll(/\bhref="([^"]+)"/g)].map(
      (match) => decode(match[1]),
    )
    check(
      alternates.length > 0 &&
        alternates.every((url) => expected.includes(url)),
      "/sitemap.xml",
      "Alternate language URLs use canonical routes",
    )
  }

  const robots = await get("/robots.txt", "text/plain")
  if (robots) {
    check(
      robots.response.status === 200,
      "/robots.txt",
      "HTTP 200 robots",
      robots.response.status,
    )
    check(
      /^Allow:\s*\/\s*$/m.test(robots.body) &&
        !/^Disallow:\s*\/\s*$/m.test(robots.body),
      "/robots.txt",
      "Public indexing allowed",
    )
    const sitemaps = [...robots.body.matchAll(/^Sitemap:\s*(\S+)\s*$/gm)].map(
      (match) => match[1],
    )
    check(
      sitemaps.length === 1 && sitemaps[0] === `${canonicalOrigin}/sitemap.xml`,
      "/robots.txt",
      "Sitemap references the public canonical domain",
    )
  }

  return {
    passed: failures.length === 0,
    origin,
    canonicalOrigin,
    routes: routes.length,
    languages: ["tr", "en", "ru"],
    assets: assets.size,
    localized404s: missingRoutes.length,
    hiddenPaths: hiddenPaths.length,
    requests,
    failures,
  }
}

try {
  const result = await main()
  console.log(JSON.stringify(result))
  process.exitCode = result.passed ? 0 : 1
} catch (error) {
  console.log(JSON.stringify({ passed: false, error: error.name, failures }))
  process.exitCode = 1
}
