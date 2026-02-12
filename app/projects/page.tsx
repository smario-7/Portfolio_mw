'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { projects, PROJECT_FILTERS } from '@/lib/data/projects'
import type { ProjectFilter } from '@/lib/types'

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('Wszystkie')

  const filteredProjects =
    activeFilter === 'Wszystkie'
      ? projects
      : projects.filter((project) => project.category === activeFilter)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-8 py-16 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Powrót
          </Link>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Moje Projekty
            </h1>
            <p className="max-w-2xl text-xl text-muted-foreground">
              Tworzę systemy webowe, aplikacje AI i narzędzia do analizy danych.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {PROJECT_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
