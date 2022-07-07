import { ipcRenderer } from 'electron'
import {config, events} from 'shared/lib'
import { promiseIpc } from './promise-ipc'

export const encode = (book: any) => promiseIpc.send('encoder/encode', book, config.saveDirectoryPath) as Promise<any>

ipcRenderer.on('encoder/progress', ({ bookId, progress }: any) => {
  events.send('encode/progress', { bookId, progress })
})
