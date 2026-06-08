import * as React from 'react'
import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Code, Briefcase, User, Mail, LogIn, Power } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTabletScreenQuad } from '@/hooks/use-tablet-screen-quad'
import {
  useProjectsZoom,
  useZoomLayout,
  ProjectsZoomOverlay,
  ProjectsZoomTrigger,
} from '@/components/portfolio/projects-zoom'
import { TabletScene } from '@/components/portfolio/TabletScene'
import { HomeSection } from '@/components/portfolio/HomeSection'
import { Copyright } from '@/components/portfolio/Copyright'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { ADMIN_LOGIN } from '@/lib/constants/routes'
import { hasAboutContent, hasContactContent } from '@/lib/services/content-service'
import * as pageViewsService from '@/lib/services/page-views-service'
import { TabletModalContainerContext } from '@/contexts/TabletModalContainerContext'
import { cn } from '@/lib/utils'
import { PageViewRecordError, reportError } from '@/lib/errors'

const ProjectsSection = React.lazy(() =>
  import('@/components/portfolio/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
)
const AboutSection = React.lazy(() =>
  import('@/components/portfolio/AboutSection').then((m) => ({ default: m.AboutSection }))
)
const ContactSection = React.lazy(() =>
  import('@/components/portfolio/ContactSection').then((m) => ({ default: m.ContactSection }))
)

type TabId = 'home' | 'projects' | 'about' | 'contact'

const TAB_CONFIG: { id: TabId; label: string; icon: typeof Code }[] = [
  { id: 'home', label: 'Home', icon: Code },
  { id: 'projects', label: 'Projekty', icon: Briefcase },
  { id: 'about', label: 'O mnie', icon: User },
  { id: 'contact', label: 'Kontakt', icon: Mail },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [screenOn, setScreenOn] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [tabletModalContainer] = useState<HTMLElement | null>(null)
  const projectsListScrollTopRef = useRef<number>(0)
  const prevSelectedProjectIdRef = useRef<number | null>(null)

  const { content, projects, loading, error } = usePortfolio()
  const visibleProjects = useMemo(
    () => projects.filter((p) => p.status === 'published'),
    [projects]
  )
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
    onSidebarEnterComplete,
    onSidebarCloseComplete,
    zoomTriggerRef,
  } = useProjectsZoom({ tabletContainerRef })

  const { isMainSqueezed } = useZoomLayout()
  const isDataReady = !loading
  const isScreenReady = screenQuad !== null && screenSize !== null
  const isReady = isDataReady && isScreenReady

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
    const key = 'portfolio_page_view_recorded'
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return
    try {
      sessionStorage.setItem(key, '1')
    } catch {
      return
    }
    pageViewsService.recordPageView('home').catch((err) => {
      reportError(new PageViewRecordError('recordPageView home', err), {
        context: 'record_page_view',
      })
      try {
        sessionStorage.removeItem(key)
      } catch {
        // sessionStorage może być niedostępny (np. tryb prywatny)
      }
    })
  }, [])

  const handleTabChange = useCallback(
    (v: string) => {
      setActiveTab(v as TabId)
      tabletContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    },
    [tabletContainerRef]
  )

  const handleSelectProject = useCallback((id: number) => {
    projectsListScrollTopRef.current = tabletContainerRef.current?.scrollTop ?? 0
    setSelectedProjectId(id)
  }, [tabletContainerRef])

  useEffect(() => {
    if (activeTab !== 'projects') setSelectedProjectId(null)
  }, [activeTab])

  useEffect(() => {
    const visibleIds = visibleTabs.map((t) => t.id)
    if (visibleIds.length > 0 && !visibleIds.includes(activeTab)) {
      setActiveTab(visibleIds[0] ?? 'home')
    }
  }, [activeTab, visibleTabs])

  useEffect(() => {
    if (selectedProjectId !== null) {
      tabletContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [selectedProjectId, tabletContainerRef])

  useEffect(() => {
    const hadProject = prevSelectedProjectIdRef.current !== null
    const returnedFromDetail = hadProject && selectedProjectId === null && activeTab === 'projects'
    prevSelectedProjectIdRef.current = selectedProjectId
    if (returnedFromDetail && tabletContainerRef.current) {
      requestAnimationFrame(() => {
        if (tabletContainerRef.current) {
          tabletContainerRef.current.scrollTop = projectsListScrollTopRef.current
        }
      })
    }
  }, [selectedProjectId, activeTab, tabletContainerRef])

  return (
    <TabletModalContainerContext.Provider value={{ container: tabletModalContainer }}>
      <div className="tablet-scene dark">
        {isReady && (
          <>
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
              to={ADMIN_LOGIN}
              className={`fixed top-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary hover:bg-card hover:text-primary ${zoomPhase !== 'idle' ? 'invisible pointer-events-none' : ''}`}
              aria-label="Zaloguj się"
              title="Zaloguj się"
            >
              <LogIn className="h-5 w-5" />
            </Link>

            <ProjectsZoomOverlay
              visible={
                projectsZoomOpen &&
                (zoomPhase === 'open' ||
                  zoomPhase === 'openWithSidebar' ||
                  zoomPhase === 'closingSidebar' ||
                  zoomPhase === 'closing') &&
                activeTab === 'projects'
              }
              onClose={closeZoom}
            />
          </>
        )}

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
          screenOn={isReady ? screenOn : false}
          projectsZoomOpen={projectsZoomOpen}
          zoomPhase={zoomPhase}
          onZoomOpenComplete={onZoomOpenComplete}
          onZoomCloseComplete={onZoomCloseComplete}
          onSidebarEnterComplete={onSidebarEnterComplete}
          onSidebarCloseComplete={onSidebarCloseComplete}
          zoomSidebarProjects={visibleProjects}
          zoomSidebarSelectedCategory={selectedCategory}
          zoomSidebarSetSelectedCategory={setSelectedCategory}
          zoomSidebarSelectedProjectId={selectedProjectId}
          zoomSidebarOnSelectProject={handleSelectProject}
        >
        {!isReady ? (
          <div className="tablet-content flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Ładowanie...</p>
              {loading && (
                <p className="mt-2 text-sm text-muted-foreground">Pobieranie danych...</p>
              )}
            </div>
          </div>
        ) : !loading && error ? (
          <div className="tablet-content flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold text-destructive">Błąd ładowania</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : (() => {
          const tabletContent = (
            <>
              <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
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
                <div key={activeTab} className="tablet-tab-content">
                  <main
                    className={cn(
                      'container mx-auto py-24',
                      isMainSqueezed
                        ? 'px-4 md:px-8 lg:px-10'
                        : 'px-8 md:px-16 lg:px-24'
                    )}
                  >
                    <div className="mx-auto max-w-5xl space-y-12">
                      {activeTab === 'home' && (
                        <HomeSection onSeeProjects={() => setActiveTab('projects')} />
                      )}
                      {activeTab === 'projects' && (
                        <>
                          {screenOn && (
                            <ProjectsZoomTrigger ref={zoomTriggerRef} onClick={openZoom} />
                          )}
                          <React.Suspense
                            fallback={
                              <div className="flex min-h-[200px] items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                              </div>
                            }
                          >
                            <ProjectsSection
                              selectedCategory={selectedCategory}
                              setSelectedCategory={setSelectedCategory}
                              selectedProjectId={selectedProjectId}
                              setSelectedProjectId={setSelectedProjectId}
                              onSelectProject={handleSelectProject}
                            />
                          </React.Suspense>
                        </>
                      )}
                      {activeTab === 'about' && (
                        <React.Suspense
                          fallback={
                            <div className="flex min-h-[200px] items-center justify-center">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            </div>
                          }
                        >
                          <AboutSection />
                        </React.Suspense>
                      )}
                      {activeTab === 'contact' && (
                        <React.Suspense
                          fallback={
                            <div className="flex min-h-[200px] items-center justify-center">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            </div>
                          }
                        >
                          <ContactSection />
                        </React.Suspense>
                      )}
                    </div>
                  </main>
                </div>
              </div>
            </>
          )
          return tabletContent
        })()}
        </TabletScene>
        {isReady && (
          <div className="fixed bottom-6 left-[75%] -translate-x-1/2 z-30">
            <Copyright />
          </div>
        )}
      </div>
    </TabletModalContainerContext.Provider>
  )
}
