import { shell } from 'electron'

export const open = (url: string) => {
  shell.openExternal(url)
}
