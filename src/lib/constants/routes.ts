export const ADMIN_LOGIN = '/admin/login'
export const ADMIN_DASHBOARD = '/admin/dashboard'
export const ADMIN_PROJECTS = '/admin/projects'
export const ADMIN_CONTENT_HOME = '/admin/content/home'
export const ADMIN_CONTENT_ABOUT = '/admin/content/about'
export const ADMIN_CONTENT_CONTACT = '/admin/content/contact'
export const ADMIN_SETTINGS = '/admin/settings'

export function adminProject(id: number): string {
  return `/admin/projects/${id}`
}
