import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { toast } from 'sonner'

const INITIAL_ITEMS = [1, 2, 3, 4, 5, 6]

export default function AdminMedia() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = () => {
    if (deleteId == null) return
    setItems((prev) => prev.filter((id) => id !== deleteId))
    setDeleteId(null)
    toast.success('Plik usunięty')
  }

  const handleUploadClick = () => {
    toast.info('Funkcja uploadu będzie dostępna po integracji z backendem.')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Media</h1>
        <p className="text-muted-foreground">Zarządzaj swoimi zdjęciami i plikami</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={handleUploadClick}
        onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
        className="rounded-lg border-2 border-dashed border-border bg-card/30 p-12 text-center hover:border-primary transition-colors cursor-pointer"
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-foreground font-medium mb-1">Przeciągnij pliki tutaj</p>
        <p className="text-sm text-muted-foreground">lub kliknij aby wybrać</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="group relative aspect-square rounded-lg border-2 border-border bg-card/50 overflow-hidden hover:border-primary transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs bg-background/80 backdrop-blur-sm rounded px-2 py-1">Plik {item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive/20"
                onClick={() => setDeleteId(item)}
                aria-label="Usuń plik"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteId != null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć plik?</AlertDialogTitle>
            <AlertDialogDescription>
              Plik zostanie trwale usunięty. Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
