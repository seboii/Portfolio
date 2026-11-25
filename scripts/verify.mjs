import assert from "node:assert/strict"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

// Checks the deliverable HTML and client assets, not only their source inputs.
// Build first. No browser, test service, or extra package is required.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const basePath = new URL(
  process.env.FIGMA_PUBLIC_URL || "/",
  "http://verification.invalid",
).pathname.replace(/\/+$/, "")
const { renderPage, allRoutes } = await import(
  pathToFileURL(path.join(root, ".prerender", "entry-server.js")).href
)
let assertions = 0
const check = (condition, message) => {
  assert.ok(condition, message)
  assertions += 1
}
const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
const locales = ["tr", "en", "ru"]
const localePrefix = (locale) => (locale === "tr" ? "" : `/${locale}`)
const localeForRoute = (route) => route.match(/^\/(en|ru)(?:\/|$)/)?.[1] || "tr"
const displayName = (locale) =>
  locale === "tr" ? "Şehabettin Şamşiev" : "Shakhobiddin Shamshiev"
const textOf = (html) =>
  decode(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " "),
  ).trim()
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1],
      decode(match[2]),
    ]),
  )
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) =>
    attributes(match[0]),
  )
const blocks = (html, name) =>
  [
    ...html.matchAll(
      new RegExp(`<${name}\\b([^>]*)>([\\s\\S]*?)<\\/${name}>`, "gi"),
    ),
  ].map((match) => ({
    attributes: attributes(match[1]),
    body: match[2],
    html: match[0],
  }))
const hasClass = (tag, name) => (tag.class || "").split(/\s+/).includes(name)
// The new homepage nests containers; locate their complete contents for checks.
const containerWithClass = (html, className) => {
  for (const name of ["section", "div", "article", "aside", "nav"]) {
    const stack = []
    for (const match of html.matchAll(
      new RegExp(`<\\/?${name}\\b[^>]*>`, "gi"),
    )) {
      if (!match[0].startsWith("</"))
        stack.push({
          attributes: attributes(match[0]),
          start: match.index + match[0].length,
        })
      else {
        const open = stack.pop()
        if (open && hasClass(open.attributes, className))
          return {
            attributes: open.attributes,
            body: html.slice(open.start, match.index),
          }
      }
    }
  }
  return null
}
// SVG groups nest; the flat block helper deliberately stops at the first close.
const groupBlocks = (html) => {
  const stack = []
  const groups = []
  for (const match of html.matchAll(/<\/?g\b[^>]*>/gi)) {
    if (!match[0].startsWith("</"))
      stack.push({
        attributes: attributes(match[0]),
        start: match.index + match[0].length,
      })
    else {
      const open = stack.pop()
      if (open)
        groups.push({
          attributes: open.attributes,
          body: html.slice(open.start, match.index),
        })
    }
  }
  return groups
}
const poseDiagrams = (html) =>
  blocks(html, "svg").filter((svg) =>
    tags(svg.body, "g").some((group) => hasClass(group, "pose-keypoint")),
  )
const ambientDiagrams = (html) =>
  blocks(html, "svg").filter(
    (svg) => svg.attributes["data-ambient-scene"] !== undefined,
  )
