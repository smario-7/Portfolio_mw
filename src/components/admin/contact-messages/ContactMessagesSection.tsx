import { useCallback, useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'
import { ContactMessageDetailModal } from '@/components/admin/contact-messages/ContactMessageDetailModal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import * as contactMessagesService from '@/lib/services/contact-messages-service'
import type { ContactMessage } from '@/lib/types'
import { ContactMessagesLoadError, ContactMessageDeleteError, reportError } from '@/lib/errors'

function formatDateTime(value: string | null): string {
  if (value == null) return '—'
  try {
    return format(parseISO(value), 'yyyy-MM-dd HH:mm')
  } catch {
    return value
  }
}

export function ContactMessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)
  const [detailMessage, setDetailMessage] = useState<ContactMessage | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    contactMessagesService.getContactMessages()
      .then(setMessages)
      .catch((err) => {
        const msg = reportError(new ContactMessagesLoadError('getContactMessages', err), {
          context: 'contact_messages_load',
        })
        setMessages([])
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const allSelected =
    messages.length > 0 && selectedIds.size === messages.length
  const someSelected = selectedIds.size > 0

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(messages.map((m) => m.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const messageToDelete = deleteId != null ? messages.find((m) => m.id === deleteId) : null

  const handleConfirmDelete = async () => {
    if (deleteId == null) return
    try {
      await contactMessagesService.deleteContactMessage(deleteId)
      setDeleteId(null)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(deleteId)
        return next
      })
      load()
      toast.success('Wiadomość usunięta')
    } catch (error) {
      const msg = reportError(
        new ContactMessageDeleteError('deleteContactMessage', error),
        { context: 'contact_messages_delete_one' }
      )
      toast.error(msg)
    }
  }

  const handleConfirmBulkDelete = async () => {
    const ids = [...selectedIds]
    if (ids.length === 0) return
    try {
      await contactMessagesService.deleteContactMessages(ids)
      setSelectedIds(new Set())
      setShowBulkDelete(false)
      load()
      toast.success(`Usunięto ${ids.length} wiadomości`)
    } catch (error) {
      const msg = reportError(
        new ContactMessageDeleteError('deleteContactMessages bulk', error),
        { context: 'contact_messages_bulk_delete' }
      )
      toast.error(msg)
    }
  }

  return (
    <AdminSectionCard
      title="Wiadomości z formularza"
      description="Lista wiadomości wysłanych przez użytkowników. Kliknij wiersz, aby zobaczyć treść. Zaznacz wiele, aby usunąć zbiorczo."
    >
      {someSelected && (
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Zaznaczono: {selectedIds.size}
          </span>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowBulkDelete(true)}
          >
            Usuń zaznaczone
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            Odznacz wszystkie
          </Button>
        </div>
      )}

      <ScrollArea className="h-[460px] rounded-lg border-2 border-border">
        <div className="min-w-0">
          <table className="w-full">
            <thead className="sticky top-0 z-10 border-b-2 border-border bg-card/80 backdrop-blur-sm">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      toggleSelectAll(checked === true)
                    }
                    aria-label="Zaznacz wszystkie"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Imię
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Data przesłania
                </th>
                <th className="w-14 px-4 py-3 text-center text-sm font-semibold text-foreground">
                  Wysłano
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Data maila do admina
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Ładowanie…
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Brak wiadomości.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="transition-colors hover:bg-card/80 cursor-pointer"
                    onClick={() => setDetailMessage(msg)}
                  >
                    <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(msg.id)}
                        onCheckedChange={(checked) =>
                          toggleSelect(msg.id, checked === true)
                        }
                        aria-label={`Zaznacz wiadomość od ${msg.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {msg.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {msg.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDateTime(msg.created_at)}
                    </td>
                    <td className="w-14 px-4 py-3 text-center">
                      <Checkbox
                        checked={msg.processed}
                        disabled
                        aria-label={msg.processed ? 'Wysłano' : 'Nie wysłano'}
                        className="pointer-events-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDateTime(msg.processed_at)}
                    </td>
                    <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setDeleteId(msg.id)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Usuń wiadomość"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>

      <ContactMessageDetailModal
        open={detailMessage != null}
        onOpenChange={(open) => !open && setDetailMessage(null)}
        message={detailMessage}
      />

      <AlertDialog
        open={deleteId != null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno usunąć wiadomość?</AlertDialogTitle>
            <AlertDialogDescription>
              {messageToDelete
                ? `Wiadomość od „${messageToDelete.name}” zostanie trwale usunięta.`
                : 'Ta operacja jest nieodwracalna.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć zaznaczone wiadomości?</AlertDialogTitle>
            <AlertDialogDescription>
              Zostanie trwale usuniętych {selectedIds.size} wiadomości. Tej
              operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń {selectedIds.size}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminSectionCard>
  )
}
