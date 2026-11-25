import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"
import ts from "typescript"
import { renderToStaticMarkup } from "react-dom/server"
import { createElement } from "react"

// A source-level controlled simulation, not a browser/layout/visual test.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const hookFile = "src/motion/useResearchScroll.ts"
const visualFile = "src/visuals/ResearchTopology.tsx"
const hookSource = await readFile(path.join(root, hookFile), "utf8")
const visualSource = await readFile(path.join(root, visualFile), "utf8")
const compile = (source, fileName) =>
  ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
const visualExports = {}
vm.runInNewContext(compile(visualSource, visualFile), {
  exports: visualExports,
  require,
})
const html = (locale = "tr", active = 0) =>
  renderToStaticMarkup(createElement(visualExports.default, { locale, active }))
const hash = (source) => createHash("sha256").update(source).digest("hex")
const clamp = (value, low, high) => Math.min(high, Math.max(low, value))
const angularDifference = (from, to) =>
  ((((to - from) % 360) + 540) % 360) - 180
let assertions = 0
const check = (condition, message) => {
  assert.ok(condition, message)
  assertions++
}
const near = (actual, expected, tolerance, message) =>
  check(Math.abs(actual - expected) <= tolerance, message)
const dataName = (property) =>
  `data-${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`

class Element {
  constructor(tag, attributes = {}) {
    this.tag = tag
    this.attributes = new Map(Object.entries(attributes))
    this.children = []
    this.writes = 0
    const values = {}
    for (const [name, value] of this.attributes) {
      if (name.startsWith("data-"))
        values[
          name
            .slice(5)
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        ] = value
    }
    this.dataset = new Proxy(values, {
      set: (target, property, value) => {
        target[property] = String(value)
        this.attributes.set(dataName(property), String(value))
        this.writes++
        return true
      },
      deleteProperty: (target, property) => {
        delete target[property]
        this.attributes.delete(dataName(property))
        this.writes++
        return true
      },
    })
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value))
    this.writes++
  }
  removeAttribute(name) {
    this.attributes.delete(name)
    this.writes++
  }
  matches(selector) {
    if (selector.startsWith("."))
      return (this.getAttribute("class") || "")
        .split(/\s+/)
        .includes(selector.slice(1))
    if (selector.startsWith("["))
      return this.attributes.has(selector.slice(1, -1))
    return this.tag === selector
  }
  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ])
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null
  }
}

