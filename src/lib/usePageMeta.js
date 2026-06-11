import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'https://groundstatesociety.com'
const DEFAULT_TITLE = 'The Ground State Society — The Private Network for Quantum Founders'

/*
 * Per-route document head: title, description, canonical, and an optional
 * robots noindex (the post-acceptance pages are not for crawlers). An SPA
 * has one <head> for five routes — without this, every route presents as
 * the homepage to assistive tech (WCAG 2.4.2) and to search.
 */
export default function usePageMeta({ title, description, noindex = false } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title ? `${title} — The Ground State Society` : DEFAULT_TITLE

    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.href = SITE + (pathname === '/' ? '/' : pathname)

    let robots = document.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.name = 'robots'
        document.head.appendChild(robots)
      }
      robots.content = 'noindex'
    } else if (robots) {
      robots.remove()
    }
  }, [title, description, noindex, pathname])
}
