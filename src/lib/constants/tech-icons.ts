import {
  Briefcase,
  Code,
  Zap,
  GitBranch,
  Terminal,
  MessageCircle,
  Container,
  GraduationCap,
  Sparkles,
  Code2,
  Braces,
  Layers,
  Server,
  Database,
  Palette,
  Cloud,
  Brain,
  Workflow,
  Github,
  Coffee,
  Leaf,
  Hexagon,
  Circle,
  Box,
  Play,
  Cog,
  FlaskConical,
  TestTube,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { TOOLS_CATALOG } from '@/lib/data/tools-catalog'

// Mapa nazwa/id technologii → nazwa ikony Lucide
// Budowana na podstawie TOOLS_CATALOG
const stackNameToIconName: Record<string, string> = {}

// Wypełnij mapę na podstawie katalogu
TOOLS_CATALOG.forEach((tool) => {
  // Mapuj zarówno po name jak i id, żeby działało dla różnych wariantów
  stackNameToIconName[tool.name] = tool.icon
  stackNameToIconName[tool.id] = tool.icon
})

// Mapa nazwa ikony → komponent Lucide
export const iconNameToComponent: Record<string, LucideIcon> = {
  Briefcase,
  Code,
  Zap,
  GraduationCap,
  Sparkles,
  GitBranch,
  Terminal,
  MessageCircle,
  Container,
  Code2,
  Braces,
  Layers,
  Server,
  Database,
  Palette,
  Cloud,
  Brain,
  Workflow,
  Github,
  Coffee,
  Leaf,
  Hexagon,
  Circle,
  Box,
  Play,
  Cog,
  FlaskConical,
  TestTube,
  Package,
}

/**
 * Zwraca nazwę ikony Lucide dla danej technologii.
 * Najpierw szuka dokładnego dopasowania, potem po lowercase (dla id w katalogu).
 * Jeśli nie znajdzie, zwraca 'Code' jako fallback.
 */
export function getTechIconName(tech: string): string {
  const normalized = tech.trim()
  
  // Najpierw dokładne dopasowanie
  if (stackNameToIconName[normalized]) {
    return stackNameToIconName[normalized]
  }
  
  // Potem po lowercase (dla id w katalogu, np. "react" zamiast "React")
  const lowercased = normalized.toLowerCase()
  if (stackNameToIconName[lowercased]) {
    return stackNameToIconName[lowercased]
  }
  
  // Fallback do uniwersalnej ikony Code
  return 'Code'
}

/**
 * Zwraca komponent ikony Lucide dla podanej nazwy ikony.
 * Jeśli ikona nie istnieje, zwraca Code jako fallback.
 */
export function getToolIcon(iconName?: string): LucideIcon {
  if (!iconName?.trim()) return Code
  const Icon = iconNameToComponent[iconName.trim()]
  return Icon ?? Code
}
