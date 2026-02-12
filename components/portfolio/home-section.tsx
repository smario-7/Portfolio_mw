export function HomeSection() {
  return (
    <>
      <section className="space-y-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Cześć, jestem
          <br />
          Mariusz Wysogląd
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Tworzę systemy webowe, aplikacje AI i narzędzia do analizy danych.
          Specjalizuję się w budowaniu wydajnych rozwiązań wykorzystujących
          nowoczesne technologie i machine learning.
        </p>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Doświadczenie
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-6xl font-bold">02</span>
            <span className="text-lg text-muted-foreground">lat</span>
          </div>
          <p className="text-muted-foreground">
            doświadczenia w tworzeniu aplikacji webowych i systemów AI
          </p>
        </div>
      </section>
    </>
  )
}
