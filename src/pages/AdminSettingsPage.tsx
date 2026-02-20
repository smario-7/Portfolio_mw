import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { getAdminSettings, saveAdminSettings } from '@/lib/api/admin-settings-api'
import { AdminPageContainer } from '@/components/admin/AdminPageContainer'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'
import { ContactMessagesSection } from '@/components/admin/contact-messages/ContactMessagesSection'

export default function AdminSettings() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true)
      try {
        const data = await getAdminSettings()
        if (data) {
          setEmail(data.email)
          setName(data.name)
        }
      } catch (_error) {
        toast.error('Nie udało się załadować ustawień')
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    const trimmedEmail = email.trim()
    const trimmedName = name.trim()
    
    if (!trimmedEmail || !trimmedName) {
      toast.error('Wypełnij wszystkie pola')
      return
    }
    
    setIsSaving(true)
    try {
      await saveAdminSettings({
        email: trimmedEmail,
        name: trimmedName,
      })
      toast.success('Ustawienia zapisane')
    } catch (_error) {
      toast.error('Nie udało się zapisać ustawień')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPageContainer>
      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Ustawienia</h1>
            <p className="text-muted-foreground">Zarządzaj ustawieniami profilu</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1 overflow-hidden">
          <div className="space-y-6 pr-4">
          <AdminSectionCard title="Konto">
            {isLoading ? (
              <p className="text-muted-foreground">Ładowanie ustawień...</p>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSaving}
                    className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground disabled:opacity-50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Nazwa</label>
                  <input
                    type="text"
                    placeholder="Twoja nazwa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                    className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            )}
          </AdminSectionCard>

          <AdminSectionCard title="Powiadomienia">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-foreground">Powiadomienia email</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-foreground">Cotygodniowe raporty</span>
              </label>
            </div>
          </AdminSectionCard>

          <ContactMessagesSection />
          </div>
        </ScrollArea>
      </div>
    </AdminPageContainer>
  )
}
