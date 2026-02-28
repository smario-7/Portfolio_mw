/**
 * Ścieżka bazowa aplikacji (fragment po origin) do budowania pełnych URL-i.
 * Pusta gdy aplikacja jest w rootzie, np. '/Portfolio_mw' gdy base to '/Portfolio_mw/'.
 */
export function getAppBasePath(): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  return base === '/' ? '' : base
}

/**
 * Pełny URL do podanej ścieżki route'a (origin + base path + path).
 * Poza przeglądarką (brak window) zwraca sam path.
 */
export function getFullUrlForRoute(routePath: string): string {
  if (typeof window === 'undefined') return routePath.startsWith('/') ? routePath : `/${routePath}`
  const path = routePath.startsWith('/') ? routePath : `/${routePath}`
  return `${window.location.origin}${getAppBasePath()}${path}`
}

/**
 * Wartość basename dla BrowserRouter – spójna z logiką Vite BASE_URL.
 */
export function getRouterBasename(): string | undefined {
  if (import.meta.env.DEV) return '/'
  const base = import.meta.env.BASE_URL ?? '/'
  return base === '/' ? undefined : base.replace(/\/$/, '')
}