function parseSvg(markup) {
  const document = new Element("document")
  const stack = [document]
  const all = []
  for (const match of markup.matchAll(/<(\/?)([\w:-]+)\b([^>]*)>/g)) {
    const [, closing, tag, raw] = match
    if (closing) {
      check(stack.at(-1)?.tag === tag, `SSR SVG nesting: ${tag}`)
      stack.pop()
      continue
    }
    const attrs = Object.fromEntries(
      [...raw.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map((item) => [
        item[1],
        item[2] ?? "",
      ]),
    )
    const element = new Element(tag, attrs)
    stack.at(-1).children.push(element)
    all.push(element)
    if (!raw.endsWith("/")) stack.push(element)
  }
  return { svg: document.querySelector("svg"), all }
}

const quadratic = (segment, t) => {
  const [p, c, e] = segment
  return {
    x: (1 - t) ** 2 * p.x + 2 * (1 - t) * t * c.x + t * t * e.x,
    y: (1 - t) ** 2 * p.y + 2 * (1 - t) * t * c.y + t * t * e.y,
  }
}
function geometry(d) {
  const tokens = d.match(/[MQ]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/gi)
  let cursor = 0
  let previous
  const segments = []
  while (cursor < tokens.length) {
    const command = tokens[cursor++]
    if (command === "M") {
      previous = { x: Number(tokens[cursor++]), y: Number(tokens[cursor++]) }
      continue
    }
    assert.equal(
      command,
      "Q",
      "Only the actual open M/Q research routes are sampled",
    )
    const control = { x: Number(tokens[cursor++]), y: Number(tokens[cursor++]) }
    const end = { x: Number(tokens[cursor++]), y: Number(tokens[cursor++]) }
    segments.push([previous, control, end])
    previous = end
  }
  const lookup = [{ ...segments[0][0], distance: 0 }]
  for (const segment of segments) {
    for (let step = 1; step <= 256; step++) {
      const point = quadratic(segment, step / 256)
      const last = lookup.at(-1)
      lookup.push({
        ...point,
        distance:
          last.distance + Math.hypot(point.x - last.x, point.y - last.y),
      })
    }
  }
  const length = lookup.at(-1).distance
  const pointAt = (distance) => {
    distance = clamp(distance, 0, length)
    let low = 0
    let high = lookup.length - 1
    while (low + 1 < high) {
      const middle = Math.floor((low + high) / 2)
      if (lookup[middle].distance <= distance) low = middle
      else high = middle
    }
    const before = lookup[low]
    const after = lookup[high]
    const fraction =
      (distance - before.distance) / (after.distance - before.distance)
    return {
      x: before.x + (after.x - before.x) * fraction,
      y: before.y + (after.y - before.y) * fraction,
    }
  }
  // Independent closest-point check against the analytic quadratics, rather
  // than testing only that the hook calls the mocked SVG geometry API.
  const curveDistance = (point) => {
    let result = Infinity
    for (const segment of segments) {
      let t = 0
      let best = Infinity
      for (let sample = 0; sample <= 24; sample++) {
        const candidate = quadratic(segment, sample / 24)
        const squared =
          (candidate.x - point.x) ** 2 + (candidate.y - point.y) ** 2
        if (squared < best) {
          best = squared
          t = sample / 24
        }
      }
      const [p, c, e] = segment
      const ax = p.x - 2 * c.x + e.x
      const ay = p.y - 2 * c.y + e.y
      const bx = 2 * (c.x - p.x)
      const by = 2 * (c.y - p.y)
      for (let iteration = 0; iteration < 8; iteration++) {
        const value = quadratic(segment, t)
        const dx = 2 * ax * t + bx
        const dy = 2 * ay * t + by
        const numerator = (value.x - point.x) * dx + (value.y - point.y) * dy
        const denominator =
          dx * dx +
          dy * dy +
          (value.x - point.x) * 2 * ax +
          (value.y - point.y) * 2 * ay
        if (Math.abs(denominator) < 1e-12) break
        t = clamp(t - numerator / denominator, 0, 1)
      }
      const value = quadratic(segment, t)
      result = Math.min(
        result,
        Math.hypot(value.x - point.x, value.y - point.y),
      )
    }
    return result
  }
  return { segments, length, pointAt, curveDistance }
}

class Events {
  constructor() {
    this.listeners = new Map()
  }
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type).add(callback)
  }
  removeEventListener(type, callback) {
    this.listeners.get(type)?.delete(callback)
  }
  emit(type) {
    for (const callback of this.listeners.get(type) || []) callback()
  }
  get listenerCount() {
    return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0)
  }
}

