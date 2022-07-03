import { promiseIpc } from './promise-ipc'
import { config } from 'shared/lib'

export const openToParse = () =>
  promiseIpc.send('dialog/open', {
    properties: ['openDirectory', 'multiSelections', 'openFile'],
    defaultPath: config.sourceBooksPath,
  }) as Promise<string[]>
