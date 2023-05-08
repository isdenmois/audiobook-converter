import { atom, computed } from 'nanostores'
import { $books } from 'entities/audiobook'
import { events } from 'shared/lib'

export const progress$ = atom(-1)
export const currentBookId$ = atom(null)
export const done$ = atom(false)

export const currentBook$ = computed([$books, currentBookId$], (books, currentBookId) =>
  books.find(book => book.id === currentBookId),
)

export const resetDone = () => {
  done$.set(false)
}

events.on('encode/progress', ({ bookId, progress }: any) => {
  if (currentBookId$.get() !== bookId) {
    currentBookId$.set(bookId)
  }

  progress$.set(progress)
})