function harness({
  scroll = 0,
  height = 900,
  tops = [1400, 2000, 2600, 3200],
  locale = "tr",
} = {}) {
  const { svg, all } = parseSvg(html(locale))
  const paths = svg.querySelectorAll("[data-research-path]")
  let offset = 0
  const curves = paths.map((element) => {
    const curve = geometry(element.getAttribute("d"))
    element.getTotalLength = () => curve.length
    element.getPointAtLength = curve.pointAt
    const entry = { ...curve, offset }
    offset += curve.length
    return entry
  })
  const total = offset
  const spider = svg.querySelector("[data-research-spider]")
  const legs = spider.querySelectorAll("[data-research-leg]")
  const shapes = legs.map((leg) =>
    leg.querySelector("[data-research-leg-shape]"),
  )
  const body = spider.querySelector("[data-research-body]")
  const originals = new Map(
    [spider, body, ...shapes].map((element) => [
      element,
      new Map(element.attributes),
    ]),
  )
  const window = new Events()
  window.scrollY = scroll
  window.innerHeight = height
  let clock = 1000
  let nextFrame = 1
  let measurements = 0
  let cleaned = false
  const frames = new Map()
  window.requestAnimationFrame = (callback) => {
    const id = nextFrame++
    frames.set(id, callback)
    return id
  }
  window.cancelAnimationFrame = (id) => frames.delete(id)
  let fontResolve
  const fonts = new Promise((resolve) => {
    fontResolve = resolve
  })
  const section = new Element("section")
  section.children = [svg]
  section.querySelectorAll = (selector) =>
    selector === ".evidence-signal h3"
      ? tops.map((_, index) => ({
          getBoundingClientRect: () => {
            measurements++
            return { top: tops[index] - window.scrollY }
          },
        }))
      : Element.prototype.querySelectorAll.call(section, selector)
  const document = { documentElement: {}, body: {}, fonts: { ready: fonts } }
  const observers = []
  class ResizeObserver {
    constructor(callback) {
      this.callback = callback
      this.targets = new Set()
      this.disconnected = false
      observers.push(this)
    }
    observe(target) {
      this.targets.add(target)
    }
    disconnect() {
      this.targets.clear()
      this.disconnected = true
    }
  }
  const activeChanges = []
  let cleanup
  const exports = {}
  vm.runInNewContext(compile(hookSource, hookFile), {
    exports,
    require: (name) => {
      assert.equal(name, "react")
      return {
        useEffect: (effect) => {
          cleanup = effect()
        },
      }
    },
    window,
    document,
    ResizeObserver,
    getComputedStyle: () => ({ getPropertyValue: () => "84" }),
    setTimeout: () => {
      throw new Error("Research follow must not create a timer")
    },
    setInterval: () => {
      throw new Error("Research follow must not repeat on a timer")
    },
  })
  exports.default({ current: section }, locale, (active) =>
    activeChanges.push(active),
  )
  const transform = () => {
    const match = spider
      .getAttribute("transform")
      ?.match(/^translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)$/)
    check(
      Boolean(match),
      "Spider transform must contain finite position and orientation",
    )
    return { x: Number(match[1]), y: Number(match[2]), angle: Number(match[3]) }
  }
  const snapshot = () => ({
    ...transform(),
    position: Number(svg.dataset.researchPosition),
    target: Number(svg.dataset.researchTarget),
    distance: Number(svg.dataset.researchDistance),
    active: Number(svg.dataset.researchActive),
    state: svg.dataset.researchState,
    legs: shapes.map((shape) => shape.getAttribute("d")),
    body: body.getAttribute("transform"),
  })
  const writes = () => all.reduce((sum, element) => sum + element.writes, 0)
  const locate = (distance) => {
    const curve =
      curves.find((item) => distance <= item.offset + item.length + 0.001) ||
      curves.at(-1)
    return { curve, along: clamp(distance - curve.offset, 0, curve.length) }
  }
  const trace = []
  let previous = snapshot()
  const step = (milliseconds = 1000 / 60) => {
    clock += milliseconds
    const pending = [...frames.values()]
    frames.clear()
    for (const callback of pending) callback(clock)
    if (pending.length && !cleaned) {
      const current = snapshot()
      const moved = Math.abs(current.distance - previous.distance)
      const turn = Math.abs(angularDifference(previous.angle, current.angle))
      check(
        moved <= (780 * 32) / 1000 + 0.003,
        "Every frame must remain below the 780 SVG/s × 32 ms arc step limit",
      )
      check(
        turn <= 0.65 * 32 + 0.16,
        "Every frame must turn through a bounded shortest angle",
      )
      check(
        current.distance >= -0.001 && current.distance <= total + 0.001,
        "Follow distance must remain inside the three open strands",
      )
      const { curve, along } = locate(current.distance)
      const expected = curve.pointAt(along)
      check(
        Math.hypot(current.x - expected.x, current.y - expected.y) <= 0.012,
        "Position must match cumulative arc distance, including route junctions",
      )
      check(
        curve.curveDistance(current) <= 0.02,
        "Spider must remain on the analytic SSR quadratic silk, without XY shortcuts",
      )
      check(
        current.legs.every((d) => d && !/NaN|Infinity/.test(d)),
        "Eight moving leg shapes must stay finite",
      )
      trace.push({ ...current, moved, turn, milliseconds })
      previous = current
    }
    return snapshot()
  }
  const settle = (milliseconds = 1000 / 60) => {
    const before = clock
    let count = 0
    while (frames.size && count < 2000) {
      step(milliseconds)
      count++
    }
    check(
      count < 2000 && frames.size === 0,
      "Finite follow must finish and stop scheduling frames",
    )
    return { frames: count, elapsedMs: +(clock - before).toFixed(2) }
  }
  const idle = () => {
    const before = snapshot()
    const beforeWrites = writes()
    for (let index = 0; index < 30; index++) step()
    check(
      frames.size === 0 && writes() === beforeWrites,
      "Idle reading must have no RAF loop or DOM writes",
    )
    assert.deepEqual(
      snapshot(),
      before,
      "Idle position, orientation and gait must remain unchanged",
    )
    assertions++
  }
  const restPose = () => {
    for (const [index, shape] of shapes.entries()) {
      const values = shape
        .getAttribute("d")
        .match(/[-+]?(?:\d*\.?\d+)/g)
        .map(Number)
      const expected = [
        "researchLegHip",
        "researchLegKnee",
        "researchLegFoot",
      ].flatMap((name) => legs[index].dataset[name].split(" ").map(Number))
      check(
        values.length === 6 &&
          values.every((value, i) => Math.abs(value - expected[i]) <= 0.001),
        "Resting legs must return to their own neutral joints",
      )
    }
    check(
      body.getAttribute("transform") === "translate(0 0.000)",
      "Resting body must stop bobbing",
    )
  }
  return {
    svg,
    paths,
    curves,
    total,
    spider,
    legs,
    shapes,
    body,
    frames,
    trace,
    activeChanges,
    originals,
    observers,
    window,
    snapshot,
    step,
    settle,
    idle,
    restPose,
    writes,
    get clock() {
      return clock
    },
    get measurements() {
      return measurements
    },
    setTops: (next) => {
      tops.splice(0, tops.length, ...next)
    },
    resolveFonts: async () => {
      fontResolve()
      await Promise.resolve()
      await Promise.resolve()
    },
    scrollTo: (value) => {
      window.scrollY = value
      window.emit("scroll")
    },
    resize: () => window.emit("resize"),
    observeResize: () => observers.forEach((observer) => observer.callback()),
    cleanup: () => {
      cleanup()
      cleaned = true
    },
  }
}

