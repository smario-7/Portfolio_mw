import { useParams, Navigate } from 'react-router-dom'
import { Check, Loader2, Save } from 'lucide-react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useContentForm } from '@/hooks/use-content-form'
import { VALID_SECTIONS, type Section } from '@/lib/constants/sections'
import { ContentHomeTab } from '@/components/admin/content/content-home-tab'
import { ContentAboutTab } from '@/components/admin/content/content-about-tab'
import { ContentContactTab } from '@/components/admin/content/content-contact-tab'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

function isValidSection(s: string | undefined): s is Section {
  return s != null && VALID_SECTIONS.includes(s as Section)
}

export default function ContentEditingPage() {
  const { section } = useParams<{ section: string }>()
  if (section !== undefined && !isValidSection(section)) {
    return <Navigate to="/admin/content/home" replace />
  }
  const activeSection: Section = (section as Section) ?? 'home'
  const { content: savedContent } = usePortfolio()
  const form = useContentForm({ initialContent: savedContent })

  return (
    <div className="w-full">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-sm border-b-2 border-border mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Edycja treści strony
            </h1>
            <p className="text-muted-foreground">
              Zarządzaj zawartością publicznych podstron
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={form.handleSave}
              disabled={form.saveStatus === 'saving' || !form.hasChanges}
              className="gap-2"
            >
              {form.saveStatus === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : form.saveStatus === 'saved' ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Zapisano
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Zapisz
                </>
              )}
            </Button>
            {form.lastSaved && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                Ostatnio: {form.lastSaved.toLocaleTimeString('pl-PL')}
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
        <div className="space-y-6 pr-4">
          {activeSection === 'home' && (
            <ContentHomeTab
              content={form.content}
              setContent={form.setContent}
              setHasChanges={() => {}}
              skillInput={form.skillInput}
              setSkillInput={form.setSkillInput}
              onAddSkill={form.handleAddSkill}
              onRemoveSkill={form.handleRemoveSkill}
            />
          )}
          {activeSection === 'about' && (
            <ContentAboutTab
              content={form.content}
              setContent={form.setContent}
              setHasChanges={() => {}}
              onAddCourse={form.handleAddCourse}
              onRemoveCourse={form.handleRemoveCourse}
            />
          )}
          {activeSection === 'contact' && (
            <ContentContactTab
              content={form.content}
              setContent={form.setContent}
              setHasChanges={() => {}}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
