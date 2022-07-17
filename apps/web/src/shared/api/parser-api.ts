import { ipcRenderer } from 'electron'

export const parse = (path: string) => ipcRenderer.invoke('parser/parse', path) as Promise<any>
