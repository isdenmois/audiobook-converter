import { promiseIpc } from './promise-ipc'
import { config } from 'shared/lib'
import OpenDialogOptions = Electron.OpenDialogOptions;

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

export const selectSaveDirectory = () =>
    promiseIpc.send('dialog/open', <OpenDialogOptions>{
        properties: ['openDirectory', 'createDirectory'],
        defaultPath: config.saveDirectoryPath,
        buttonLabel: 'Save',
    }).then((paths: any) => paths[0]) as Promise<string>
