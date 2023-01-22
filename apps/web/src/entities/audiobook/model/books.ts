import { atom, computed } from 'nanostores'
export const $books = atom<any[]>([])

export const bookIdToEdit$ = atom<string | null>(null)
export const bookToEdit$ = computed(
  [$books, bookIdToEdit$],
  (books, bookId) => bookId && books.find(book => book.id === bookId),
)

export const addBook = (book: any) => $books.set([...$books.get(), book])

export const editBook = (book: any) => bookIdToEdit$.set(book.id)

export const removeBook = (bookId: string) => $books.set($books.get().filter(book => book.id !== bookId))

export const cancelEdit = () => bookIdToEdit$.set(null)

export const updateBook = (data: any) => {
  const bookId = bookIdToEdit$.get()
  bookIdToEdit$.set(null)
  $books.set($books.get().map(book => (book.id === bookId ? { ...book, ...data } : book)))
}

export const resetBooks = (books = []) => {
  $books.set(books)
}
