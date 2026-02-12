'use client'

import { Sidebar } from '@/components/admin/sidebar'

export default function AdminSettings() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Ustawienia</h1>
            <p className="text-muted-foreground">Zarządzaj ustawieniami profilu</p>
          </div>

          <div className="max-w-2xl space-y-6">
            <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Konto</h2>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value="user@example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground disabled:opacity-50"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Nazwa</label>
                  <input
                    type="text"
                    placeholder="Twoja nazwa"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
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

            <button className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Zapisz ustawienia
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
