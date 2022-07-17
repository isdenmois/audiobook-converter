import { ipcRenderer } from 'electron'
import { events } from 'shared/lib'

export const encode = (book: any, path: string) => ipcRenderer.invoke('encoder/encode', book, path) as Promise<any>

export const createDestinationDir = (path: string) => ipcRenderer.invoke('encode/create-dir', path) as Promise<string>

ipcRenderer.on('encoder/progress', (_, { bookId, progress }: any) => {
  events.send('encode/progress', { bookId, progress })
})
