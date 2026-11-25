import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"
import ts from "typescript"

// Controlled source simulation. No browser, native viewport, or GSAP emulation.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceFile = "src/motion/useOperationsScroll.ts"
const source = await readFile(path.join(root, sourceFile), "utf8")
const compiled = ts.transpileModule(source, {
  fileName: sourceFile,
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText
let assertions = 0
const check = (condition, message) => {
  assert.ok(condition, message)
  assertions++
}
const equal = (actual, expected, message) => {
  assert.equal(actual, expected, message)
  assertions++
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
  get count() {
    return [...this.listeners.values()].reduce(
      (sum, callbacks) => sum + callbacks.size,
      0,
    )
  }
}

function harness({
  width = 1440,
  height = 900,
  header = "84px",
  mapHeight = 280,
  tops = [1200, 1800, 2400],
  scroll = 0,
  locale = "tr",
  resizeObserver = true,
  headingCount = 3,
  missingScope = false,
  initialOffset = "",
  initialPriority = "",
} = {}) {
  const window = new Events()
  window.innerWidth = width
  window.innerHeight = height
  window.scrollY = scroll
  const frames = new Map()
  let id = 1
  let clock = 1000
  let measurements = 0
  let mapMeasurements = 0
  window.requestAnimationFrame = (callback) => {
    const next = id++
    frames.set(next, callback)
    return next
  }
  window.cancelAnimationFrame = (frame) => frames.delete(frame)
  const changes = []
  let active
  const styles = new Map()
  const priorities = new Map()
  let styleWrites = 0
  const offsetProperty = "--operations-reading-offset"
  if (initialOffset) {
    styles.set(offsetProperty, initialOffset)
    priorities.set(offsetProperty, initialPriority)
  }
  const style = {
    getPropertyValue: (name) => styles.get(name) || "",
    getPropertyPriority: (name) => priorities.get(name) || "",
    setProperty: (name, value, priority = "") => {
      styles.set(name, String(value))
      priorities.set(name, priority)
      styleWrites++
    },
    removeProperty: (name) => {
      const previous = styles.get(name) || ""
      styles.delete(name)
      priorities.delete(name)
      styleWrites++
      return previous
    },
  }
  const section = {
    style,
    querySelectorAll: (selector) =>
      selector === ".operations-step h4"
        ? tops.slice(0, headingCount).map((_, index) => ({
            getBoundingClientRect: () => {
              measurements++
              return { top: tops[index] - window.scrollY }
            },
          }))
        : [],
    querySelector: (selector) =>
      selector === ".operations-map"
        ? {
            getBoundingClientRect: () => {
              mapMeasurements++
              return { height: mapHeight }
            },
          }
        : null,
  }
  let resolveFonts
  const ready = new Promise((resolve) => {
    resolveFonts = resolve
  })
  const document = { documentElement: {}, body: {}, fonts: { ready } }
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
  let cleanup
  const exports = {}
  vm.runInNewContext(compiled, {
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
    ...(resizeObserver ? { ResizeObserver } : {}),
    getComputedStyle: () => ({ getPropertyValue: () => header }),
    setTimeout: () => {
      throw new Error("Heading selection must not use a timer")
    },
    setInterval: () => {
      throw new Error("Heading selection must not repeat on a timer")
    },
  })
  exports.default(
    { current: missingScope ? null : section },
    locale,
    (value) => {
      active = value
      changes.push(value)
    },
  )
  const step = () => {
    clock += 1000 / 60
    const pending = [...frames.values()]
    frames.clear()
    for (const callback of pending) callback(clock)
    equal(frames.size, 0, "A heading update must not schedule recurring frames")
    return active
  }
  const scrollTo = (value) => {
    window.scrollY = value
    window.emit("scroll")
    return step()
  }
  const nativeAnchor = (index) => {
    const padding = (Number.parseFloat(header) || 84) + 24
    const margin = Number.parseFloat(style.getPropertyValue(offsetProperty))
    check(
      Number.isFinite(margin),
      "Native heading anchors need a measured CSS reading offset",
    )
    window.scrollY = tops[index] - padding - margin
    window.emit("hashchange")
    return step()
  }
  const idle = () => {
    const count = changes.length
    const beforeMeasure = measurements
    const beforeStyles = styleWrites
    for (let index = 0; index < 20; index++) step()
    equal(
      changes.length,
      count,
      "Reading at a stop must not issue new state updates",
    )
    equal(measurements, beforeMeasure, "Idle must not remeasure headings")
    equal(styleWrites, beforeStyles, "Idle must not rewrite its anchor offset")
  }
  return {
    window,
    document,
    frames,
    changes,
    observers,
    step,
    scrollTo,
    nativeAnchor,
    idle,
    style,
    get active() {
      return active
    },
    get measurements() {
      return measurements
    },
    get mapMeasurements() {
      return mapMeasurements
    },
    setTops: (next) => tops.splice(0, tops.length, ...next),
    setMapHeight: (next) => {
      mapHeight = next
    },
    setHeader: (next) => {
      header = next
    },
    resolveFonts: async () => {
      resolveFonts()
      await Promise.resolve()
      await Promise.resolve()
    },
    cleanup: () => cleanup?.(),
  }
}

const cases = []
const scenario = async (name, run) => {
  const before = assertions
  const evidence = await run()
  cases.push({
    name,
    passed: true,
    assertions: assertions - before,
    ...evidence,
  })
}

// Reading-line values are independently specified by the layout contract.
// These fixtures are synthetic heading/map sizes, not measured viewports.
const layouts = [
  {
    name: "desktop TR",
    width: 1440,
    height: 900,
    header: "84px",
    readingLine: 284,
    tops: [1200, 1800, 2400],
    locale: "tr",
  },
  {
    name: "desktop EN variable gaps",
    width: 1440,
    height: 900,
    header: "84px",
    readingLine: 284,
    tops: [1200, 1940, 2730],
    locale: "en",
  },
  {
    name: "medium two-column",
    width: 815,
    height: 700,
    header: "84px",
    readingLine: 238,
    tops: [1200, 1550, 2010],
    locale: "tr",
  },
  {
    name: "tall desktop cap",
    width: 1920,
    height: 1200,
    header: "84px",
    readingLine: 284,
    tops: [1200, 1860, 2520],
    locale: "en",
  },
  {
    name: "mobile sticky map",
    width: 390,
    height: 844,
    header: "68px",
    mapHeight: 280,
    readingLine: 396,
    tops: [1200, 1605, 2010],
    locale: "tr",
  },
  {
    name: "narrow mobile EN",
    width: 320,
    height: 720,
    header: "68px",
    mapHeight: 250,
    readingLine: 366,
    tops: [1200, 1690, 2270],
    locale: "en",
  },
  {
    name: "mobile large-map cap",
    width: 390,
    height: 844,
    header: "68px",
    mapHeight: 1000,
    readingLine: 780,
    tops: [1200, 1605, 2010],
    locale: "tr",
  },
  {
    name: "mobile at650 height",
    width: 390,
    height: 650,
    header: "68px",
    mapHeight: 240,
    readingLine: 356,
    tops: [1200, 1520, 1840],
    locale: "tr",
  },
  {
    name: "mobile649 short fallback",
    width: 390,
    height: 649,
    header: "68px",
    mapHeight: 500,
    readingLine: 213.25,
    tops: [1200, 1480, 1760],
    locale: "en",
  },
  {
    name: "landscape short fallback",
    width: 640,
    height: 390,
    header: "68px",
    mapHeight: 1000,
    readingLine: 164,
    tops: [1200, 1480, 1840],
    locale: "tr",
  },
  {
    name: "768 width excludes mobile map",
    width: 768,
    height: 900,
    header: "84px",
    mapHeight: 500,
    readingLine: 284,
    tops: [1200, 1690, 2180],
    locale: "en",
  },
  {
    name: "invalid header fallback",
    width: 1440,
    height: 900,
    header: "invalid",
    readingLine: 284,
    tops: [1200, 1800, 2400],
    locale: "tr",
  },
  {
    name: "fractional compact map height",
    width: 390,
    height: 844,
    header: "68px",
    mapHeight: 293.67643,
    readingLine: 409.67643,
    tops: [1200, 1605, 2010],
    locale: "en",
  },
]

for (const layout of layouts) {
  await scenario(layout.name, () => {
    const h = harness(layout)
    equal(h.active, 0, "Before the chapter the first state must be selected")
    const offset = Number.parseFloat(
      h.style.getPropertyValue("--operations-reading-offset"),
    )
    check(
      Math.abs(
        offset +
          (Number.parseFloat(layout.header) || 84) +
          24 -
          layout.readingLine,
      ) < 0.001,
      "Heading anchor margin plus root scroll padding must equal the measured map reading line",
    )
    for (let stage = 1; stage < 3; stage++) {
      const threshold = layout.tops[stage] - layout.readingLine
      equal(
        h.scrollTo(threshold - 0.1),
        stage - 1,
        "Next stage cannot advance before its own heading reaches the reading line",
      )
      equal(
        h.scrollTo(threshold),
        stage,
        "Map state must advance exactly at the actual next heading",
      )
      equal(
        h.scrollTo(threshold + 0.1),
        stage,
        "State must remain stable just after the heading",
      )
      h.idle()
    }
    equal(
      h.scrollTo(layout.tops[2] + 10000),
      2,
      "After the chapter the final state must be clamped",
    )
    equal(
      h.scrollTo(layout.tops[2] - layout.readingLine - 0.1),
      1,
      "Reverse scrolling must return to the previous heading state",
    )
    equal(
      h.scrollTo(layout.tops[1] - layout.readingLine - 0.1),
      0,
      "Reverse scrolling must return to the first state",
    )
    equal(
      h.scrollTo(-10000),
      0,
      "Before the chapter state cannot become negative",
    )
    assert.deepEqual(
      h.changes,
      [0, 1, 2, 1, 0],
      "Only the single heading-derived state source should change",
    )
    assertions++
    equal(
      h.measurements,
      3,
      "Scrolling must reuse the measured document heading positions",
    )
    const mobile = layout.width < 768 && layout.height >= 650
    equal(
      h.mapMeasurements,
      mobile ? 1 : 0,
      "Only the compact sticky layout may use map height for the reading line",
    )
    for (let index = 0; index < 3; index++)
      equal(
        h.nativeAnchor(index),
        index,
        "Native progress anchors must choose their own heading state",
      )
    h.cleanup()
    equal(h.window.count, 0, "Every tested layout must clean up listeners")
    equal(
      h.style.getPropertyValue("--operations-reading-offset"),
      "",
      "Cleanup must remove an offset that was absent before mount",
    )
    return {
      viewportFixture: [layout.width, layout.height],
      readingLine: layout.readingLine,
      observedStates: h.changes,
      pendingFrames: h.frames.size,
    }
  })
}

for (const [scroll, expected] of [
  [0, 0],
  [1600, 1],
  [2300, 2],
]) {
  await scenario(`direct initial scroll${scroll}`, () => {
    const h = harness({ scroll })
    equal(
      h.active,
      expected,
      "Deep/restored document must select the right stage before any scroll event",
    )
    equal(h.frames.size, 0, "Initial state selection must not begin a loop")
    h.idle()
    h.cleanup()
    return {
      initialScroll: scroll,
      selectedStage: expected,
      pendingFrames: h.frames.size,
    }
  })
}

await scenario("coalesced wheel / PageDown / reverse", () => {
  const h = harness()
  h.window.scrollY = 1600
  h.window.emit("scroll")
  h.window.scrollY = 2300
  h.window.emit("scroll")
  h.window.emit("scroll")
  equal(
    h.frames.size,
    1,
    "Rapid scroll notifications must share one queued frame",
  )
  equal(h.active, 0, "The old state remains until the coalesced frame runs")
  equal(
    h.step(),
    2,
    "The coalesced frame must use the latest document scroll position",
  )
  equal(
    h.scrollTo(1600),
    1,
    "Reverse PageDown must use actual heading position",
  )
  equal(h.scrollTo(0), 0, "Reverse to the initial reading stop must be exact")
  h.idle()
  h.cleanup()
  return { observedStates: h.changes, pendingFrames: h.frames.size }
})

await scenario("resize / font / observer / hash / restored page", async () => {
  const h = harness({ scroll: 1600 })
  equal(h.active, 1, "Fixture starts at the second step")
  h.setTops([1200, 2100, 2850])
  const before = h.measurements
  h.window.emit("resize")
  h.observers[0].callback()
  await h.resolveFonts()
  equal(
    h.frames.size,
    1,
    "Resize, font and observer notifications must coalesce",
  )
  equal(h.step(), 0, "Changed heading positions must correct the state")
  equal(
    h.measurements,
    before + 3,
    "Coalesced measurement must read each of the three headings once",
  )
  h.window.scrollY = 2600
  h.window.emit("hashchange")
  equal(
    h.step(),
    2,
    "A native anchor destination must refresh heading selection",
  )
  h.window.scrollY = 1900
  h.window.emit("pageshow")
  equal(
    h.step(),
    1,
    "Restored document position must choose its actual reading step",
  )
  h.idle()
  h.cleanup()
  return { observedStates: h.changes, pendingFrames: h.frames.size }
})

await scenario("mobile map size / short-height boundary", () => {
  const h = harness({
    width: 390,
    height: 844,
    header: "68px",
    mapHeight: 250,
    scroll: 1410,
  })
  equal(
    h.active,
    0,
    "Heading below the compact map reading line must remain on stage01",
  )
  h.setMapHeight(320)
  h.observers[0].callback()
  equal(
    h.step(),
    1,
    "A changed compact map height must update the shared reading state",
  )
  h.window.innerHeight = 649
  h.window.emit("resize")
  equal(h.step(), 0, "Short-height layout must stop using sticky map height")
  h.window.innerHeight = 650
  h.window.emit("resize")
  equal(
    h.step(),
    1,
    "Returning to sticky height must remeasure its map reading line",
  )
  h.idle()
  h.cleanup()
  return { observedStates: h.changes, pendingFrames: h.frames.size }
})

await scenario("ResizeObserver unavailable", async () => {
  const h = harness({ resizeObserver: false })
  equal(
    h.scrollTo(2300),
    2,
    "Native scroll must remain functional without ResizeObserver",
  )
  h.setTops([1200, 2800, 3400])
  h.window.emit("resize")
  await h.resolveFonts()
  equal(
    h.step(),
    0,
    "Resize/font fallback must still refresh the heading layout",
  )
  h.cleanup()
  equal(h.window.count, 0, "Fallback listeners must clean up")
  return { observedStates: h.changes, pendingFrames: h.frames.size }
})

await scenario("cleanup / pending frame / late fonts", async () => {
  const h = harness()
  equal(
    h.observers[0].targets.size,
    2,
    "Section/body ResizeObserver targets must be registered",
  )
  h.window.scrollY = 2300
  h.window.emit("scroll")
  const stale = [...h.frames.values()]
  const updates = h.changes.length
  const measures = h.measurements
  h.cleanup()
  equal(h.frames.size, 0, "Cleanup must cancel a pending animation frame")
  equal(
    h.window.count,
    0,
    "Cleanup must remove scroll, resize, pageshow and hashchange listeners",
  )
  check(
    h.observers[0].disconnected && h.observers[0].targets.size === 0,
    "Cleanup must disconnect both observed layout targets",
  )
  await h.resolveFonts()
  h.window.emit("resize")
  h.window.emit("scroll")
  for (const callback of stale) callback(20000)
  equal(
    h.changes.length,
    updates,
    "Late callbacks cannot update an unmounted state",
  )
  equal(h.measurements, measures, "Late callbacks cannot read a cleaned layout")
  equal(h.frames.size, 0, "Late fonts/events cannot revive a frame loop")
  equal(
    h.style.getPropertyValue("--operations-reading-offset"),
    "",
    "Late callbacks cannot restore a removed anchor offset",
  )
  return { pendingFrames: h.frames.size, listeners: h.window.count }
})

await scenario("existing inline reading offset restore", async () => {
  const h = harness({ initialOffset: "123.50px", initialPriority: "important" })
  equal(
    h.style.getPropertyValue("--operations-reading-offset"),
    "176px",
    "Measured offset must replace the old value while mounted",
  )
  equal(
    h.style.getPropertyPriority("--operations-reading-offset"),
    "",
    "Measured offset uses its normal priority",
  )
  h.cleanup()
  equal(
    h.style.getPropertyValue("--operations-reading-offset"),
    "123.50px",
    "Cleanup must restore the pre-existing exact CSS value",
  )
  equal(
    h.style.getPropertyPriority("--operations-reading-offset"),
    "important",
    "Cleanup must restore the pre-existing CSS priority",
  )
  await h.resolveFonts()
  equal(
    h.style.getPropertyValue("--operations-reading-offset"),
    "123.50px",
    "Late fonts must leave the restored inline value untouched",
  )
  return {
    pendingFrames: h.frames.size,
    restoredValue: "123.50px",
    restoredPriority: "important",
  }
})

for (const options of [{ missingScope: true }, { headingCount: 2 }]) {
  await scenario(
    options.missingScope ? "missing scope" : "incomplete headings",
    () => {
      const h = harness(options)
      equal(
        h.changes.length,
        0,
        "Missing required markup must skip state mutation",
      )
      equal(
        h.window.count,
        0,
        "Missing required markup cannot leave event listeners",
      )
      equal(
        h.frames.size,
        0,
        "Missing required markup cannot start an animation loop",
      )
      h.cleanup()
      return { pendingFrames: 0, listeners: 0 }
    },
  )
}

const report = {
  checkedAt: new Date().toISOString(),
  method:
    "Actual useOperationsScroll.ts transpiled with TypeScript; mocked React effect/state setter; controlled RAF queue; synthetic document heading positions and compact-map bounding boxes",
  browserTest: false,
  limitations:
    "Source/event simulation only. Does not test native browser layout, sticky geometry, CSS opacity crossfade, GSAP, touch input, or the rendered visual result; no alternate browser or browser-policy workaround used.",
  sourceHashes: {
    [sourceFile]: createHash("sha256").update(source).digest("hex"),
  },
  assertions,
  passed: true,
  caseCount: cases.length,
  cases,
}
await writeFile(
  path.join(root, "docs/screenshots/operations-scroll-checks.json"),
  `${JSON.stringify(report, null, 2)}\n`,
)
console.log(
  `PASS: ${assertions} controlled-source assertions across ${cases.length} operation scenarios; browserTest=false`,
)
