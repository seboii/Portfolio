import React from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { parseRoute } from "./seo"

const root = document.getElementById("root")!
const route = parseRoute(window.location.pathname)
const app = (
  <React.StrictMode>
    <App initialLocale={route.locale} initialProjectSlug={route.projectSlug} />
  </React.StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
