import { ipcRenderer } from 'electron'
import type { Settings } from 'types'

export const get = () => ipcRenderer.invoke('settings/get') as Promise<Settings>

export const set = (settings: Settings) => ipcRenderer.invoke('settings/set', settings) as Promise<boolean>
