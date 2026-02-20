import { format, parseISO } from 'date-fns'
import { AppModal } from '@/components/shared'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ContactMessage } from '@/lib/types'

interface ContactMessageDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: ContactMessage | null
}

function formatDateTime(value: string | null): string {
  if (value == null) return '—'
  try {
    return format(parseISO(value), 'yyyy-MM-dd HH:mm')
  } catch {
    return value
  }
}

export function ContactMessageDetailModal({
  open,
  onOpenChange,
  message,
}: ContactMessageDetailModalProps) {
  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName="max-w-lg"
      aria-describedby="contact-message-detail-desc"
    >
      {message != null && (
          <>
            <DialogHeader>
              <DialogTitle>Wiadomość od {message.name}</DialogTitle>
              <DialogDescription id="contact-message-detail-desc">
                Szczegóły wiadomości z formularza kontaktowego.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Email: </span>
                <a
                  href={`mailto:${message.email}`}
                  className="text-primary underline hover:no-underline"
                >
                  {message.email}
                </a>
              </p>
              <p>
                <span className="text-muted-foreground">Data przesłania: </span>
                {formatDateTime(message.created_at)}
              </p>
              <p>
                <span className="text-muted-foreground">Data maila do admina: </span>
                {formatDateTime(message.processed_at)}
              </p>
              <div>
                <span className="text-muted-foreground block mb-1">Treść:</span>
                <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-foreground max-h-60 overflow-y-auto">
                  {message.message}
                </pre>
              </div>
            </div>
          </>
        )}
    </AppModal>
  )
}
