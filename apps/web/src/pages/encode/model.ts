import { computed } from 'nanostores'
import { $books } from 'entities/audiobook'
import { currentBookId$ } from 'features/encode'

export const currentBook$ = computed([$books, currentBookId$], (books, currentBookId) => {
  console.log('new book id', currentBookId)

  return books.find(book => book.id === currentBookId)
})
