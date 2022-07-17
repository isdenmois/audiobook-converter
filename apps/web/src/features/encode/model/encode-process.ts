import { $books } from 'entities/audiobook'
import { api } from 'shared/api'
import { currentBookId$, done$, progress$ } from './progress'
import { destination$, savePath$ } from './save-path'

export const startEncode = async () => {
  const books = $books.get()

  currentBookId$.set(books[0].id)

  const path = await api.encoder.createDestinationDir(savePath$.get())

  destination$.set(path)

  for (const book of $books.get()) {
    currentBookId$.set(book.id)

    try {
      await api.encoder.encode(JSON.parse(JSON.stringify(book)), path)
    } catch (e) {
      console.error(e)
    }
  }

  done$.set(true)
  progress$.set(-1)
  currentBookId$.set(null)
}
