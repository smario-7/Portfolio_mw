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

/** Klucz w sessionStorage, pod którym zapisywana jest ścieżka do przekierowania po odświeżeniu (np. przy logowaniu). */
export const REDIRECT_STORAGE_KEY = 'redirect'

/**
 * Zamienia pełną ścieżkę (z basename) na ścieżkę względem routera.
 * Np. /Portfolio_mw/admin/login + basename /Portfolio_mw → /admin/login
 */
export function pathRelativeToBasename(fullPath: string, basename: string | undefined): string {
  if (!basename || basename === '/') return fullPath
  if (fullPath.startsWith(basename)) return fullPath.slice(basename.length) || '/'
  return fullPath
}

/**
 * Sprawdza, czy ścieżka wygląda na wewnętrzną (bez open redirect).
 * Odrzuca m.in. //host (protocol-relative), https:..., javascript:...
 */
export function isSafeInternalPath(path: string): boolean {
  if (typeof path !== 'string' || path.length === 0) return false
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes(':')) return false
  return true
}
