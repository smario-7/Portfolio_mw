import { AppModal } from '@/components/shared'
import { useTabletModalContainer } from '@/contexts/TabletModalContainerContext'

interface ContactRateLimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactRateLimitModal({
  open,
  onOpenChange,
}: ContactRateLimitModalProps) {
  const { container } = useTabletModalContainer()

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      container={container}
      overlayClassName="bg-black/30"
      contentClassName="max-w-[75vw] max-h-[75vh] w-full overflow-y-auto rounded-lg border-2 border-border bg-background/70 p-6 shadow-lg"
      aria-describedby="contact-rate-limit-desc"
    >
      <div
        id="contact-rate-limit-desc"
        className="space-y-4 text-pink-200"
      >
        <p>
          Przepraszamy, wystąpił nieoczekiwany problem z przesłaniem Twojej
          wiadomości.
        </p>
        <p>
          Ze względów bezpieczeństwa nasze systemy chwilowo zablokowały
          możliwość dodania nowego wpisu. Prosimy o odczekanie około 10 minut
          przed ponowną próbą. Jeśli sprawa jest pilna, możesz skontaktować się
          ze mną bezpośrednio, korzystając z danych kontaktowych lub linków
          powyżej. Dziękuję za cierpliwość!
        </p>
      </div>
    </AppModal>
  )
}
