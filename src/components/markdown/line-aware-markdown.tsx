import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { markdownComponents } from './MarkdownComponents'
import { cn } from '@/lib/utils'

interface LineAwareMarkdownProps {
  content: string
  className?: string
}

type Block = { type: 'content'; text: string } | { type: 'empty'; count: number }

/**
 * Dzieli content na bloki tekstowe i puste linie.
 * Pozwala zachować wielokrotne puste linie jako wizualne odstępy.
 * Nie dzieli wewnątrz bloków kodu (``` ... ```).
 */
function splitIntoBlocks(content: string): Block[] {
  const blocks: Block[] = []
  const lines = content.split('\n')
  let currentText: string[] = []
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Sprawdź czy linia zaczyna/kończy blok kodu
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      currentText.push(line)
      continue
    }

    // Wewnątrz bloku kodu - nie dziel na puste linie
    if (inCodeBlock) {
      currentText.push(line)
      continue
    }

    if (line.trim() === '') {
      // Zapisz dotychczasowy tekst
      if (currentText.length > 0) {
        blocks.push({ type: 'content', text: currentText.join('\n') })
        currentText = []
      }
      // Policz kolejne puste linie
      let emptyCount = 1
      while (i + 1 < lines.length && lines[i + 1].trim() === '') {
        emptyCount++
        i++
      }
      blocks.push({ type: 'empty', count: emptyCount })
    } else {
      currentText.push(line)
    }
  }

  // Zapisz pozostały tekst
  if (currentText.length > 0) {
    blocks.push({ type: 'content', text: currentText.join('\n') })
  }

  return blocks
}

/**
 * Renderuje markdown z pełną kontrolą nad odstępami:
 * - pojedynczy \n w tekście = <br> (dzięki remark-breaks)
 * - pusta linia = odstęp (1 pusta = mały, 2+ = większy)
 * - pełna składnia markdown zachowana
 */
export function LineAwareMarkdown({ content, className }: LineAwareMarkdownProps) {
  const blocks = splitIntoBlocks(content)

  return (
    <div
      className={cn(
        'line-aware-markdown prose prose-invert max-w-none',
        className
      )}
    >
      {blocks.map((block, idx) => {
        if (block.type === 'empty') {
          // Pierwsza pusta linia = separator akapitów (mb-4)
          // Dodatkowe puste linie = dodatkowe <br>
          const extraBreaks = Math.max(0, block.count - 1)
          return (
            <div key={idx} className="mb-4" aria-hidden>
              {Array.from({ length: extraBreaks }, (_, i) => (
                <br key={i} />
              ))}
            </div>
          )
        }
        return (
          <ReactMarkdown
            key={idx}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={markdownComponents}
          >
            {block.text}
          </ReactMarkdown>
        )
      })}
    </div>
  )
}
