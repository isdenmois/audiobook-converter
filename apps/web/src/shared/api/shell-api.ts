import { promiseIpc } from './promise-ipc'

export const open = (url: string) => promiseIpc.send('shell/openExternal', url)

export const openPath = (path: string) => promiseIpc.send('shell/openPath', path)
