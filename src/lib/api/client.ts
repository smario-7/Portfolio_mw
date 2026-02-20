const API_BASE =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : ''

/**
 * Wysyła żądanie do API (VITE_API_URL). Dla JSON ustawia Content-Type;
 * dla FormData nie nadpisuje nagłówków. Zwraca zparsowaną odpowiedź JSON
 * lub tekst w zależności od content-type.
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const isFormData = options?.body instanceof FormData
  
  const defaultHeaders: HeadersInit = isFormData
    ? {}
    : {
        'Content-Type': 'application/json',
      }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error((error as { error?: string })?.error || `HTTP error! status: ${response.status}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }

  return (await response.text()) as T
}