const projectMediaFiles = Object.fromEntries(
  Object.entries({
    bridge: ["dashboard", "lobby", "meeting", "screenshare", "admin"],
    badhabinot: [
      "dashboard",
      "enrollment",
      "reports",
      "chat",
      "admin",
      "coverage",
    ],
  }).map(([projectId, names]) => [
    projectId,
    names.map((name) => `/projects/${projectId}/${name}.png`),
  ]),
)
const projectGalleries = (html) => {
  const stack = []
  const galleries = []
  for (const match of html.matchAll(/<\/?div\b[^>]*>/gi)) {
    if (!match[0].startsWith("</"))
      stack.push({
        attributes: attributes(match[0]),
        start: match.index + match[0].length,
      })
    else {
      const open = stack.pop()
      if (open?.attributes["data-project-gallery"])
        galleries.push({
          attributes: open.attributes,
          body: html.slice(open.start, match.index),
        })
    }
  }
  return galleries
}
const checkProjectGallery = (gallery, route, locale, projectId) => {
  const sources = projectMediaFiles[projectId].map((src) => basePath + src)
  const name = projectId === "bridge" ? "Bridge" : "Badhabinot"
  check(
    ["region", "group"].includes(gallery.attributes.role) &&
      Boolean(
        gallery.attributes["aria-label"]?.trim() ||
          gallery.attributes["aria-labelledby"]?.trim(),
      ),
    `${route}: the ${name} gallery must have a meaningful accessible name`,
  )
  const controls = blocks(gallery.body, "button")
  const thumbnails = controls.filter(
    (control) => control.attributes["data-gallery-thumbnail"] !== undefined,
  )
  const images = tags(gallery.body, "img")
  check(
    images.every((image) => sources.includes(image.src)) &&
      sources.every((src) => images.some((image) => image.src === src)),
    `${route}: the ${name} gallery must use all ${sources.length} supplied screenshot sources`,
  )
  const selected = (control) =>
    control.attributes["aria-pressed"] === "true" ||
    control.attributes["aria-current"] === "true"
  check(
    thumbnails.length === sources.length &&
      thumbnails.every(
        (control) =>
          control.attributes.type === "button" &&
          tags(control.body, "img").length === 1 &&
          tags(control.body, "img")[0].src ===
            `${basePath}/projects/${projectId}/${control.attributes["data-gallery-thumbnail"]}.png` &&
          Boolean(
            control.attributes["aria-label"]?.trim() || textOf(control.body),
          ),
      ) &&
      new Set(thumbnails.map((control) => tags(control.body, "img")[0].src))
        .size === sources.length &&
      thumbnails.filter(selected).length === 1,
    `${route}: ${sources.length} named native thumbnail buttons must identify the selected ${name} screen`,
  )
  const stage = containerWithClass(gallery.body, "project-gallery-stage")
  const capture = containerWithClass(
    stage?.body || "",
    "project-gallery-capture",
  )
  const activeImages = tags(stage?.body || "", "img")
  check(
    activeImages.length === 1 &&
      hasClass(activeImages[0], "project-gallery-screen") &&
      activeImages[0].alt?.trim().length > 8 &&
      activeImages[0]["aria-hidden"] !== "true" &&
      gallery.attributes["data-gallery-current"] ===
        thumbnails.find(selected)?.attributes["data-gallery-thumbnail"] &&
      activeImages[0].src ===
        tags(thumbnails.find(selected)?.body || "", "img")[0]?.src,
    `${route}: the gallery stage must describe and display the actual screenshot selected by its thumbnail`,
  )
  check(
    tags(capture?.body || "", "img").some(
      (image) => image.src === activeImages[0].src,
    ) &&
      Math.abs(
        Number(
          capture.attributes.style?.match(/--capture-ratio:\s*([\d.]+)/)?.[1],
        ) -
          Number(activeImages[0].width) / Number(activeImages[0].height),
      ) < 0.000001 &&
      Number(
        gallery.attributes.style?.match(/--gallery-count:\s*(\d+)/)?.[1],
      ) === sources.length,
    `${route}: the gallery capture must preserve the screenshot aspect ratio and actual screen count`,
  )
  if (projectId === "badhabinot")
    check(
      tags(capture.body, "div").some(
        (overlay) =>
          hasClass(overlay, "badhabinot-camera-motion") &&
          overlay["data-camera-motion"] ===
            gallery.attributes["data-gallery-current"] &&
          overlay["aria-hidden"] === "true",
      ),
      `${route}: the initial Badhabinot camera treatment must remain decorative inside the real capture`,
    )
  for (const [action, label] of {
    tr: [
      ["previous", /Önceki/i],
      ["next", /Sonraki/i],
    ],
    en: [
      ["previous", /Previous/i],
      ["next", /Next/i],
    ],
    ru: [
      ["previous", /Предыдущ/i],
      ["next", /Следующ/i],
    ],
  }[locale]) {
    const actionControls = controls.filter(
      (control) => control.attributes["data-gallery-control"] === action,
    )
    check(
      actionControls.length === 1 &&
        actionControls[0].attributes.type === "button" &&
        label.test(actionControls[0].attributes["aria-label"] || ""),
      `${route}: the screenshot gallery needs named native previous and next controls`,
    )
  }
  const autoplayControls = controls.filter(
    (control) => control.attributes["data-gallery-control"] === "autoplay",
  )
  if (gallery.attributes["data-gallery-scroll"] === "true")
    check(
      autoplayControls.length === 0 &&
        gallery.attributes["data-autoplay"] === "false",
      `${route}: scrolling must drive the full gallery without a competing slideshow timer`,
    )
  else
    check(
      autoplayControls.length === 1 &&
        autoplayControls[0].attributes.type === "button" &&
        Boolean(autoplayControls[0].attributes["aria-label"]?.trim()) &&
        ["true", "false"].includes(
          autoplayControls[0].attributes["aria-pressed"],
        ),
      `${route}: slideshow motion must have a named native pause or play control`,
    )
  if (gallery.attributes["data-gallery-variant"] === "full") {
    const lightboxes = blocks(gallery.body, "dialog")
    check(
      lightboxes.length === 1 &&
        !Object.hasOwn(lightboxes[0].attributes, "open") &&
        Boolean(lightboxes[0].attributes["aria-label"]?.trim()) &&
        tags(lightboxes[0].body, "img").some(
          (image) =>
            image.src === activeImages[0].src && image.alt?.trim().length > 8,
        ),
      `${route}: enlargement must use a named, initially closed native dialog with the real screenshot`,
    )
  }
}
const ambientTargetsInPlannedNodes = (html) => {
  const ancestors = []
  let count = 0
  for (const match of html.matchAll(/<\/?[a-z][\w:-]*\b[^>]*>/gi)) {
    if (match[0].startsWith("</")) {
      ancestors.pop()
      continue
    }
    const tag = attributes(match[0])
    const planned = ancestors.some(Boolean) || hasClass(tag, "scoped-node")
    if (
      planned &&
      (tag["data-ambient-path"] !== undefined ||
        tag["data-ambient-packet"] !== undefined ||
        hasClass(tag, "ambient-pulse"))
    )
      count += 1
    if (!match[0].endsWith("/>")) ancestors.push(planned)
  }
  return count
}
const removedCaptionPhrases = [
  "SEÇİLİ ÇALIŞMALAR — 2026",
  "SELECTED WORK — 2026",
  "SS / ENGINEERING IN MOTION",
  "06 BAĞLANTI / TEK YAKLAŞIM",
  "06 CONNECTIONS / ONE APPROACH",
  "BİR BAĞLANTI, BİR OLASILIK.",
  "ONE CONNECTION, NEW POSSIBILITIES.",
  "Bir sineğe yaklaş.",
  "Bir sineğe dokun.",
  "Hover over a fly.",
  "Tap a fly.",
  "İsmini keşfet. Tıkla, içine gir.",
  "Reveal its name. Click to explore.",
  "AĞDA BİR HİKÂYE YAKALA.",
  "CATCH A STORY IN THE WEB.",
  "FİKİRDEN ÜRÜNE",
  "FROM IDEA TO PRODUCT",
  "Her biri farklı bir ihtiyaca odaklanan ürünler.",
  "Products built around different needs.",
  "Kavramsal görselleştirme",
  "Conceptual visualization",
  "Sentetik akış",
  "Synthetic flow",
  "TEMSİLİ BİLDİRİM · SENTETİK VERİ",
  "ILLUSTRATIVE EVENT · SYNTHETIC DATA",
  "Kaynağa dayalı mimari özeti",
  "Source-backed architecture summary",
  "Kaynağa dayalı bileşen özeti; bağlantılar basitleştirilmiş.",
  "Source-based component summary; connections are simplified.",
  "Mimari yorum · görselleştirme bir ürün ekranı değildir",
  "Architectural interpretation · this is not a product screenshot",
  "MİMARİ YORUM · TAMAMLANMIŞ ÜRÜN AKIŞI DEĞİLDİR",
  "ARCHITECTURAL INTERPRETATION · NOT A COMPLETED PRODUCT FLOW",
  "Yaklaşım diyagramı · tek bir projenin birebir mimarisi değildir",
  "Approach diagram · not the exact architecture of any one project",
  "Araştırma bağlamı · kişisel başarı ölçümü değildir",
  "Research context · not a personal achievement metric",
]
const checkCaptionCleanup = (html, route) => {
  const normalizeCase = (value) => value.toLowerCase().replaceAll("\u0307", "")
  const visible = normalizeCase(textOf(html))
  const leftover = removedCaptionPhrases.find((phrase) =>
    visible.includes(normalizeCase(phrase)),
  )
  check(
    !leftover,
    `${route}: removed presentation boilerplate remains visible: ${leftover}`,
  )
}
const checkMotionPreferenceOutput = (html, route) => {
  check(
    tags(html, "html").every((tag) => tag["data-motion"] !== "full"),
    `${route}: the static shell cannot force full motion over the visitor's reduced-motion preference`,
  )
}
const checkWebCreature = (svg, kind, label) => {
  check(
    svg?.attributes["data-web-creature"] === kind &&
      svg.attributes["aria-hidden"] === "true" &&
      svg.attributes.focusable === "false" &&
      hasClass(svg.attributes, "web-creature") &&
      tags(svg.body, "image").length === 0,
    `${label}: the ${kind} must be an original decorative SVG creature`,
  )
  const groups = groupBlocks(svg.body)
  const legs = groups.filter((item) =>
    hasClass(item.attributes, `web-${kind}-leg`),
  )
  const legGeometry = legs.map((item) => tags(item.body, "path")[0]?.d || "")
  check(
    legs.length === (kind === "spider" ? 8 : 6) &&
      new Set(legGeometry).size === legs.length &&
      legGeometry.every(
        (geometry) =>
          /^M/.test(geometry) && (geometry.match(/L/g) || []).length >= 3,
      ) &&
      groups.some(
        (item) =>
          hasClass(item.attributes, `web-${kind}-body`) &&
          tags(item.body, "ellipse").length >= 2,
      ),
    `${label}: the ${kind} needs its own segmented body and ${
      kind === "spider" ? "eight" : "six"
    } distinct articulated legs`,
  )
  if (kind === "fly") {
    const wings = groups.filter((item) =>
      hasClass(item.attributes, "web-fly-wing"),
    )
    check(
      wings.length === 2 &&
        ["left", "right"].every((side) =>
          wings.some((item) =>
            hasClass(item.attributes, `web-fly-wing--${side}`),
          ),
        ) &&
        wings.every((item) => {
          const shapes = tags(item.body, "path")
          return shapes.length >= 2 && /C[\s\S]*Z\s*$/.test(shapes[0]?.d || "")
        }),
      `${label}: each literal fly needs two curved wings with readable vein geometry`,
    )
  }
}
const checkOperationsMap = (svg, route, locale) => {
  check(
    svg.attributes["data-map-style"] === "square-dot" &&
      svg.attributes["data-map-source"] === "natural-earth-110m-land" &&
      svg.attributes["data-map-language"] === locale,
    `${route}: operations must use the local square-dot world map in the requested language`,
  )
  const patterns = blocks(svg.body, "pattern")
  const dotPattern = patterns.find((pattern) =>
    tags(pattern.body, "rect").some((rect) => hasClass(rect, "map-dot")),
  )
  check(
    Boolean(dotPattern),
    `${route}: the world map needs an actual dot pattern`,
  )
  const dot = tags(dotPattern.body, "rect").find((rect) =>
    hasClass(rect, "map-dot"),
  )
  const color = dot.fill?.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
  check(
    dotPattern.attributes.patternUnits === "userSpaceOnUse" &&
      Number(dotPattern.attributes.width) ===
        Number(dotPattern.attributes.height) &&
      Number(dot.width) === Number(dot.height) &&
      Number(dot.width) > 0 &&
      Number(dot.width) < Number(dotPattern.attributes.width) &&
      color &&
      parseInt(color[2], 16) > parseInt(color[1], 16) &&
      parseInt(color[2], 16) > parseInt(color[3], 16),
    `${route}: distinct green squares must form the map's repeating dot grid`,
  )
  const land = groupBlocks(svg.body).find((group) =>
    hasClass(group.attributes, "map-land"),
  )
  const clipId = land?.attributes["clip-path"]?.match(/^url\(#(.+)\)$/)?.[1]
  const clip = blocks(svg.body, "clipPath").find(
    (item) => item.attributes.id === clipId,
  )
  const contour = clip && tags(clip.body, "path")[0]?.d
  check(
    Boolean(
      land &&
        clip &&
        contour &&
        (contour.match(/M/g) || []).length >= 5 &&
        (contour.match(/[-+]?(?:\d*\.?\d+)/g) || []).length >= 500 &&
        tags(land.body, "rect").some(
          (rect) => rect.fill === `url(#${dotPattern.attributes.id})`,
        ),
    ),
    `${route}: the dots must be clipped by the real multipart world contour, not fill a rectangular panel`,
  )
  const layers = groupBlocks(svg.body).filter(
    (group) => group.attributes["data-operation-layer"] !== undefined,
  )
  check(
    layers.length === 3 &&
      layers
        .map((group) => group.attributes["data-operation-layer"])
        .join("") === "012" &&
      layers.every((group) => tags(group.body, "path").length > 0),
    `${route}: all three operation narrative states need real visual layers`,
  )
  check(
    layers.every(
      (group) =>
        group.attributes.opacity === undefined &&
        !/opacity/i.test(group.attributes.style || "") &&
        !/data-ambient-(?:packet|path)/.test(group.body),
    ),
    `${route}: heading state must control the story layers independently of ambient traffic`,
  )
  check(
    tags(svg.body, "text").length === 0 &&
      !tags(svg.body, "[a-z][\\w:-]*").some(
        (item) =>
          hasClass(item, "operations-kpi") ||
          hasClass(item, "logistics-overlay"),
      ) &&
      tags(svg.body, "image").length === 0,
    `${route}: the map cannot retain fake KPI text, technical notification panels, or remote map images`,
  )
}
const meta = (html, key) =>
  tags(html, "meta").find((item) => item.name === key || item.property === key)
    ?.content
const outputFor = (route) =>
  path.join(dist, route.replace(/^\/+|\/+$/g, ""), "index.html")
const filesWithin = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const results = await Promise.all(
    entries.map((entry) => {
      const full = path.join(directory, entry.name)
      return entry.isDirectory() ? filesWithin(full) : [full]
    }),
  )
  return results.flat()
}

const routes = allRoutes()
const manifest = JSON.parse(
  await readFile(path.join(dist, "prerender-routes.json"), "utf8"),
)
check(
  JSON.stringify(manifest) === JSON.stringify(routes),
  "Generated route manifest must match the renderable routes",
)
check(
  locales.every((locale) => routes.includes(`${localePrefix(locale)}/`)) &&
    routes.length === 21,
  "All three localized home routes and eighteen project routes must be generated",
)
const featuredSlugs = [
  "logistics-operations",
  "real-time-collaboration",
  "badhabinot",
  "logistics-assistant",
]
const detailSlugs = [...featuredSlugs, "mailops", "otomark"]
for (const slug of detailSlugs) {
  check(
    locales.every((locale) =>
      routes.includes(`${localePrefix(locale)}/projects/${slug}/`),
    ),
    `${slug}: direct detail routes in all three languages must exist`,
  )
}
const pages = new Map()
for (const route of routes) {
  const html = await readFile(outputFor(route), "utf8")
  const rendered = renderPage(route)
  const locale = localeForRoute(route)
  pages.set(route, html)
  checkMotionPreferenceOutput(html, route)
  checkCaptionCleanup(html, route)
  for (const svg of ambientDiagrams(html)) {
    const kind = svg.attributes["data-ambient-scene"]
    check(
      [
        "network",
        "operations",
        "collaboration",
        "pose",
        "intelligence",
      ].includes(kind) && svg.attributes["aria-hidden"] === "true",
      `${route}: live scenes must be recognized decorative illustrations`,
    )
    if (kind === "operations") checkOperationsMap(svg, route, locale)
    const paths = tags(svg.body, "path").filter(
      (item) => item["data-ambient-path"] !== undefined,
    )
    const packets = tags(svg.body, "[a-z][\\w:-]*").filter(
      (item) => item["data-ambient-packet"] !== undefined,
    )
    const references = new Map(
      paths.map((item) => [item["data-ambient-path"], item.d]),
    )
    check(
      references.size === paths.length,
      `${route}: ${kind} packet routes must have unambiguous local identifiers`,
    )
    for (const packet of packets)
      check(
        Boolean(references.get(packet["data-ambient-packet"])?.trim()),
        `${route}: ${kind} live packets must reference an actual path in their own SVG`,
      )
    if (kind === "intelligence")
      check(
        ambientTargetsInPlannedNodes(svg.body) === 0,
        `${route}: planned AI nodes cannot carry live foundation traffic or activity rings`,
      )
  }
  check(
    rendered.status === 200,
    `${route}: valid route must render successfully`,
  )
  check(
    html.includes(`<html lang="${locale}"`),
    `${route}: lang must match the route language`,
  )
  check(
    (html.match(/<title\b/g) || []).length === 1,
    `${route}: one page title is required`,
  )
  check(
    decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || "") ===
      rendered.seo.title,
    `${route}: title must be route-specific`,
  )
  check(
    meta(html, "description") === rendered.seo.description,
    `${route}: description must match the translated content`,
  )
  check(
    meta(html, "og:title") === rendered.seo.title &&
      meta(html, "og:description") === rendered.seo.description,
    `${route}: social metadata must match page metadata`,
  )
  check(
    meta(html, "og:locale") ===
      { tr: "tr_TR", en: "en_US", ru: "ru_RU" }[locale],
    `${route}: social locale must be translated`,
  )
  check(
    meta(html, "robots") === rendered.seo.robots,
    `${route}: indexing must match configured publication state`,
  )
  check(
    (html.match(/<main\b/g) || []).length === 1,
    `${route}: one main landmark is required`,
  )
  check(
    (html.match(/<h1\b/g) || []).length === 1,
    `${route}: one primary heading is required`,
  )
  const ids = tags(html, "[a-z][\\w:-]*")
    .map((tag) => tag.id)
    .filter(Boolean)
  check(
    new Set(ids).size === ids.length,
    `${route}: document and SVG identifiers must be unique`,
  )
  for (const svg of poseDiagrams(html)) {
    check(
      tags(svg.body, "g").filter((group) => hasClass(group, "pose-keypoint"))
        .length === 17,
      `${route}: each original COCO pose illustration must contain 17 landmarks, not 34 marker circles`,
    )
    check(
      svg.attributes["aria-hidden"] === "true",
      `${route}: conceptual pose graphics must remain decorative`,
    )
  }
  check(
    !html.includes('<div id="root"></div>'),
    `${route}: root cannot be empty when JavaScript is disabled`,
  )
  check(
    html.includes(rendered.html),
    `${route}: all primary content must be included in the static output`,
  )
  check(
    textOf(html).includes(displayName(locale)) &&
      rendered.seo.title.includes(displayName(locale)),
    `${route}: identity must be present without JavaScript`,
  )
  check(
    tags(html, "a").some(
      (link) =>
        link.href?.startsWith("mailto:shakho0303@gmail.com") ||
        link.href === `${basePath}${localePrefix(locale)}/#contact`,
    ),
    `${route}: email or the contact section must remain reachable`,
  )
  const structured = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
  check(
    structured.length === 1,
    `${route}: one structured-data block is required`,
  )
  const schema = JSON.parse(structured[0][1])
  if (schema.mainEntity)
    check(
      schema.mainEntity.name === displayName(locale),
      `${route}: person metadata must use the selected language's exact name`,
    )
  const languageLinks = tags(html, "a").filter((link) =>
    locales.includes(link.hrefLang || link.hreflang),
  )
  const slug = route.match(/\/projects\/([^/]+)\/$/)?.[1]
  check(
    languageLinks.length === 3 &&
      locales.every((language) =>
        languageLinks.some(
          (link) =>
            (link.hrefLang || link.hreflang) === language &&
            link.lang === language &&
            link.href ===
              `${basePath}${localePrefix(language)}${slug ? `/projects/${slug}` : ""}/` &&
            (link["aria-current"] === "page") === (language === locale),
        ),
      ),
    `${route}: the language selector must preserve the current project and indicate the active locale`,
  )
  if (locale === "ru")
    check(
      /[А-Яа-яЁё]/.test(rendered.seo.description),
      `${route}: Russian descriptions must contain actual Russian content`,
    )
  const publishedSeo = renderPage(route, {
    siteUrl: "https://portfolio.invalid/",
    allowIndex: true,
  }).seo
  check(
    publishedSeo.canonical === `https://portfolio.invalid${route}` &&
      publishedSeo.alternateTr ===
        `https://portfolio.invalid${slug ? `/projects/${slug}` : ""}/` &&
      publishedSeo.alternateEn ===
        `https://portfolio.invalid/en${slug ? `/projects/${slug}` : ""}/` &&
      publishedSeo.alternateRu ===
        `https://portfolio.invalid/ru${slug ? `/projects/${slug}` : ""}/`,
    `${route}: configured canonical and alternate URLs must point to all three equivalent pages`,
  )
  check(
    schema.inLanguage === locale && schema.name === rendered.seo.title,
    `${route}: structured data must match localized metadata`,
  )
  const skip = tags(html, "a").find((link) => link.href?.startsWith("#main"))
  check(
    Boolean(skip && html.includes(`id="${skip.href.slice(1)}"`)),
    `${route}: skip link must target the main content`,
  )
  if (!rendered.seo.canonical) {
    check(
      !tags(html, "link").some((link) => link.rel === "canonical"),
      `${route}: no invented canonical domain`,
    )
  }
  for (const link of tags(html, "a")) {
    check(
      Boolean(
        link.href &&
          link.href !== "#" &&
          !/^javascript:|^https?:\/\/(?:example\.|localhost)/i.test(link.href),
      ),
      `${route}: links cannot be empty or placeholders`,
    )
    if (link.href.startsWith("#")) {
      check(
        html.includes(`id="${decodeURIComponent(link.href.slice(1))}"`),
        `${route}: anchor ${link.href} must exist`,
      )
    }
    if (link.href.startsWith("/")) {
      const target = new URL(link.href, "http://verification.invalid")
      const targetRoute = target.pathname.slice(basePath.length)
      check(
        target.pathname.startsWith(`${basePath}/`) && routes.includes(targetRoute),
        `${route}: local link ${link.href} must resolve to a generated page`,
      )
      if (target.hash) {
        const destination =
          pages.get(targetRoute) ||
          (await readFile(outputFor(targetRoute), "utf8"))
        check(
          destination.includes(
            `id="${decodeURIComponent(target.hash.slice(1))}"`,
          ),
          `${route}: destination anchor ${link.href} must exist`,
        )
      }
    }
  }
}
for (const [slug, projectId] of [
  ["logistics-operations", "operations"],
  ["real-time-collaboration", "bridge"],
  ["badhabinot", "badhabinot"],
  ["logistics-assistant", "logistics-assistant"],
  ["mailops", "mailops"],
  ["otomark", "otomark"],
]) {
  for (const locale of locales) {
    const route = `${localePrefix(locale)}/projects/${slug}/`
    const html = pages.get(route)
    const expectedScene = {
      operations: "operations",
      "logistics-assistant": "intelligence",
    }[projectId]
    if (expectedScene)
      check(
        ambientDiagrams(html).some(
          (svg) => svg.attributes["data-ambient-scene"] === expectedScene,
        ),
        `${route}: the primary case study needs its corresponding live illustration`,
      )
    if (Object.hasOwn(projectMediaFiles, projectId)) {
      const galleries = projectGalleries(html).filter(
        (gallery) => gallery.attributes["data-project-gallery"] === projectId,
      )
      for (const variant of ["hero", "full"]) {
        const matches = galleries.filter(
          (gallery) => gallery.attributes["data-gallery-variant"] === variant,
        )
        check(
          matches.length === 1,
          `${route}: ${projectId} needs one ${variant} screenshot gallery`,
        )
        checkProjectGallery(
          matches[0],
          `${route} (${variant})`,
          locale,
          projectId,
        )
      }
      const interfaceSection = blocks(html, "section").find(
        (section) => section.attributes.id === "case-interface",
      )
      check(
        interfaceSection?.attributes["aria-labelledby"] &&
          blocks(interfaceSection.body, "h2").some(
            (heading) =>
              heading.attributes.id ===
                interfaceSection.attributes["aria-labelledby"] &&
              textOf(heading.body) ===
                { tr: "Arayüz", en: "Interface", ru: "Интерфейс" }[locale],
          ) &&
          projectGalleries(interfaceSection.body).some(
            (gallery) => gallery.attributes["data-gallery-variant"] === "full",
          ),
        `${route}: the full screenshot gallery must remain in its named interface section`,
      )
      const story = containerWithClass(
        interfaceSection.body,
        "project-scroll-story",
      )
      const steps = blocks(story?.body || "", "li").filter(
        (step) => step.attributes["data-story-step"] !== undefined,
      )
      const expectedStepIds = projectMediaFiles[projectId].map((src) =>
        path.basename(src, ".png"),
      )
      const storyGallery = projectGalleries(story?.body || "").find(
        (gallery) => gallery.attributes["data-gallery-variant"] === "full",
      )
      check(
        story?.attributes["data-project-story"] === projectId &&
          story.attributes["data-story-active"] === "dashboard" &&
          storyGallery?.attributes["data-gallery-scroll"] === "true" &&
          storyGallery.attributes["data-gallery-current"] === "dashboard",
        `${route}: the full screenshot story must start with the dashboard and expose its current scroll selection`,
      )
      check(
        steps.length === expectedStepIds.length &&
          steps.map((step) => step.attributes["data-story-step"]).join("|") ===
            expectedStepIds.join("|") &&
          steps.filter((step) => step.attributes["data-active"] === "true")
            .length === 1,
        `${route}: each supplied screenshot needs its own ordered chapter with one active scroll step`,
      )
      for (const step of steps) {
        const chapterButtons = blocks(step.body, "button")
        const isActive = step.attributes["data-active"] === "true"
        check(
          chapterButtons.length === 1 &&
            chapterButtons[0].attributes.type === "button" &&
            textOf(chapterButtons[0].body).length > 3 &&
            (chapterButtons[0].attributes["aria-current"] === "step") ===
              isActive &&
            (step.attributes["data-story-step"] ===
              story.attributes["data-story-active"]) ===
              isActive &&
            blocks(step.body, "p").some(
              (description) => textOf(description.body).length > 10,
            ),
          `${route}: ${step.attributes["data-story-step"]} needs a named native chapter control and real description`,
        )
      }
    }
    check(
      tags(html, "article").some(
        (item) =>
          hasClass(item, "case-study") && item["data-project"] === projectId,
      ),
      `${route}: direct routes must display the requested case study`,
    )
    const architecture = blocks(html, "section").find(
      (item) => item.attributes.id === "case-architecture",
    )
    check(
      Boolean(architecture),
      `${route}: an architecture explanation must exist in the static page`,
    )
    check(
      tags(architecture.body, "svg").some(
        (item) => item["aria-hidden"] === "true",
      ),
      `${route}: the original architecture graphic must be present and decorative`,
    )
    check(
      blocks(architecture.body, "ul").some(
        (item) =>
          hasClass(item.attributes, "architecture-legend") &&
          blocks(item.body, "li").some(
            (entry) => textOf(entry.body).length > 5,
          ),
      ),
      `${route}: architecture maturity must remain readable in its legend`,
    )
    const components = blocks(architecture.body, "ol").find((item) =>
      hasClass(item.attributes, "architecture-components"),
    )
    check(
      Boolean(components),
      `${route}: the diagram needs readable components outside its decorative SVG`,
    )
    const componentItems = blocks(components.body, "li")
    check(
      componentItems.length >= 2,
      `${route}: architecture cannot be an empty diagram or an isolated label`,
    )
    for (const item of componentItems) {
      check(
        blocks(item.body, "p").some(
          (paragraph) => textOf(paragraph.body).length > 10,
        ),
        `${route}: architecture components need actual descriptions without JavaScript`,
      )
    }
    const flows = blocks(architecture.body, "details").find((item) =>
      hasClass(item.attributes, "architecture-flows"),
    )
    check(
      Boolean(
        flows &&
          blocks(flows.body, "summary").length &&
          blocks(flows.body, "li").length,
      ),
      `${route}: a native disclosure must expose the meaningful connection summary`,
    )
    const walkthrough = blocks(html, "section").find((item) =>
      hasClass(item.attributes, "case-walkthrough"),
    )
    check(
      Boolean(walkthrough),
      `${route}: implemented features need a server-rendered system walkthrough`,
    )
    const featureList = blocks(walkthrough.body, "ol").find((item) =>
      hasClass(item.attributes, "case-feature-list"),
    )
    check(
      Boolean(featureList && blocks(featureList.body, "li").length),
      `${route}: the implemented walkthrough cannot be empty`,
    )
    for (const item of blocks(featureList.body, "li")) {
      check(
        blocks(item.body, "p").some(
          (paragraph) => textOf(paragraph.body).length > 10,
        ),
        `${route}: feature steps need real explanations rather than sequence numbers alone`,
      )
    }
    check(
      tags(html, "a").some(
        (item) =>
          hasClass(item, "case-next-project") && item.href !== basePath + route,
      ),
      `${route}: next-system navigation must reach a different real case study`,
    )
    if (projectId === "logistics-assistant") {
      const plans = blocks(walkthrough.body, "aside").find((item) =>
        hasClass(item.attributes, "case-planned"),
      )
      check(
        Boolean(plans && tags(plans.body, "li").length),
        `${route}: planned AI work must remain separate from implemented steps`,
      )
      check(
        tags(architecture.body, "g").some((item) =>
          hasClass(item, "architecture-node--planned"),
        ) &&
          componentItems.some((item) =>
            hasClass(item.attributes, "architecture-component--planned"),
          ),
        `${route}: proposed architecture nodes need both visual and readable maturity labels`,
      )
    }
  }
}
// The homepage is a compact, six-project discovery web. Detailed implementation
// and maturity contracts remain on each directly reachable case-study route.
for (const [home, locale] of [
  ["/", "tr"],
  ["/en/", "en"],
  ["/ru/", "ru"],
]) {
  const html = pages.get(home)
  const elements = tags(html, "[a-z][\\w:-]*")
  for (const className of [
    "spider-home",
    "web-experience",
    "web-identity",
    "web-nest",
    "web-project-fallback",
    "web-contact",
    "web-application-strip",
  ])
    check(
      elements.some((item) => hasClass(item, className)),
      `${home}: the ${className} experience must exist in the static page`,
    )
  for (const id of ["work", "about", "applications", "experience", "contact"])
    check(
      elements.some((item) => item.id === id),
      `${home}: navigation needs its real #${id} destination`,
    )
  const stage = elements.find((item) => hasClass(item, "web-stage"))
  check(
    stage?.["data-hunt-state"] === "idle",
    `${home}: the hunting surface must start idle`,
  )
  check(
    !elements.some(
      (item) =>
        hasClass(item, "web-motion-control") || hasClass(item, "motion-toggle"),
    ) &&
      !blocks(html, "button").some((item) =>
        /^(?:Canlı|Sakin|Live|Calm)$/i.test(textOf(item.body)),
      ),
    `${home}: the requested automatic hunting experience cannot retain live/calm controls`,
  )
  const themeControls = blocks(html, "button").filter((item) =>
    hasClass(item.attributes, "web-theme-toggle"),
  )
  check(
    themeControls.length === 1 &&
      themeControls[0].attributes.type === "button" &&
      Object.hasOwn(themeControls[0].attributes, "data-theme-toggle") &&
      {
        tr: /^(?:Gündüz|Gece) modunu aç$/,
        en: /^Switch to (?:day|night) mode$/,
        ru: /^Включить (?:светлую|тёмную) тему$/,
      }[locale].test(themeControls[0].attributes["aria-label"] || "") &&
      tags(themeControls[0].body, "svg").some(
        (item) => item["aria-hidden"] === "true",
      ),
    `${home}: day and night modes need one named native theme action`,
  )
  const identity = containerWithClass(html, "web-identity")
  check(
    Boolean(identity) &&
      blocks(identity.body, "h1").length === 1 &&
      textOf(identity.body).includes(displayName(locale)) &&
      textOf(identity.body).includes(
        locale === "ru" ? "Фулстек-разработчик" : "Full-Stack Developer",
      ) &&
      textOf(identity.body).includes(
        {
          tr: "Bilgisayar Mühendisi",
          en: "Computer Engineer",
          ru: "Компьютерный инженер",
        }[locale],
      ),
    `${home}: the separate identity area must show the name and translated role`,
  )
  const nest = blocks(html, "button").find((item) =>
    hasClass(item.attributes, "web-nest"),
  )
  check(
    nest?.attributes.id === "about" &&
      nest.attributes.type === "button" &&
      nest.attributes["aria-haspopup"] === "dialog" &&
      nest.attributes["aria-expanded"] === "false" &&
      nest.attributes["aria-label"] ===
        {
          tr: "Hakkımda’yı aç",
          en: "Open About me",
          ru: "Открыть раздел обо мне",
        }[locale] &&
      textOf(nest.body).length > 3 &&
      tags(nest.body, "svg").some((item) => item["aria-hidden"] === "true"),
    `${home}: the central nest must be a named native control opening the about dialog`,
  )
  const web = blocks(html, "svg").find((item) =>
    hasClass(item.attributes, "spider-web-svg"),
  )
  check(
    Boolean(
      web &&
        web.attributes["aria-hidden"] === "true" &&
        tags(web.body, "path").length >= 12 &&
        tags(web.body, "path").filter((item) => /[CQ]/i.test(item.d || ""))
          .length >= 4,
    ),
    `${home}: the main web needs decorative, layered curved geometry`,
  )
  const spider = containerWithClass(html, "web-spider")
  check(
    elements.filter((item) => hasClass(item, "web-spider")).length === 1 &&
      spider?.attributes["aria-hidden"] === "true" &&
      !Object.hasOwn(spider.attributes, "hidden") &&
      tags(html, "svg").filter((item) => item["data-web-creature"] === "spider")
        .length === 1,
    `${home}: one visible decorative spider must inhabit the central web`,
  )
  checkWebCreature(
    blocks(spider.body, "svg").find(
      (item) => item.attributes["data-web-creature"] === "spider",
    ),
    "spider",
    home,
  )
  // Static output provides the hunt surface, not proof of its walking behavior.
  // Verify chasing, catching, and returning visually in the running browser.
  const huntTrail = blocks(html, "svg").find((item) =>
    hasClass(item.attributes, "hunt-trail-svg"),
  )
  check(
    huntTrail?.attributes["aria-hidden"] === "true" &&
      tags(huntTrail.body, "path").some((item) => hasClass(item, "hunt-trail")),
    `${home}: the measured spider hunt needs a decorative runtime trail surface`,
  )
  const expectedProjects = new Map([
    ["operations", "Operations Manager"],
    ["bridge", "Bridge"],
    ["badhabinot", "Badhabinot"],
    ["logistics-assistant", "CargoTwin"],
    ["mailops", "Mailops"],
    ["otomark", "OtoMARK"],
  ])
  const projectNodes = blocks(html, "button").filter((item) =>
    hasClass(item.attributes, "project-node"),
  )
  check(
    projectNodes.length === 6 &&
      new Set(projectNodes.map((item) => item.attributes["data-project"]))
        .size === 6 &&
      projectNodes.every((item) =>
        expectedProjects.has(item.attributes["data-project"]),
      ) &&
      tags(html, "svg").filter((item) => item["data-web-creature"] === "fly")
        .length === 6,
    `${home}: all six projects need their own unique discovery node`,
  )
  const nodePositions = elements.filter((item) =>
    hasClass(item, "project-node-position"),
  )
  check(
    nodePositions.length === 6 &&
      nodePositions.every(
        (item) => hasClass(item, "is-visible") && !Object.hasOwn(item, "inert"),
      ) &&
      projectNodes.every((item) => item.attributes.tabindex !== "-1"),
    `${home}: all six flies must be visible and keyboard-accessible together`,
  )
  check(
    !elements.some(
      (item) =>
        hasClass(item, "layer-control") ||
        hasClass(item, "web-scroll") ||
        hasClass(item, "operations-console") ||
        hasClass(item, "web-operations"),
    ) &&
      !blocks(html, "button").some((item) =>
        /^(?:DERİNE İN|GO DEEPER)$/i.test(textOf(item.body)),
      ),
    `${home}: the home experience cannot retain project layers, go-deeper controls, or a standalone operations map`,
  )
  for (const node of projectNodes) {
    const projectId = node.attributes["data-project"]
    check(
      node.attributes.type === "button" &&
        node.attributes["aria-haspopup"] === "dialog" &&
        Boolean(node.attributes["aria-label"]?.trim() || textOf(node.body)) &&
        textOf(node.body).includes(expectedProjects.get(projectId)),
      `${home}: ${projectId} needs a named native control announcing its detail dialog`,
    )
    check(
      tags(node.body, "span").some(
        (item) => hasClass(item, "node-fly") && item["aria-hidden"] === "true",
      ) &&
        tags(node.body, "span").some(
          (item) =>
            hasClass(item, "node-copy") && item["aria-hidden"] === "true",
        ),
      `${home}: ${projectId} needs a decorative fly and a project name that reveals on interaction`,
    )
    checkWebCreature(
      blocks(node.body, "svg").find(
        (item) => item.attributes["data-web-creature"] === "fly",
      ),
      "fly",
      `${home}: ${projectId}`,
    )
    const cocoons = blocks(node.body, "svg").filter((item) =>
      hasClass(item.attributes, "fly-cocoon"),
    )
    const wrapping = tags(cocoons[0]?.body || "", "path").filter((item) =>
      /Q/.test(item.d || ""),
    )
    check(
      cocoons.length === 1 &&
        cocoons[0].attributes["aria-hidden"] === "true" &&
        tags(cocoons[0].body, "ellipse").length === 1 &&
        wrapping.length === 7 &&
        new Set(wrapping.map((item) => item.d)).size === 7,
      `${home}: ${projectId} needs a decorative silk cocoon for the catch state`,
    )
  }
  const projectFallback = blocks(html, "noscript").find((item) =>
    hasClass(item.attributes, "web-project-fallback"),
  )
  check(
    Boolean(projectFallback),
    `${home}: the project web needs native case-study links without JavaScript`,
  )
  const fallbackLinks = blocks(projectFallback.body, "a")
  check(
    fallbackLinks.length === 6 &&
      [...expectedProjects.values()].every((name) =>
        fallbackLinks.some((link) => textOf(link.body).includes(name)),
      ),
    `${home}: all six project identities must remain available in the native fallback`,
  )
  for (const slug of detailSlugs) {
    const href = `${basePath}${localePrefix(locale)}/projects/${slug}/`
    check(
      fallbackLinks.some((link) => link.attributes.href === href),
      `${home}: ${slug} needs a native detail link even when JavaScript is disabled`,
    )
  }
  const applicationStrip = containerWithClass(html, "web-application-strip")
  check(
    applicationStrip?.attributes.id === "applications" &&
      Boolean(applicationStrip.attributes["aria-labelledby"]),
    `${home}: the application marquee needs its own named section`,
  )
  const appItems = blocks(applicationStrip.body, "button").filter((item) =>
    Object.hasOwn(item.attributes, "data-app-link"),
  )
  check(
    appItems.length === 6 &&
      new Set(appItems.map((item) => item.attributes["data-app-link"])).size ===
        6 &&
      appItems.every((item) =>
        expectedProjects.has(item.attributes["data-app-link"]),
      ) &&
      appItems.every(
        (item) =>
          item.attributes.type === "button" &&
          Object.hasOwn(item.attributes, "disabled") &&
          item.attributes["aria-disabled"] === "true" &&
          textOf(item.body).includes(
            expectedProjects.get(item.attributes["data-app-link"]),
          ) &&
          textOf(item.body).includes(
            { tr: "Yakında", en: "Coming soon", ru: "Скоро" }[locale],
          ) &&
          {
            tr: /site bağlantısı yakında$/,
            en: /website coming soon$/,
            ru: /ссылка на сайт появится скоро$/,
          }[locale].test(item.attributes["aria-label"] || ""),
      ) &&
      tags(applicationStrip.body, "a").length === 0,
    `${home}: all six unconfigured application sites must have named pending items without invented links`,
  )
  const appGroups = tags(applicationStrip.body, "div").filter((item) =>
    hasClass(item, "application-strip-group"),
  )
  const appCopies = [
    ...blocks(applicationStrip.body, "button"),
    ...blocks(applicationStrip.body, "a"),
  ].filter(
    (item) =>
      hasClass(item.attributes, "application-card") &&
      !Object.hasOwn(item.attributes, "data-app-link"),
  )
  check(
    appGroups.filter((item) => item["aria-hidden"] !== "true").length === 1 &&
      appGroups.filter((item) => item["aria-hidden"] === "true").length >= 1 &&
      appGroups.every((item) => !Object.hasOwn(item, "inert")) &&
      appCopies.length >= 6 &&
      appCopies.every((item) =>
        item.attributes.href
          ? item.attributes.tabindex === "-1"
          : Object.hasOwn(item.attributes, "disabled") &&
            item.attributes["aria-disabled"] === "true",
      ),
    `${home}: marquee copies must stay outside keyboard navigation while configured links remain pointer-clickable`,
  )
  const contact = containerWithClass(html, "web-contact")
  check(
    contact?.attributes.id === "contact" &&
      tags(contact.body, "a").some(
        (item) => item.href === "mailto:shakho0303@gmail.com",
      ),
    `${home}: the closing contact experience must retain its direct email action`,
  )
  const cvLinks = tags(html, "a").filter(
    (link) => link.href?.startsWith("mailto:") && /subject=/i.test(link.href),
  )
  check(cvLinks.length > 0, `${home}: request-CV mail action must be available`)
  check(
    cvLinks.some(
      (link) =>
        new URL(link.href).searchParams.get("subject") ===
        { tr: "CV talebi", en: "CV request", ru: "Запрос резюме" }[locale],
    ),
    `${home}: the CV action must request a CV, not merely reuse an unrelated email link`,
  )
  check(
    tags(html, "a").some((link) => link.href === "mailto:shakho0303@gmail.com"),
    `${home}: a direct email action must be available`,
  )
  check(
    tags(html, "a").some(
      (link) =>
        link.href ===
        "https://www.linkedin.com/in/%C5%9Fahabettin-%C5%9F-703373285",
    ),
    `${home}: LinkedIn must retain the exact CV annotation address`,
  )
}
for (const locale of locales) {
  const route = `${localePrefix(locale)}/projects/badhabinot/`
  check(
    tags(pages.get(route), "a").some(
      (link) => link.href === "https://github.com/seboii/Badhabinot",
    ),
    `${route}: verified public repository must remain reachable`,
  )
  const classifierPlans = containerWithClass(pages.get(route), "case-planned")
  check(
    Boolean(classifierPlans) &&
      {
        tr: /öğrenilmiş 1D-CNN davranış sınıflandırıcısının eğitimi ve değerlendirmesi/i,
        en: /Training and evaluation of a learned 1D-CNN behavior classifier/i,
        ru: /Обучение и оценка классификатора поведения 1D-CNN/i,
      }[locale].test(textOf(classifierPlans.body)),
    `${route}: learned classifier training must remain explicitly within planned work`,
  )
  const assistantRoute = `${localePrefix(locale)}/projects/logistics-assistant/`
  const assistant = textOf(pages.get(assistantRoute))
  check(
    {
      tr: /veri, API ve arayüz temeli/i,
      en: /Data, API, and interface foundations/i,
      ru: /Основа данных, API и интерфейса/i,
    }[locale].test(assistant) &&
      {
        tr: /E-posta analizi.*agent orkestrasyonu.*RAG.*tamamlanmış özellikler değil.*kapsamı belirlenen sonraki adımlar/i,
        en: /Email analysis.*agent orchestration.*RAG.*scoped next steps rather than completed features/i,
        ru: /Анализ почты.*оркестрация агентов.*RAG.*запланированным следующим этапам.*не к завершённым функциям/i,
      }[locale].test(assistant),
    `${assistantRoute}: real summary facts must distinguish the implemented foundation from scoped AI modules`,
  )
}
check(
  new Set(
    locales.map((locale) =>
      meta(pages.get(`${localePrefix(locale)}/`), "description"),
    ),
  ).size === 3,
  "Changing locale must translate the metadata",
)
check(
  new Set(
    locales.map((locale) => textOf(pages.get(`${localePrefix(locale)}/`))),
  ).size === 3,
  "Changing locale must translate the body content",
)

