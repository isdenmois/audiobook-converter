import { promiseIpc } from './promise-ipc'
import { config } from 'shared/lib'

export const openToParse = () =>
  promiseIpc.send('dialog/open', {
    properties: ['openDirectory', 'multiSelections', 'openFile'],
    defaultPath: config.sourceBooksPath,
  }) as Promise<string[]>

export const openCover = () =>
  promiseIpc.send('dialog/open', {
    properties: ['openFile'],
    defaultPath: config.coversPath,
    buttonLabel: 'Select',
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
  }) as Promise<string[]>
