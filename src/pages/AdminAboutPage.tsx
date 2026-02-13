import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminAbout() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">O mnie</h1>
        <p className="text-muted-foreground">Edytuj swoją biografię i umiejętności</p>
      </div>

      <div className="max-w-2xl rounded-lg border-2 border-border bg-card/50 backdrop-blur-sm p-8 space-y-6">
        <p className="text-sm text-muted-foreground">
          Treść sekcji „O mnie” (wprowadzenie, doświadczenie, kafelki, umiejętności i narzędzia)
          edytujesz w zakładce „O mnie” na stronie Edycja treści.
        </p>
        <Button asChild className="gap-2">
          <Link to="/admin/content">
            <BookOpen className="h-4 w-4" />
            Przejdź do Edycji treści
          </Link>
        </Button>
      </div>
    </div>
  )
}