const cases = []
const record = (name, harness, timing = {}) => {
  cases.push({
    name,
    passed: true,
    frames: timing.frames,
    settleElapsedMs: timing.elapsedMs,
    elapsedMs: +harness.trace
      .reduce((sum, entry) => sum + entry.milliseconds, 0)
      .toFixed(2),
    finalPosition: harness.snapshot().position,
    finalState: harness.snapshot().state,
    maxArcStep: +Math.max(
      0,
      ...harness.trace.map((entry) => entry.moved),
    ).toFixed(3),
    maxAngleStep: +Math.max(
      0,
      ...harness.trace.map((entry) => entry.turn),
    ).toFixed(3),
    pendingFrames: harness.frames.size,
  })
}

const reference = parseSvg(html()).svg
const routeSignature = (svg) =>
  svg
    .querySelectorAll("[data-research-path]")
    .map((route) => route.getAttribute("d"))
for (const locale of ["tr", "en"]) {
  for (let active = 0; active < 4; active++) {
    assert.deepEqual(
      routeSignature(parseSvg(html(locale, active)).svg),
      routeSignature(reference),
      "Locale/active changes cannot replace the walk geometry",
    )
    assertions++
  }
}
check(
  reference.querySelectorAll("[data-research-leg]").length === 8,
  "The actual SSR spider needs eight separate jointed legs",
)

// A PageDown/full-document jump must traverse every intervening arc.
for (const hz of [60, 120]) {
  const h = harness()
  h.scrollTo(4000)
  const first = h.step(1000 / hz)
  check(
    first.target === 3 &&
      first.position > 0 &&
      first.position < 0.1 &&
      first.state === "walking",
    "A full 0→3 scroll jump cannot snap to the destination in one frame",
  )
  const timing = h.settle(1000 / hz)
  const final = h.snapshot()
  check(
    final.position === 3 &&
      final.target === 3 &&
      final.active === 3 &&
      final.state === "at-stop",
    "Full-document follow must reach exact stop04",
  )
  near(
    final.distance,
    h.total,
    0.0006,
    "Arrival distance must snap only the subpixel remainder",
  )
  check(
    [0, 1, 2].every((index) =>
      h.trace.some((entry) => Math.floor(entry.position) === index),
    ),
    "Forward jump must visit all three open routes",
  )
  h.restPose()
  h.idle()
  const movement = h.trace.find((entry) => {
    const currentFoot = entry.legs[0]
      .match(/[-+]?(?:\d*\.?\d+)/g)
      .map(Number)
      .slice(-2)
    return (
      Math.abs(
        currentFoot[0] -
          Number(h.legs[0].dataset.researchLegFoot.split(" ")[0]),
      ) > 2
    )
  })
  check(
    Boolean(movement),
    "Walking must produce a visible articulated foot displacement",
  )
  const reaches = movement.legs.map(
    (d, index) =>
      Number(d.match(/[-+]?(?:\d*\.?\d+)/g).at(-2)) -
      Number(h.legs[index].dataset.researchLegFoot.split(" ")[0]),
  )
  check(
    reaches[0] * reaches[1] < -2 && reaches[0] * reaches[4] < -2,
    "Adjacent and opposing leg pairs must step out of phase",
  )
  check(
    movement.legs.every((d, index) => d !== h.shapes[index].getAttribute("d")),
    "Each of the eight shapes must move independently from its resting geometry",
  )
  record(`full jump at ${hz} Hz`, h, timing)
  h.cleanup()
}