const invalidRoutes = [
  "/projects/does-not-exist/",
  "/en/projects/does-not-exist/",
  "/ru/projects/does-not-exist/",
  "/ru/unexpected/path/",
  "/unexpected/path/",
  "/projects/%E0%A4%A/",
  "/projects/unknown.html",
  "/en/projects/unknown.html",
  "/ru/projects/unknown.html",
]
for (const route of invalidRoutes) {
  const page = renderPage(route)
  check(
    page.status === 404 && page.seo.notFound,
    `${route}: an unknown route must render a 404 state`,
  )
  check(
    page.seo.robots === "noindex, nofollow" && page.seo.canonical === null,
    `${route}: unknown routes cannot be indexed or canonicalized`,
  )
  check(
    {
      tr: /sayfa.*bulunamadı/i,
      en: /page.*(?:not be found|not found)/i,
      ru: /Страница не найдена/i,
    }[localeForRoute(route)].test(textOf(page.html)),
    `${route}: localized recovery text must be server-rendered`,
  )
}
for (const [file, locale] of [
  ["404.html", "tr"],
  ["en/404.html", "en"],
  ["ru/404.html", "ru"],
]) {
  const html = await readFile(path.join(dist, file), "utf8")
  checkMotionPreferenceOutput(html, file)
  checkCaptionCleanup(html, file)
  check(
    html.includes(`<html lang="${locale}"`) &&
      meta(html, "robots") === "noindex, nofollow",
    `${file}: generated static 404 must be localized and non-indexable`,
  )
}

