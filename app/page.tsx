'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Code, Briefcase, User, Mail, LogIn, Power } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTabletScreenQuad } from '@/hooks/use-tablet-screen-quad'
import { TabletScene } from '@/components/portfolio/tablet-scene'
import { HomeSection } from '@/components/portfolio/home-section'
import { ProjectsSection } from '@/components/portfolio/projects-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { ContactSection } from '@/components/portfolio/contact-section'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [screenOn, setScreenOn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

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

  const handlePowerClick = () => {
    if (!screenOn) setActiveTab('home')
    setScreenOn((prev) => !prev)
  }

  return (
    <div className="tablet-scene dark">
      <button
        type="button"
        onClick={handlePowerClick}
        className={`group fixed top-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 ${
          screenOn
            ? 'border-border bg-card/50 text-muted-foreground hover:border-primary hover:bg-card hover:text-primary'
            : 'border-primary bg-primary/20 text-primary shadow-[0_0_16px_var(--primary),0_0_32px_var(--primary)] hover:bg-primary/30 hover:shadow-[0_0_24px_var(--primary),0_0_48px_var(--primary)]'
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
        href="/admin/login"
        className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary hover:bg-card hover:text-primary"
        aria-label="Zaloguj się"
        title="Zaloguj się"
      >
        <LogIn className="h-5 w-5" />
      </Link>

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
      >
        <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                value="home"
                className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Home
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Projekty
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  O mnie
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="rounded-none border-b-2 border-transparent px-6 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Kontakt
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="tablet-content">
          <main className="container mx-auto px-8 py-24 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl space-y-12">
              {activeTab === 'home' && <HomeSection />}
              {activeTab === 'projects' && (
                <ProjectsSection
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedProjectId={selectedProjectId}
                  setSelectedProjectId={setSelectedProjectId}
                />
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
