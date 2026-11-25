import { profile, type Locale } from "../content"
import { routePath } from "../seo"

export function portfolioHref(
  locale: Locale,
  slug: string | null = null,
  anchor = "",
) {
  return (
    import.meta.env.BASE_URL.replace(/\/$/, "") +
    routePath(locale, slug) +
    (anchor ? "#" + anchor : "")
  )
}

export function emailHref(subject?: string, body?: string) {
  return (
    "mailto:" +
    profile.email +
    (subject
      ? "?subject=" +
        encodeURIComponent(subject) +
        (body ? "&body=" + encodeURIComponent(body) : "")
      : "")
  )
}
