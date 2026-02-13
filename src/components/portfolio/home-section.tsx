import { usePortfolio } from '@/contexts/PortfolioContext'

interface HomeSectionProps {
  onSeeProjects?: () => void
}

export function HomeSection({ onSeeProjects }: HomeSectionProps) {
  const { content } = usePortfolio()
  const home = content.home

  return (
    <>
      <section className="space-y-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          {home.heroTitle}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {home.heroSubtitle}
        </p>
        <p className="max-w-2xl text-muted-foreground">
          {home.heroDescription}
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onSeeProjects}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {home.button1Text}
          </button>
          <a
            href="#"
            className="rounded-lg border border-border bg-card/50 px-6 py-3 font-medium transition-colors hover:bg-card hover:text-foreground"
          >
            {home.button2Text}
          </a>
        </div>
      </section>

      {home.skills.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Umiejętności
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-wrap gap-2">
            {home.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
