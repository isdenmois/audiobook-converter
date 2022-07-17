import { ipcRenderer } from 'electron'
import { config } from 'shared/lib'
import OpenDialogOptions = Electron.OpenDialogOptions

export const openToParse = () =>
  ipcRenderer.invoke('dialog/open', {
    properties: ['openDirectory', 'multiSelections', 'openFile'],
    defaultPath: config.sourceBooksPath,
  }) as Promise<string[]>

export const openCover = () =>
  ipcRenderer.invoke('dialog/open', {
    properties: ['openFile'],
    defaultPath: config.coversPath,
    buttonLabel: 'Select',
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
  }) as Promise<string[]>

export const selectDirectory = () =>
  ipcRenderer
    .invoke('dialog/open', <OpenDialogOptions>{
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: config.saveDirectoryPath,
      buttonLabel: 'Select',
    })
    .then((paths: any) => paths[0]) as Promise<string>
