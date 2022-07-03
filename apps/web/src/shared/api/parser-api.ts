import { promiseIpc } from './promise-ipc'

export const parse = (path: string) => promiseIpc.send('parser/parse', path) as Promise<any>
