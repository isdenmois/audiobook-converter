import { ipcRenderer } from 'electron'
import { events } from 'shared/lib'
import { promiseIpc } from './promise-ipc'

export const encode = (book: any, path: string) => promiseIpc.send('encoder/encode', book, path) as Promise<any>

ipcRenderer.on('encoder/progress', ({ bookId, progress }: any) => {
  events.send('encode/progress', { bookId, progress })
})
