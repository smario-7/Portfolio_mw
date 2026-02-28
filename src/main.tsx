import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { reportError } from '@/lib/errors'
import { escapeHtml } from '@/lib/utils/escape-html'

if (document.body) {
  document.body.classList.add('loaded')
  document.body.style.visibility = 'visible'
}

function showError(error: unknown, context: string = 'app_init') {
  const userMessage = reportError(error, { context })

  if (document.body) {
    document.body.classList.add('loaded')
    document.body.style.visibility = 'visible'

    const rootElement = document.getElementById('root')
    if (rootElement) {
      const errorStack = error instanceof Error ? error.stack : undefined
      const safeMessage = escapeHtml(userMessage)
      const safeStack = errorStack ? escapeHtml(errorStack) : ''

      rootElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, sans-serif; background: #0a0a0a; color: #fff;">
          <div style="text-align: center; max-width: 600px;">
            <h1 style="color: #ef4444; margin-bottom: 16px; font-size: 24px;">Błąd ładowania aplikacji</h1>
            <p style="color: #9ca3af; margin-bottom: 16px; font-size: 16px;">Wystąpił błąd podczas inicjalizacji aplikacji.</p>
            <div style="background: #1f2937; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
              <p style="color: #d1d5db; font-size: 14px; margin-bottom: 8px;"><strong>Błąd:</strong></p>
              <pre style="color: #ef4444; font-size: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; margin-bottom: 12px;">${safeMessage}</pre>
              ${safeStack ? `<details style="margin-top: 12px;"><summary style="color: #9ca3af; cursor: pointer; font-size: 12px;">Stack trace</summary><pre style="color: #6b7280; font-size: 11px; margin-top: 8px; overflow-x: auto; white-space: pre-wrap;">${safeStack}</pre></details>` : ''}
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">Sprawdź konsolę przeglądarki (F12) aby zobaczyć szczegóły.</p>
            <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">
              Odśwież stronę
            </button>
          </div>
        </div>
      `
    }
  }
}

window.addEventListener('error', (event) => {
  reportError(event.error || new Error(String(event.message)), { context: 'global_error' })
  if (!document.getElementById('root')?.innerHTML) {
    showError(event.error || event.message, 'global_error')
  }
})

window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason, { context: 'unhandled_rejection' })
  if (!document.getElementById('root')?.innerHTML) {
    showError(event.reason, 'unhandled_rejection')
  }
})

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element #root not found')
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  showError(error)
}
