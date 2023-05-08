import { ipcRenderer } from 'electron'

export const open = (url: string) => ipcRenderer.invoke('shell/openExternal', url)

export const openPath = (path: string) => ipcRenderer.invoke('shell/openPath', path)
