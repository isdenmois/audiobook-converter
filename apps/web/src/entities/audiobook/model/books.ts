import { atom } from 'nanostores'
export const $books = atom<any[]>([])

export const addBook = (book: any) => $books.set([...$books.get(), book])
