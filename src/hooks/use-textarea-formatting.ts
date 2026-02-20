import { useCallback, type RefObject } from 'react'
import {
  wrapSelection,
  insertUnorderedListMarker,
  insertOrderedListMarker,
  insertNewParagraph,
  wrapWithCodeBlock,
} from '@/lib/utils/textarea-formatting'

export function useTextareaFormatting(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  onChange: (value: string) => void,
  onFocusEdit?: () => void
) {
  const apply = useCallback(
    (newValue: string) => {
      onChange(newValue)
      onFocusEdit?.()
    },
    [onChange, onFocusEdit]
  )

  const wrapBold = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(wrapSelection(el, '**', '**', 'tekst'))
  }, [textareaRef, apply])

  const wrapItalic = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(wrapSelection(el, '*', '*', 'tekst'))
  }, [textareaRef, apply])

  const wrapLink = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(wrapSelection(el, '[', '](url)', 'opis linku'))
  }, [textareaRef, apply])

  const insertParagraph = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(insertNewParagraph(el))
  }, [textareaRef, apply])

  const insertList = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(insertUnorderedListMarker(el))
  }, [textareaRef, apply])

  const insertOrderedList = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(insertOrderedListMarker(el))
  }, [textareaRef, apply])

  const wrapInlineCode = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    apply(wrapSelection(el, '`', '`', 'kod'))
  }, [textareaRef, apply])

  const wrapCodeBlock = useCallback(
    (language: string) => {
      const el = textareaRef.current
      if (!el) return
      apply(wrapWithCodeBlock(el, language))
    },
    [textareaRef, apply]
  )

  return {
    wrapBold,
    wrapItalic,
    wrapLink,
    insertParagraph,
    insertList,
    insertOrderedList,
    wrapInlineCode,
    wrapCodeBlock,
  }
}
