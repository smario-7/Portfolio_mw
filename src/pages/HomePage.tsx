import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Code, Briefcase, User, Mail, LogIn, Power } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTabletScreenQuad } from '@/hooks/use-tablet-screen-quad'
import { useProjectsZoom } from '@/hooks/use-projects-zoom'
import { TabletScene } from '@/components/portfolio/tablet-scene'
import { ProjectsZoomOverlay } from '@/components/portfolio/projects-zoom-overlay'
import { ProjectsZoomTrigger } from '@/components/portfolio/projects-zoom-trigger'
import { HomeSection } from '@/components/portfolio/home-section'
import { ProjectsSection } from '@/components/portfolio/projects-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { ContactSection } from '@/components/portfolio/contact-section'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { hasAboutContent, hasContactContent } from '@/lib/services/content-service'

type TabId = 'home' | 'projects' | 'about' | 'contact'

const TAB_CONFIG: { id: TabId; label: string; icon: typeof Code }[] = [
  { id: 'home', label: 'Home', icon: Code },
  { id: 'projects', label: 'Projekty', icon: Briefcase },
  { id: 'about', label: 'O mnie', icon: User },
  { id: 'contact', label: 'Kontakt', icon: Mail },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [screenOn, setScreenOn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const { content, projects } = usePortfolio()
  const hasProjects = projects.length > 0
  const hasAbout = hasAboutContent(content)
  const hasContact = hasContactContent(content)

  const visibleTabs = useMemo(
    () =>
      TAB_CONFIG.filter((tab) => {
        if (tab.id === 'home') return true
        if (tab.id === 'projects') return hasProjects
        if (tab.id === 'about') return hasAbout
        if (tab.id === 'contact') return hasContact
        return false
      }),
    [hasProjects, hasAbout, hasContact]
  )

  const {
    tabletContainerRef,
    tabletFrameRef,
    tabletScreenRef,
    corner1Ref,
    corner2Ref,
    corner3Ref,
    corner4Ref,
    screenQuad,
    screenSize,
  } = useTabletScreenQuad()

  const {
    zoomOpen: projectsZoomOpen,
    zoomPhase,
    openZoom,
    closeZoom,
    onZoomOpenComplete,
    onZoomCloseComplete,
    zoomTriggerRef,
  } = useProjectsZoom({ tabletContainerRef })

  const clearSelectionAndBlur = () => {
    const sel = document.getSelection()
    if (sel?.rangeCount !== undefined && sel.rangeCount > 0) {
      sel.removeAllRanges()
    }
    ;(document.activeElement as HTMLElement | null)?.blur()
  }

  const handlePowerClick = () => {
    clearSelectionAndBlur()
    if (!screenOn) {
      setActiveTab('home')
      tabletContainerRef.current?.scrollTo({ top: 0 })
    }
    setScreenOn((prev) => !prev)
  }

  useEffect(() => {
    if (activeTab !== 'projects') setSelectedProjectId(null)
  }, [activeTab])

  useEffect(() => {
    const visibleIds = visibleTabs.map((t) => t.id)
    if (visibleIds.length > 0 && !visibleIds.includes(activeTab)) {
      setActiveTab(visibleIds[0] ?? 'home')
    }
  }, [activeTab, visibleTabs])

  return (
    <div className="tablet-scene dark">
      <button
        type="button"
        onMouseDown={() => clearSelectionAndBlur()}
        onClick={(e) => {
          e.stopPropagation()
          handlePowerClick()
        }}
        className={`group fixed top-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
          zoomPhase !== 'idle' ? 'invisible pointer-events-none' : ''
        } ${
          screenOn
            ? 'border-border bg-card/50 text-muted-foreground hover:border-primary hover:bg-card hover:text-primary'
            : 'border-primary bg-primary/20 text-primary shadow-[0_0_16px_var(--primary),0_0_32px_var(--primary)] hover:bg-primary/30 hover:shadow-[0_0_24px_var(--primary),0_0_48px_var(--primary)] animate-power-glow'
        }`}
        aria-label={screenOn ? 'Wyłącz ekran' : 'Włącz ekran'}
        aria-pressed={!screenOn}
        title={screenOn ? 'Wyłącz ekran' : 'Włącz ekran'}
      >
        <Power
          className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
            screenOn ? 'text-muted-foreground' : 'text-primary'
          }`}
        />
      </button>
      <Link
        to="/admin/login"
        className={`fixed top-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary hover:bg-card hover:text-primary ${zoomPhase !== 'idle' ? 'invisible pointer-events-none' : ''}`}
        aria-label="Zaloguj się"
        title="Zaloguj się"
      >
        <LogIn className="h-5 w-5" />
      </Link>

      <ProjectsZoomOverlay
        visible={
          projectsZoomOpen &&
          (zoomPhase === 'open' || zoomPhase === 'closing') &&
          activeTab === 'projects'
        }
        onClose={closeZoom}
      />

      <TabletScene
        tabletContainerRef={tabletContainerRef}
        tabletFrameRef={tabletFrameRef}
        tabletScreenRef={tabletScreenRef}
        corner1Ref={corner1Ref}
        corner2Ref={corner2Ref}
        corner3Ref={corner3Ref}
        corner4Ref={corner4Ref}
        screenQuad={screenQuad}
        screenSize={screenSize}
        screenOn={screenOn}
        projectsZoomOpen={projectsZoomOpen}
        zoomPhase={zoomPhase}
        onZoomOpenComplete={onZoomOpenComplete}
        onZoomCloseComplete={onZoomCloseComplete}
      >
        <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabId)}
            className="w-full"
          >
            <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
        <div className="tablet-content">
          <main className="container mx-auto px-8 py-24 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl space-y-12">
              {activeTab === 'home' && (
                <HomeSection onSeeProjects={() => setActiveTab('projects')} />
              )}
              {activeTab === 'projects' && (
                <>
                  {screenOn && (
                    <ProjectsZoomTrigger ref={zoomTriggerRef} onClick={openZoom} />
                  )}
                  <ProjectsSection
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedProjectId={selectedProjectId}
                    setSelectedProjectId={setSelectedProjectId}
                  />
                </>
              )}
              {activeTab === 'about' && <AboutSection />}
              {activeTab === 'contact' && <ContactSection />}
            </div>
          </main>
        </div>
      </TabletScene>
    </div>
  )
}
