import {
  Briefcase,
  Code,
  Zap,
  GitBranch,
  Terminal,
  MessageCircle,
  Container,
} from 'lucide-react'

export function AboutSection() {
  return (
    <section className="space-y-16">
      <div className="space-y-8">
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          O mnie
        </h1>
        <div className="space-y-6 border-l-2 border-primary pl-6">
          <p className="text-lg leading-relaxed text-foreground">
            Projektuję aplikacje, które łączą frontend, backend i analizę danych w
            spójny system.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            Specjalizuję się w React, Python oraz rozwiązaniach opartych o AI.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            Buduję narzędzia, które automatyzują procesy i zwiększają
            efektywność.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Doświadczenie
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="hover-lift rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              Projekty komercyjne
            </h3>
            <p className="text-sm text-muted-foreground">
              Realizuję zaawansowane systemy dla startupów i dużych korporacji.
              Doświadczenie z pełnym cyklem developmentu od koncepcji do
              produkcji.
            </p>
          </div>
          <div className="hover-lift rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              Własne systemy
            </h3>
            <p className="text-sm text-muted-foreground">
              Tworzę i utrzymuję własne narzędzia i aplikacje open-source.
              Projektowanie architektur skalowanych na miliony użytkowników.
            </p>
          </div>
          <div className="hover-lift rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">
              Rozwiązania AI
            </h3>
            <p className="text-sm text-muted-foreground">
              Implementuję zaawansowane modele ML i systemy analizy danych.
              Integracja z najpopularniejszymi API AI i LLM.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Umiejętności techniczne
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Frontend',
              skills: [
                'React',
                'Next.js',
                'TypeScript',
                'Tailwind CSS',
                'Redux',
                'Framer Motion',
              ],
            },
            {
              title: 'Backend',
              skills: [
                'Node.js',
                'Python',
                'FastAPI',
                'PostgreSQL',
                'MongoDB',
                'GraphQL',
              ],
            },
            {
              title: 'Data & AI',
              skills: [
                'TensorFlow',
                'PyTorch',
                'Scikit-learn',
                'Pandas',
                'NLP',
                'Computer Vision',
              ],
            },
            {
              title: 'Narzędzia',
              skills: ['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'Linux'],
            },
          ].map((group) => (
            <div
              key={group.title}
              className="hover-lift rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary"
            >
              <h3 className="mb-4 font-semibold text-primary">{group.title}</h3>
              <ul className="grid gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-3"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Narzędzia & Technologie
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          {[
            { icon: GitBranch, label: 'Git' },
            { icon: Container, label: 'Docker' },
            { icon: Terminal, label: 'Ubuntu' },
            { icon: MessageCircle, label: 'OpenAI API' },
            { icon: Zap, label: 'n8n' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="hover-lift flex flex-col items-center gap-4 rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary hover:bg-card/50"
            >
              <Icon className="h-8 w-8 text-primary" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
