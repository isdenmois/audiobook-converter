import { parseInProgress$, parsed$ } from 'entities/media-parser'
import { $books, bookIdToEdit$ } from 'entities/audiobook'
import { currentBookId$, done$ } from 'features/encode'
import { computed } from 'nanostores'

type Route = 'HOME' | 'PARSING' | 'ADD_BOOK' | 'BOOK_LIST' | 'BOOK_EDIT' | 'ENCODING' | 'DONE'

export const currentRoute$ = computed(
  [parseInProgress$, parsed$, $books, bookIdToEdit$, currentBookId$, done$],
  (parseInProgress, parsed, books, bookIdToEdit, currentBookId, done): Route => {
    if (parsed.length > 0) {
      return 'ADD_BOOK'
    }

    if (parseInProgress) {
      return 'PARSING'
    }

    if (bookIdToEdit !== null) {
      return 'BOOK_EDIT'
    }

    if (currentBookId !== null) {
      return 'ENCODING'
    }

    if (books.length > 0) {
      return 'BOOK_LIST'
    }

    return 'HOME'
  },
)
