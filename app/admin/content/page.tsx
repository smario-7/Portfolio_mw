'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/admin/sidebar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Check, Loader2, Clock } from 'lucide-react'
import type { ContentData } from '@/lib/types/content'
import { DEFAULT_CONTENT } from '@/lib/data/content-defaults'
import { ContentHomeTab } from '@/components/admin/content/content-home-tab'
import { ContentAboutTab } from '@/components/admin/content/content-about-tab'
import { ContentContactTab } from '@/components/admin/content/content-contact-tab'

export default function ContentEditingPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'idle' | 'saving' | 'saved'
  >('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  useEffect(() => {
    if (!hasChanges) return
    const timer = setTimeout(() => {
      performAutoSave()
    }, 3000)
    return () => clearTimeout(timer)
  }, [content, hasChanges])

  const performAutoSave = async () => {
    setAutoSaveStatus('saving')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
      setHasChanges(false)
      setTimeout(() => setAutoSaveStatus('idle'), 2000)
    } catch {
      setAutoSaveStatus('idle')
    }
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !content.home.skills.includes(skillInput.trim())) {
      setContent({
        ...content,
        home: {
          ...content.home,
          skills: [...content.home.skills, skillInput.trim()],
        },
      })
      setSkillInput('')
      setHasChanges(true)
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setContent({
      ...content,
      home: {
        ...content.home,
        skills: content.home.skills.filter((s) => s !== skill),
      },
    })
    setHasChanges(true)
  }

  const handleAddExperience = () => {
    setContent({
      ...content,
      about: {
        ...content.about,
        experience: [
          ...content.about.experience,
          {
            year: new Date().getFullYear().toString(),
            title: '',
            description: '',
          },
        ],
      },
    })
    setHasChanges(true)
  }

  const handleRemoveExperience = (index: number) => {
    setContent({
      ...content,
      about: {
        ...content.about,
        experience: content.about.experience.filter((_, i) => i !== index),
      },
    })
    setHasChanges(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Edycja treści strony
              </h1>
              <p className="text-muted-foreground">
                Zarządzaj zawartością publicznych podstron
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm">
                {autoSaveStatus === 'saving' && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">
                      Zapisywanie...
                    </span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Zapisano</span>
                  </>
                )}
              </div>
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {lastSaved.toLocaleTimeString('pl-PL')}
                </div>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="about">O mnie</TabsTrigger>
              <TabsTrigger value="contact">Kontakt</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <ContentHomeTab
                content={content}
                setContent={setContent}
                setHasChanges={setHasChanges}
                skillInput={skillInput}
                setSkillInput={setSkillInput}
                onAddSkill={handleAddSkill}
                onRemoveSkill={handleRemoveSkill}
              />
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <ContentAboutTab
                content={content}
                setContent={setContent}
                setHasChanges={setHasChanges}
                onAddExperience={handleAddExperience}
                onRemoveExperience={handleRemoveExperience}
              />
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <ContentContactTab
                content={content}
                setContent={setContent}
                setHasChanges={setHasChanges}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