const wheel = harness()
wheel.scrollTo(Number(wheel.paths[0].dataset.researchStart) + 120)
const wheelFirst = wheel.step()
check(
  wheelFirst.position > 0 && wheelFirst.position < wheelFirst.target,
  "A 120 px wheel jump must follow rather than snap",
)
const wheelTiming = wheel.settle()
check(
  wheel.snapshot().state === "on-thread",
  "A stopped mid-transition target must settle on the thread",
)
wheel.restPose()
wheel.idle()
record("wheel 120 px / mid-transition idle", wheel, wheelTiming)
wheel.cleanup()

const pageDown = harness({ scroll: 1100 })
pageDown.scrollTo(2000)
const pageDownFirst = pageDown.step()
check(
  pageDownFirst.target > 1 && pageDownFirst.position < 0.1,
  "A 900 px PageDown jump must walk through the skipped route",
)
const pageDownTiming = pageDown.settle()
check(
  pageDown.snapshot().position === pageDown.snapshot().target &&
    pageDown.snapshot().state === "on-thread",
  "PageDown must settle at its exact mid-thread reading target",
)
pageDown.restPose()
pageDown.idle()
record("PageDown 900 px", pageDown, pageDownTiming)
pageDown.cleanup()

for (let route = 0; route < 3; route++) {
  const h = harness({ scroll: [1100, 1750, 2350][route] })
  h.scrollTo(Number(h.paths[route].dataset.researchEnd) + 5)
  const first = h.step()
  check(
    first.target === route + 1 &&
      first.position > route &&
      first.position < route + 0.1,
    "A single-route target must begin a bounded walking step",
  )
  const timing = h.settle()
  check(
    h.snapshot().position === route + 1 && h.snapshot().state === "at-stop",
    "A complete single-route walk must arrive at its next numbered stop",
  )
  h.restPose()
  h.idle()
  record(`single route 0${route + 1}→0${route + 2}`, h, timing)
  h.cleanup()
}

for (let stop = 0; stop < 4; stop++) {
  const h = harness({
    scroll: [1100, 1750, 2350, 3000][stop],
    locale: stop % 2 ? "en" : "tr",
  })
  check(
    h.snapshot().position === stop &&
      h.snapshot().target === stop &&
      h.snapshot().state === "at-stop",
    `Deep/resting initialization must start at stop 0${stop + 1}`,
  )
  h.restPose()
  h.idle()
  record(`reading stop 0${stop + 1}`, h)
  h.cleanup()
}

const reverse = harness({ scroll: 4000 })
reverse.scrollTo(0)
const reverseFirst = reverse.step()
check(
  reverseFirst.target === 0 &&
    reverseFirst.position > 2.9 &&
    reverseFirst.position < 3,
  "Reverse jump must begin a bounded walk, not teleport to01",
)
const reverseTiming = reverse.settle()
check(
  reverse.snapshot().position === 0 && reverse.snapshot().state === "at-stop",
  "Reverse walk must reach exact stop01",
)
check(
  [0, 1, 2].every((index) =>
    reverse.trace.some((entry) => Math.floor(entry.position) === index),
  ),
  "Reverse walk must traverse all three routes",
)
const start = reverse.curves[0].pointAt(0)
const after = reverse.curves[0].pointAt(1)
const reverseHeading =
  (Math.atan2(after.y - start.y, after.x - start.x) * 180) / Math.PI + 180
near(
  Math.abs(angularDifference(reverse.snapshot().angle, reverseHeading)),
  0,
  0.16,
  "Reverse arrival must face the reverse tangent",
)
reverse.restPose()
reverse.idle()
record("reverse 04→01", reverse, reverseTiming)
reverse.cleanup()

const interrupted = harness()
interrupted.scrollTo(4000)
for (let index = 0; index < 45; index++) interrupted.step()
const beforeReverse = interrupted.snapshot()
interrupted.scrollTo(0)
interrupted.step()
check(
  interrupted.snapshot().distance < beforeReverse.distance &&
    interrupted.snapshot().distance > 0,
  "Reversing mid-walk must continue from the drawn location",
)
record("interrupted walk / reverse", interrupted, interrupted.settle())
interrupted.idle()
interrupted.cleanup()

