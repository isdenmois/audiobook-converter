import { ipcRenderer } from 'electron'
import OpenDialogOptions = Electron.OpenDialogOptions

export const openToParse = (defaultPath: string) =>
  ipcRenderer.invoke('dialog/open', {
    properties: ['openDirectory', 'multiSelections', 'openFile'],
    defaultPath,
  }) as Promise<string[]>

export const openCover = (defaultPath: string) =>
  ipcRenderer.invoke('dialog/open', {
    properties: ['openFile'],
    defaultPath,
    buttonLabel: 'Select',
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
  }) as Promise<string[]>

export const selectDirectory = (defaultPath: string) =>
  ipcRenderer
    .invoke('dialog/open', <OpenDialogOptions>{
      properties: ['openDirectory', 'createDirectory'],
      defaultPath,
      buttonLabel: 'Select',
    })
    .then((paths: any) => paths[0]) as Promise<string>
