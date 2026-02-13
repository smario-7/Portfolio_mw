import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

export default function AdminSettings() {
  const handleSave = () => {
    toast.success('Ustawienia zapisane')
  }

  return (
    <div className="max-w-2xl">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Ustawienia</h1>
            <p className="text-muted-foreground">Zarządzaj ustawieniami profilu</p>
          </div>
          <Button onClick={handleSave}>Zapisz ustawienia</Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
        <div className="space-y-6 pr-4">
          <div className="rounded-lg border-2 border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Konto</h2>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value="user@example.com"
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground disabled:opacity-50"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Nazwa</label>
                <input
                  type="text"
                  placeholder="Twoja nazwa"
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Powiadomienia</h2>
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
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
