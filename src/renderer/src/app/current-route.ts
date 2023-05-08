import { computed } from 'nanostores'
import { parseInProgress$, parsed$ } from 'entities/media-parser'
import { $books, bookIdToEdit$ } from 'entities/audiobook'
import { currentBookId$, done$ } from 'features/encode'
import { showSettings$ } from 'entities/settings'

type Route = 'HOME' | 'PARSING' | 'ADD_BOOK' | 'BOOK_LIST' | 'BOOK_EDIT' | 'ENCODING' | 'DONE' | 'SETTINGS'

export const currentRoute$ = computed(
  [parseInProgress$, parsed$, $books, bookIdToEdit$, currentBookId$, done$, showSettings$],
  (parseInProgress, parsed, books, bookIdToEdit, currentBookId, done, showSettings): Route => {
    if (parsed.length > 0) {
      return 'ADD_BOOK'
    }

    if (parseInProgress) {
      return 'PARSING'
    }

    if (bookIdToEdit !== null) {
      return 'BOOK_EDIT'
    }

    if (done) {
      return 'DONE'
    }

    if (currentBookId !== null) {
      return 'ENCODING'
    }

    if (books.length > 0) {
      return 'BOOK_LIST'
    }

    if (showSettings) {
      return 'SETTINGS'
    }

    return 'HOME'
  },
)
