'use client'

import { Upload, Trash2 } from 'lucide-react'
import { Sidebar } from '@/components/admin/sidebar'

export default function AdminMedia() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Media</h1>
            <p className="text-muted-foreground">Zarządzaj swoimi zdjęciami i plikami</p>
          </div>

          <div className="rounded-lg border-2 border-dashed border-border bg-card/30 p-12 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-1">Przeciągnij pliki tutaj</p>
            <p className="text-sm text-muted-foreground">lub kliknij aby wybrać</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="group relative aspect-square rounded-lg border border-border bg-card/50 overflow-hidden hover:border-primary transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-background/80 backdrop-blur-sm rounded px-2 py-1">Plik {item}</span>
                  <button className="p-2 bg-destructive/10 rounded-lg text-destructive hover:bg-destructive/20 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
