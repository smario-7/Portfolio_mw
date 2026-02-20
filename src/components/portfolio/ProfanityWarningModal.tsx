import { AppModal } from '@/components/shared'
import { useTabletModalContainer } from '@/contexts/TabletModalContainerContext'
import type { ProfanityFieldResult } from '@/lib/validation/profanity-filter'

interface ProfanityWarningModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profanityFields?: ProfanityFieldResult[]
}

const fieldNames: Record<string, string> = {
  name: 'Imię',
  email: 'Email',
  message: 'Wiadomość',
}

export function ProfanityWarningModal({
  open,
  onOpenChange,
  profanityFields = [],
}: ProfanityWarningModalProps) {
  const { container } = useTabletModalContainer()

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      container={container}
      overlayClassName="bg-black/30"
      contentClassName="max-w-[75vw] max-h-[75vh] w-full overflow-y-auto rounded-lg border-2 border-destructive bg-background/70 p-6 shadow-lg"
      aria-describedby="profanity-warning-desc"
    >
      <div
        id="profanity-warning-desc"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-destructive">
          Wykryto niecenzuralne słowa
        </h2>

        <div className="space-y-3">
          <p className="text-destructive">
            Formularz zawiera niecenzuralne słowa, które nie mogą być wysłane.
            Prosimy o usunięcie ich przed ponowną próbą wysłania wiadomości.
          </p>

          {profanityFields.length > 0 && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-destructive">
                Wykryte niecenzuralne słowa w polach:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {profanityFields.map((field, index) => (
                  <li key={index} className="flex flex-col gap-1">
                    <span className="font-medium text-destructive">
                      {fieldNames[field.field] || field.field}:
                    </span>
                    <span className="ml-4">
                      {field.words.join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Po usunięciu niecenzuralnych słów możesz ponownie spróbować wysłać wiadomość.
          </p>
        </div>
      </div>
    </AppModal>
  )
}
