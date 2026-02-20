/**
 * Konwencja ścieżek plików projektów w storage.
 * Serwer zapisuje pliki w katalogu storage/ (root projektu); względem niego:
 *
 * - projects/{projectId}/  – katalog danego projektu. W chwili obecnej serwer zapisuje
 *   wszystkie pliki (PDF, obrazki, ipynb, .py) w tym katalogu płasko, bez podkatalogów.
 *
 * Docelowe podkatalogi (do wdrożenia w kolejnych etapach):
 * - projects/{id}/images/   – screenshot główny (project.image) i screeny z bloków pełnego opisu
 * - projects/{id}/attachments/ – PDF, ipynb, md (i ewentualnie .py)
 * - projects/{id}/code/    – pliki .py do fragmentów kodu w blokach
 *
 * W JSON przechowujemy tylko ścieżki (np. względem storage lub pełne), nie binaria.
 */

export function getProjectStorageBasePath(projectId: number): string {
  return `projects/${projectId}`
}

export function getProjectImagesPath(projectId: number): string {
  return `${getProjectStorageBasePath(projectId)}/images`
}

export function getProjectAttachmentsPath(projectId: number): string {
  return `${getProjectStorageBasePath(projectId)}/attachments`
}

export function getProjectCodePath(projectId: number): string {
  return `${getProjectStorageBasePath(projectId)}/code`
}
