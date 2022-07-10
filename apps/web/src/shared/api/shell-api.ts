import { shell } from 'electron'

export const open = (url: string) => {
  shell.openExternal(url)
}

export const openPath = (path: string) => {
  shell.openPath(path)
}
