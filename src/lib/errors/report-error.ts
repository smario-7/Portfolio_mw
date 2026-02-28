import {
  ErrorCodes,
  getErrorCode,
  isAppError,
  type ErrorCode,
} from '@/lib/errors/app-errors'

export interface ReportErrorContext {
  context?: string
  userId?: string
  route?: string
  payload?: Record<string, unknown>
  componentStack?: string
}

const USER_MESSAGES: Partial<Record<ErrorCode, string>> = {
  [ErrorCodes.CONTENT_SAVE]: 'Zapis treści nie powiódł się, dane tylko w tej sesji.',
  [ErrorCodes.PROJECTS_SAVE]: 'Zapis listy projektów nie powiódł się, dane tylko w tej sesji.',
  [ErrorCodes.PROJECT_UPDATE]: 'Nie udało się zapisać projektu.',
  [ErrorCodes.PROJECT_DELETE]: 'Nie udało się usunąć projektu.',
  [ErrorCodes.PROJECT_STORAGE_DELETE]: 'Nie udało się usunąć plików projektu z magazynu.',
  [ErrorCodes.PROJECT_LOAD]: 'Nie udało się załadować projektu.',
  [ErrorCodes.PROJECT_ORDER_SAVE]: 'Nie udało się zapisać kolejności w bazie.',
  [ErrorCodes.DATA_LOAD]: 'Brak danych, nie połączono z bazą.',
  [ErrorCodes.DATA_LOAD_TIMEOUT]: 'Timeout podczas ładowania danych.',
  [ErrorCodes.DATA_MIGRATION]: 'Błąd podczas przetwarzania danych.',
  [ErrorCodes.PAGE_VIEWS_LOAD]: 'Nie udało się załadować listy odwiedzin.',
  [ErrorCodes.PAGE_VIEWS_DELETE]: 'Nie udało się usunąć wpisów.',
  [ErrorCodes.CONTACT_MESSAGES_LOAD]: 'Nie udało się załadować wiadomości.',
  [ErrorCodes.CONTACT_MESSAGE_DELETE]: 'Nie udało się usunąć wiadomości.',
  [ErrorCodes.CODE_FRAGMENT_LOAD]: 'Nie udało się załadować fragmentu kodu.',
  [ErrorCodes.HTTP_REQUEST]: 'Błąd połączenia z serwerem.',
  [ErrorCodes.PROFANITY_LIST_LOAD]: 'Błąd wczytywania listy słów (walidacja może być ograniczona).',
  [ErrorCodes.APP_INIT]: 'Błąd ładowania aplikacji.',
  [ErrorCodes.GLOBAL_ERROR]: 'Wystąpił nieoczekiwany błąd.',
  [ErrorCodes.UNHANDLED_REJECTION]: 'Wystąpił nieoczekiwany błąd (obietnica).',
  [ErrorCodes.ERROR_BOUNDARY]: 'Wystąpił błąd w komponencie.',
}

function formatForLog(err: unknown, ctx?: ReportErrorContext): string {
  const parts: string[] = []
  if (ctx?.context) parts.push(`context=${ctx.context}`)
  if (ctx?.route) parts.push(`route=${ctx.route}`)
  if (ctx?.userId) parts.push(`userId=${ctx.userId}`)
  const prefix = parts.length > 0 ? `[${parts.join(' ')}] ` : ''

  if (err instanceof Error) {
    const code = getErrorCode(err)
    const codeStr = code ? ` code=${code}` : ''
    const causeStr =
      isAppError(err) && err.cause != null
        ? ` cause=${err.cause instanceof Error ? err.cause.message : String(err.cause)}`
        : ''
    return `${prefix}${err.name}: ${err.message}${codeStr}${causeStr}`
  }
  return `${prefix}${String(err)}`
}

/**
 * Centralne raportowanie błędu: loguje z kontekstem (w przyszłości można dodać Sentry).
 * Zwraca komunikat dla użytkownika (do toastu lub setError).
 */
export function reportError(err: unknown, ctx?: ReportErrorContext): string {
  const logLine = formatForLog(err, ctx)
  if (import.meta.env.DEV) {
    console.error('reportError:', logLine, err)
  } else {
    console.error('reportError:', logLine)
  }
  if (ctx?.componentStack && import.meta.env.DEV) {
    console.error('Component stack:', ctx.componentStack)
  }

  const code = getErrorCode(err)
  if (code && USER_MESSAGES[code]) {
    return USER_MESSAGES[code] as string
  }
  if (err instanceof Error && err.message) {
    return err.message
  }
  return 'Wystąpił nieoczekiwany błąd.'
}
