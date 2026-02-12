import { Mail, Github, Twitter } from 'lucide-react'

export function ContactSection() {
  return (
    <section className="space-y-8">
      <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
        Skontaktuj się
      </h2>

      <div className="space-y-8">
        <p className="text-lg leading-relaxed text-muted-foreground">
          Szukasz kogoś do współpracy? Mam otwarte zainteresowanie dla ciekawych
          projektów, freelance&apos;u czy pełnoetatowego stanowiska. Napisz do
          mnie!
        </p>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Bezpośrednie linki</h3>
            <div className="space-y-3">
              <a
                href="mailto:hello@example.com"
                className="hover-lift-sm flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-primary/30 hover:bg-card"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    hello@example.com
                  </div>
                </div>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-lift-sm flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-primary/30 hover:bg-card"
              >
                <Github className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">
                    github.com/michaelwolski
                  </div>
                </div>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-lift-sm flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-primary/30 hover:bg-card"
              >
                <Twitter className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Twitter</div>
                  <div className="text-sm text-muted-foreground">
                    @michalbw
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Forma kontaktu</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Twoje imię"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="email"
                placeholder="Twój email"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Twoja wiadomość"
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Wyślij wiadomość
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
