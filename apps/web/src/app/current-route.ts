import { parseInProgress$, parsed$ } from 'entities/media-parser'
import { $books, bookIdToEdit$ } from 'entities/audiobook'
import { toParse$ } from 'entities/media-parser'
import { computed } from 'nanostores'

type Route = 'HOME' | 'PARSING' | 'ADD_BOOK' | 'BOOK_LIST' | 'BOOK_EDIT'

export const currentRoute$ = computed(
  [parseInProgress$, parsed$, $books, bookIdToEdit$],
  (parseInProgress, parsed, books, bookIdToEdit): Route => {
    if (parsed.length > 0) {
      return 'ADD_BOOK'
    }

    if (parseInProgress) {
      return 'PARSING'
    }

    if (bookIdToEdit !== null) {
      return 'BOOK_EDIT'
    }

    if (books.length > 0) {
      return 'BOOK_LIST'
    }

    return 'HOME'
  },
)
