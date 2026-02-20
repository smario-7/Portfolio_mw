import profanityListData from '@/lib/data/profanity-list.json'

let cachedProfanityList: string[] | null = null

export function loadProfanityList(): string[] {
  if (cachedProfanityList !== null) {
    return cachedProfanityList
  }

  try {
    const data = profanityListData as { words: string[]; caseSensitive?: boolean }
    cachedProfanityList = Array.isArray(data.words) ? data.words : []
    return cachedProfanityList
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Błąd wczytywania listy niecenzuralnych słów:', error)
    }
    cachedProfanityList = []
    return []
  }
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
}

export function checkProfanity(text: string): { hasProfanity: boolean; words: string[] } {
  if (!text || text.trim().length === 0) {
    return { hasProfanity: false, words: [] }
  }

  const profanityList = loadProfanityList()
  if (profanityList.length === 0) {
    if (import.meta.env.DEV) {
      console.warn('Lista niecenzuralnych słów jest pusta')
    }
    return { hasProfanity: false, words: [] }
  }

  const normalizedText = normalizeText(text.trim())
  const detectedWords: string[] = []

  for (const word of profanityList) {
    if (!word || word.trim().length === 0) {
      continue
    }
    
    const normalizedWord = normalizeText(word.trim())
    if (normalizedWord.length === 0) {
      continue
    }

    if (normalizedText.includes(normalizedWord)) {
      if (!detectedWords.includes(word)) {
        detectedWords.push(word)
      }
    }
  }

  if (import.meta.env.DEV && detectedWords.length > 0) {
    console.log('Wykryto niecenzuralne słowa:', detectedWords, 'w tekście:', text)
  }

  return {
    hasProfanity: detectedWords.length > 0,
    words: detectedWords,
  }
}

export interface ProfanityFieldResult {
  field: string
  words: string[]
}

export function findProfanityInFields(fields: {
  name?: string
  email?: string
  message?: string
}): ProfanityFieldResult[] {
  const results: ProfanityFieldResult[] = []

  if (fields.name) {
    const check = checkProfanity(fields.name)
    if (check.hasProfanity) {
      results.push({
        field: 'name',
        words: check.words,
      })
    }
  }

  if (fields.email) {
    const check = checkProfanity(fields.email)
    if (check.hasProfanity) {
      results.push({
        field: 'email',
        words: check.words,
      })
    }
  }

  if (fields.message) {
    const check = checkProfanity(fields.message)
    if (check.hasProfanity) {
      results.push({
        field: 'message',
        words: check.words,
      })
    }
  }

  if (import.meta.env.DEV && results.length > 0) {
    console.log('Znaleziono niecenzuralne słowa w polach:', results)
  }

  return results
}
