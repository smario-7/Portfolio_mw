/**
 * Konkretne typy błędów domenowych. Każdy ma code do logowania i rozróżniania,
 * oraz opcjonalnie cause (oryginalny błąd). Komunikaty dla użytkownika są w report-error.
 */

export const ErrorCodes = {
  CONTENT_SAVE: 'CONTENT_SAVE',
  PROJECTS_SAVE: 'PROJECTS_SAVE',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PROJECT_DELETE: 'PROJECT_DELETE',
  PROJECT_STORAGE_DELETE: 'PROJECT_STORAGE_DELETE',
  PROJECT_LOAD: 'PROJECT_LOAD',
  PROJECT_ORDER_SAVE: 'PROJECT_ORDER_SAVE',
  DATA_LOAD: 'DATA_LOAD',
  DATA_LOAD_TIMEOUT: 'DATA_LOAD_TIMEOUT',
  DATA_MIGRATION: 'DATA_MIGRATION',
  PAGE_VIEWS_LOAD: 'PAGE_VIEWS_LOAD',
  PAGE_VIEWS_DELETE: 'PAGE_VIEWS_DELETE',
  PAGE_VIEW_RECORD: 'PAGE_VIEW_RECORD',
  CONTACT_MESSAGES_LOAD: 'CONTACT_MESSAGES_LOAD',
  CONTACT_MESSAGE_DELETE: 'CONTACT_MESSAGE_DELETE',
  CODE_FRAGMENT_LOAD: 'CODE_FRAGMENT_LOAD',
  HTTP_REQUEST: 'HTTP_REQUEST',
  PROFANITY_LIST_LOAD: 'PROFANITY_LIST_LOAD',
  APP_INIT: 'APP_INIT',
  GLOBAL_ERROR: 'GLOBAL_ERROR',
  UNHANDLED_REJECTION: 'UNHANDLED_REJECTION',
  ERROR_BOUNDARY: 'ERROR_BOUNDARY',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

export interface AppErrorBase extends Error {
  code: ErrorCode
  cause?: unknown
}

export class ContentSaveError extends Error implements AppErrorBase {
  code = ErrorCodes.CONTENT_SAVE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ContentSaveError'
    this.cause = cause
  }
}

export class ProjectsSaveError extends Error implements AppErrorBase {
  code = ErrorCodes.PROJECTS_SAVE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProjectsSaveError'
    this.cause = cause
  }
}

export class ProjectUpdateError extends Error implements AppErrorBase {
  code = ErrorCodes.PROJECT_UPDATE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProjectUpdateError'
    this.cause = cause
  }
}

export class ProjectDeleteError extends Error implements AppErrorBase {
  code = ErrorCodes.PROJECT_DELETE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProjectDeleteError'
    this.cause = cause
  }
}

export class ProjectStorageDeleteError extends Error implements AppErrorBase {
  code = ErrorCodes.PROJECT_STORAGE_DELETE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProjectStorageDeleteError'
    this.cause = cause
  }
}

export class ProjectLoadError extends Error implements AppErrorBase {
  code = ErrorCodes.PROJECT_LOAD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProjectLoadError'
    this.cause = cause
  }
}

export class ProjectOrderSaveError extends Error implements AppErrorBase {
  code = ErrorCodes.PROJECT_ORDER_SAVE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProjectOrderSaveError'
    this.cause = cause
  }
}

export class DataLoadError extends Error implements AppErrorBase {
  code = ErrorCodes.DATA_LOAD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'DataLoadError'
    this.cause = cause
  }
}

export class DataLoadTimeoutError extends Error implements AppErrorBase {
  code = ErrorCodes.DATA_LOAD_TIMEOUT
  constructor(message: string) {
    super(message)
    this.name = 'DataLoadTimeoutError'
  }
}

export class DataMigrationError extends Error implements AppErrorBase {
  code = ErrorCodes.DATA_MIGRATION
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'DataMigrationError'
    this.cause = cause
  }
}

export class PageViewsLoadError extends Error implements AppErrorBase {
  code = ErrorCodes.PAGE_VIEWS_LOAD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'PageViewsLoadError'
    this.cause = cause
  }
}

export class PageViewsDeleteError extends Error implements AppErrorBase {
  code = ErrorCodes.PAGE_VIEWS_DELETE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'PageViewsDeleteError'
    this.cause = cause
  }
}

export class PageViewRecordError extends Error implements AppErrorBase {
  code = ErrorCodes.PAGE_VIEW_RECORD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'PageViewRecordError'
    this.cause = cause
  }
}

export class ContactMessagesLoadError extends Error implements AppErrorBase {
  code = ErrorCodes.CONTACT_MESSAGES_LOAD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ContactMessagesLoadError'
    this.cause = cause
  }
}

export class ContactMessageDeleteError extends Error implements AppErrorBase {
  code = ErrorCodes.CONTACT_MESSAGE_DELETE
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ContactMessageDeleteError'
    this.cause = cause
  }
}

export class CodeFragmentLoadError extends Error implements AppErrorBase {
  code = ErrorCodes.CODE_FRAGMENT_LOAD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'CodeFragmentLoadError'
    this.cause = cause
  }
}

export class HttpRequestError extends Error implements AppErrorBase {
  code = ErrorCodes.HTTP_REQUEST
  status: number
  cause?: unknown
  constructor(message: string, status: number, cause?: unknown) {
    super(message)
    this.name = 'HttpRequestError'
    this.status = status
    this.cause = cause
  }
}

export class ProfanityListLoadError extends Error implements AppErrorBase {
  code = ErrorCodes.PROFANITY_LIST_LOAD
  cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ProfanityListLoadError'
    this.cause = cause
  }
}

export function isAppError(err: unknown): err is AppErrorBase {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as AppErrorBase).code === 'string'
}

export function getErrorCode(err: unknown): ErrorCode | undefined {
  if (isAppError(err)) return err.code
  return undefined
}
