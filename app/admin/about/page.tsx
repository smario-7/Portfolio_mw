'use client'

import { Sidebar } from '@/components/admin/sidebar'

export default function AdminAbout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">O mnie</h1>
            <p className="text-muted-foreground">Edytuj swoją biografię i umiejętności</p>
          </div>

          <div className="max-w-2xl rounded-lg border border-border bg-card/50 backdrop-blur-sm p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Biografia</label>
              <textarea
                rows={6}
                placeholder="Wpisz swoją biografię..."
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Doświadczenie</label>
              <input
                type="text"
                placeholder="np. 5 lat"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Zapisz zmiany
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