const forbidden = [
  /Lorem ipsum/i,
  /AVAILABLE\s*\/\s*SELECT WORK/i,
  /Available for work/i,
  /2025\s*[—–-]\s*(?:Present|Bugün)/i,
  /(?:30\s*FPS|30\s*frames per second)/i,
  /(?:dateOfBirth|birthDate|doğum tarihi)/i,
  /(?:["']tel:|\+90[\s().-]*\d{3}[\s().-]*\d{3}[\s().-]*\d{2}[\s().-]*\d{2})/i,
  /Shakhobiddin_Shamshiev_CVEN/i,
]
for (const src of Object.values(projectMediaFiles).flat()) {
  const relative = src.slice(1)
  const original = await readFile(path.join(root, "public", relative))
  const delivered = await readFile(path.join(dist, relative))
  check(
    original.length >= 24 &&
      original.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")) &&
      original.subarray(12, 16).toString("ascii") === "IHDR" &&
      original.readUInt32BE(16) > 0 &&
      original.readUInt32BE(20) > 0,
    `${src}: each supplied screenshot must remain a valid PNG with real dimensions`,
  )
  check(
    original.equals(delivered),
    `${src}: the built screenshot must match its unchanged public source`,
  )
  for (const [route, html] of pages)
    for (const image of tags(html, "img").filter(
      (image) => image.src === basePath + src,
    ))
      check(
        Number(image.width) === original.readUInt32BE(16) &&
          Number(image.height) === original.readUInt32BE(20),
        `${route}: ${src} must preserve its source dimensions in image markup`,
      )
}
let inspectedAssets = 0
let hasReducedMotionStyles = false
for (const file of await filesWithin(dist)) {
  check(
    !/\.pdf$/i.test(file),
    `${path.relative(dist, file)}: an unapproved CV/PDF cannot be in public output`,
  )
  if (!/\.(?:html|js|css|svg|json)$/i.test(file)) continue
  const content = await readFile(file, "utf8")
  for (const rule of forbidden)
    check(
      !rule.test(content),
      `${path.relative(dist, file)}: restricted source information or unverified claim ${rule} found in public output`,
    )
  if (/\.css$/i.test(file)) {
    check(
      !/https:\/\/fonts\.(?:googleapis|gstatic)\.com/i.test(content),
      `${path.relative(dist, file)}: fonts must be self-hosted`,
    )
    hasReducedMotionStyles ||=
      /@media[^{}]*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/i.test(content)
  }
  inspectedAssets += 1
}
check(
  hasReducedMotionStyles,
  "The delivered styles must respect the visitor's reduced-motion preference",
)
for (const font of [
  "manrope-latin-variable.woff2",
  "manrope-latin-ext-variable.woff2",
  "ibm-plex-mono-latin-regular.woff2",
  "ibm-plex-mono-latin-ext-regular.woff2",
  "manrope-cyrillic-variable.woff2",
  "ibm-plex-mono-cyrillic-regular.woff2",
]) {
  const bytes = await readFile(path.join(dist, "fonts", font))
  check(
    bytes.subarray(0, 4).toString("ascii") === "wOF2",
    `${font}: a valid WOFF2 file is required`,
  )
  check(
    (await stat(path.join(dist, "fonts", font))).size < 30000,
    `${font}: font subset must retain its expected small size`,
  )
}
for (const license of ["manrope-OFL.txt", "ibm-plex-mono-OFL.txt"]) {
  const text = await readFile(path.join(dist, "fonts", license), "utf8")
  check(
    text.includes("SIL OPEN FONT LICENSE"),
    `${license}: font license must be shipped`,
  )
}
if (renderPage("/").seo.robots === "noindex, nofollow") {
  check(
    (await readFile(path.join(dist, "robots.txt"), "utf8")).includes(
      "Disallow: /",
    ),
    "Preview robots policy must disable indexing",
  )
}
console.log(
  `PASS: ${assertions} assertions; ${routes.length} static routes in three languages, ${invalidRoutes.length} invalid routes, six simultaneously accessible fly nodes with silk cocoons, one eight-legged spider, organic web geometry, an idle hunt surface, a separate identity and accessible about nest, six native case-study fallback links, six pending application sites in a decorative marquee, a native day/night theme action, case-study operations maps, reduced-motion styles, caption cleanup, detailed case studies, eleven unchanged Bridge and Badhabinot screenshots in accessible galleries, localized 404s, ${inspectedAssets} public assets, privacy boundaries, local links, metadata, and self-hosted fonts verified. Live hunting, randomized positions, modal maps, theme changes, and gallery interactions require browser verification.`,
)
