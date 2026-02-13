
import { Download, Github, ExternalLink, BarChart3 } from 'lucide-react'
import { usePortfolio } from '@/contexts/PortfolioContext'

interface ProjectDetailProps {
  projectId: number
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { projects } = usePortfolio()
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null


  return (
    <section className="space-y-12">
      <div className="space-y-6 border-b border-border pb-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 font-medium transition-colors hover:bg-card"
          >
            <ExternalLink className="h-4 w-4" />
            Demo
          </a>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 font-medium transition-colors hover:bg-card">
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Opis projektu</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            {project.fullDescription && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {project.fullDescription}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center rounded-lg border border-border bg-card/30 p-8">
            <div className="space-y-4 text-center">
              <BarChart3 className="mx-auto h-16 w-16 text-primary" />
              <p className="text-sm text-muted-foreground">Screenshot projektu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Architektura</h2>

        <div className="space-y-4">
          {[
            {
              title: 'Frontend',
              content: `React z TypeScript, Tailwind CSS dla stylizacji, Recharts dla wizualizacji danych, Redux do zarządzania stanem aplikacji.`,
              code: `interface DataPoint {
  timestamp: Date
  value: number
  category: string
}

const Dashboard = () => {
  const [data, setData] = useState<DataPoint[]>([])
  
  useEffect(() => {
    fetchAnalyticsData()
  }, [])
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <ChartComponent data={data} />
    </div>
  )
}`,
            },
            {
              title: 'Backend',
              content: `FastAPI z Python, PostgreSQL dla bazy danych, Redis do cachowania, Docker do konteneryzacji.`,
              code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.post("/api/analyze")
async def analyze_data(file: UploadFile):
    data = await file.read()
    results = ml_pipeline.process(data)
    return {"status": "success", "results": results}`,
            },
            {
              title: 'Integracje API',
              content: `AWS S3 do przechowywania plików, Stripe do obsługi płatności, SendGrid do wiadomości email.`,
              code: `import boto3

s3_client = boto3.client('s3')

def upload_to_s3(file_path, bucket_name):
    try:
        s3_client.upload_file(
            file_path,
            bucket_name,
            f"uploads/{Path(file_path).name}"
        )
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False`,
            },
          ].map((section, idx) => (
            <details
              key={idx}
              className="group rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary/50"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground">
                {section.title}
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">{section.content}</p>

                <div className="rounded-lg bg-background/50 p-4">
                  <pre className="overflow-x-auto text-sm text-muted-foreground">
                    <code>{section.code}</code>
                  </pre>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Analiza danych</h2>

        <div className="space-y-4 rounded-lg border border-border bg-card/30 p-6">
          <div className="space-y-2 border-b border-border pb-4">
            <div className="text-sm font-mono text-muted-foreground">
              notebooks/analysis.ipynb
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded bg-background/50 px-3 py-2 font-mono text-xs text-muted-foreground">
              [1]
            </div>
            <pre className="overflow-x-auto rounded-lg bg-background/50 p-4 text-sm text-muted-foreground">
              <code>{`import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Wczytanie danych
df = pd.read_csv('data.csv')
print(df.describe())`}</code>
            </pre>
          </div>

          <div className="space-y-3">
            <div className="rounded bg-background/50 px-3 py-2 font-mono text-xs text-muted-foreground">
              [1]
            </div>
            <div className="rounded-lg bg-background/50 p-4 text-sm text-muted-foreground">
              <div className="font-mono">
                Statistics Summary:
                <br />
                Mean: 1234.56
                <br />
                Std Dev: 234.12
                <br />
                Min: 100
                <br />
                Max: 5000
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded bg-background/50 px-3 py-2 font-mono text-xs text-muted-foreground">
              [3]
            </div>
            <div className="rounded-lg border border-border bg-background/50 p-8">
              <div className="flex items-center justify-center text-center">
                <div className="space-y-4">
                  <div className="flex items-end justify-center gap-2">
                    <div className="h-24 w-12 bg-primary/30 rounded" />
                    <div className="h-32 w-12 bg-primary/50 rounded" />
                    <div className="h-20 w-12 bg-primary/40 rounded" />
                    <div className="h-28 w-12 bg-primary/60 rounded" />
                    <div className="h-22 w-12 bg-primary/45 rounded" />
                  </div>
                  <p className="text-sm text-muted-foreground">Wykres rozkładu danych</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
