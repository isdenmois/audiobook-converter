import { parseInProgress$, parsed$ } from 'entities/media-parser'
import { $books } from 'entities/audiobook'
import { toParse$ } from 'entities/media-parser'
import { computed } from 'nanostores'

type Route = 'HOME' | 'PARSING' | 'ADD_BOOK' | 'BOOK_LIST'

export const currentRoute$ = computed([parseInProgress$, parsed$, $books], (parseInProgress, parsed, books): Route => {
  if (parsed.length > 0) {
    return 'ADD_BOOK'
  }

  if (parseInProgress) {
    return 'PARSING'
  }

  if (books.length > 0) {
    return 'BOOK_LIST'
  }

  return 'HOME'
})