const delayed = harness()
delayed.scrollTo(4000)
delayed.step()
const beforeGap = delayed.snapshot().distance
const gap = delayed.step(10000)
check(
  gap.distance - beforeGap < 25 && gap.position < 0.2 && gap.target === 3,
  "A 10-second frame gap cannot become a large catch-up teleport",
)
record("10-second frame gap", delayed, delayed.settle())
delayed.cleanup()

const layout = harness({ scroll: 1531 })
near(
  layout.snapshot().position,
  0.5,
  0.0001,
  "Mid-thread deep initialization must use the reading position",
)
layout.setTops([1520, 2120, 2720, 3320])
const beforeMeasure = layout.measurements
layout.resize()
layout.observeResize()
await layout.resolveFonts()
check(
  layout.frames.size === 1,
  "Resize, observer and font notifications must coalesce",
)
const beforeLayout = layout.snapshot().distance
layout.step()
check(
  layout.measurements === beforeMeasure + 4,
  "Coalesced layout notification must measure each heading once",
)
check(
  layout.snapshot().distance < beforeLayout &&
    layout.snapshot().position > layout.snapshot().target,
  "Layout remeasurement must follow from the current location rather than snap",
)
const layoutTiming = layout.settle()
layout.restPose()
layout.idle()
layout.window.emit("pageshow")
layout.window.emit("hashchange")
check(
  layout.frames.size === 1,
  "Restored-page/hash notifications must coalesce",
)
layout.settle()
layout.idle()
record("resize / observer / fonts / restored page", layout, layoutTiming)
layout.cleanup()

const mobile = harness({ height: 720, tops: [900, 1280, 1660, 2040] })
mobile.scrollTo(2200)
const mobileFirst = mobile.step()
check(
  mobileFirst.target === 3 && mobileFirst.position < 0.1,
  "Compact synthetic heading layout must preserve bounded following",
)
record("compact heading layout", mobile, mobile.settle())
mobile.restPose()
mobile.idle()
mobile.cleanup()

const cleanup = harness()
cleanup.scrollTo(4000)
cleanup.step()
const stale = [...cleanup.frames.values()]
cleanup.cleanup()
check(
  cleanup.frames.size === 0 && cleanup.window.listenerCount === 0,
  "Cleanup must cancel the frame and remove every event listener",
)
check(
  cleanup.observers.every(
    (observer) => observer.disconnected && observer.targets.size === 0,
  ),
  "Cleanup must disconnect ResizeObserver",
)
for (const [element, original] of cleanup.originals) {
  assert.deepEqual(
    element.attributes,
    original,
    "Cleanup must restore spider/body transforms and every leg path",
  )
  assertions++
}
check(
  [
    "researchPosition",
    "researchTarget",
    "researchDistance",
    "researchActive",
    "researchState",
  ].every((key) => cleanup.svg.dataset[key] === undefined),
  "Cleanup must remove all motion telemetry",
)
check(
  cleanup.paths.every(
    (route) =>
      route.dataset.researchStart === undefined &&
      route.dataset.researchEnd === undefined,
  ),
  "Cleanup must remove measured passage bounds",
)
const cleanupWrites = cleanup.writes()
await cleanup.resolveFonts()
cleanup.resize()
for (const callback of stale) callback(cleanup.clock + 1000)
check(
  cleanup.frames.size === 0 && cleanup.writes() === cleanupWrites,
  "Late fonts and stale RAF callbacks must not revive a cleaned effect",
)
cases.push({
  name: "cleanup / late fonts / stale frame",
  passed: true,
  pendingFrames: 0,
  restoredLegs: 8,
})

const report = {
  checkedAt: new Date().toISOString(),
  method:
    "Actual TypeScript hook transpiled into a mocked React effect; actual TSX rendered by React SSR; controlled RAF timestamps; numerical arc-length sampling and independent analytic closest-point checks of its quadratic SVG routes",
  browserTest: false,
  limitations:
    "Simulated event/heading layout and SVG geometry API. Does not exercise a real browser layout, native SVG engine, touch/wheel implementation, visual quality, or viewport rendering; no browser access workaround used.",
  sourceHashes: {
    [hookFile]: hash(hookSource),
    [visualFile]: hash(visualSource),
  },
  assertions,
  passed: true,
  caseCount: cases.length,
  cases,
}
await writeFile(
  path.join(root, "docs/screenshots/research-walk-checks.json"),
  `${JSON.stringify(report, null, 2)}\n`,
)
console.log(
  `PASS: ${assertions} controlled-source assertions across ${cases.length} scenarios; browserTest=false`,
)
