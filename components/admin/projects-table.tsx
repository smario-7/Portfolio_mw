'use client'

import { Edit, Trash2 } from 'lucide-react'

const projects = [
  { id: 1, name: 'System AI do analizy danych', category: 'AI', date: '2024-01-15' },
  { id: 2, name: 'Platforma e-commerce', category: 'Frontend', date: '2024-01-10' },
  { id: 3, name: 'Narzędzie do automatyzacji', category: 'Backend', date: '2024-01-05' },
  { id: 4, name: 'Dashboard analityczny', category: 'Data', date: '2023-12-28' },
  { id: 5, name: 'Aplikacja mobilna', category: 'Frontend', date: '2023-12-20' },
]

export function ProjectsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm">
      <table className="w-full">
        <thead className="border-b border-border bg-card/80">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nazwa</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Kategoria</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Data</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-card/80 transition-colors">
              <td className="px-6 py-4 text-sm text-foreground">{project.name}</td>
              <td className="px-6 py-4 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {project.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(project.date).toLocaleDateString('pl-PL')}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-card hover:text-foreground transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
