const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Zamienia znaki specjalne HTML na encje, aby bezpiecznie wstawić tekst do innerHTML.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char)
}
