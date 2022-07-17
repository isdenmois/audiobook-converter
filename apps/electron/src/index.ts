import { join } from 'path'
import { access, mkdir } from 'fs/promises'
import { app, BrowserWindow, dialog, protocol, shell, ipcMain } from 'electron'
import { parseDirectory } from './ffprobe-parser'
import { convert } from './ffmpeg-converter'
import { restoreOrCreateWindow } from './mainWindow'

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.on('second-instance', restoreOrCreateWindow)

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow)

/**
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch(e => console.error('Failed create window:', e))

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      }),
    )
    .catch(e => console.error('Failed install extension:', e))
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('atom', (request, callback) => {
    console.log(request.url)
    const url = request.url.slice(7)
    callback({ path: decodeURI(url) })
  })
})

const getCurrentWindow = () => BrowserWindow.getAllWindows().find(w => !w.isDestroyed())!

ipcMain.handle('dialog/open', async (_, options: any) => {
  let window = getCurrentWindow()

  const { canceled, filePaths } = await dialog.showOpenDialog(window, options)

  if (canceled || !filePaths.length) {
    throw 'Not selected'
  }

  return filePaths
})

ipcMain.handle('parser/parse', async (_, path: string): Promise<any> => {
  return parseDirectory(path)
})

ipcMain.handle('encode/create-dir', async (_, path: string): Promise<string> => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dirName = `${year}${month}${day}`

  const destination = join(path, dirName)

  try {
    await access(destination)
  } catch {
    await mkdir(destination)
  }

  return destination
})

ipcMain.handle('shell/openExternal', (_, url: string) => {
  shell.openExternal(url, { activate: true })
})

ipcMain.handle('shell/openPath', (_, path: string) => {
  shell.openPath(path)
})

// ipcMain.on('open-file-dialog-dataset', event => {
//   dialog
//     .showOpenDialog({
//       properties: ['openDirectory', 'multiSelections', 'openFile'],
//       defaultPath: archConfig.sourceBooksPath,
//     })
//     .then(async result => {
//       let parsed = 0
//       const total = result.filePaths.length
//       event.sender.send('parser-progress', { parsed, total })

//       for (const filePath of result.filePaths) {
//         const book = await parseDirectory(filePath)

//         event.sender.send('book-parsed', book)
//         event.sender.send('parser-progress', { parsed: parsed++, total })
//       }

//       event.sender.send('parser-progress', { parsed, total })
//     })
//     .catch(err => {
//       console.log(err)
//     })
// })

ipcMain.handle('encoder/encode', async ({ sender }, book: any, path: string) => {
  await convert(book, path, progress => {
    sender.send('encoder/progress', { bookId: book.id, progress })
  })
})

// ipcMain.on('convert-book', async ({ sender }, book) => {
//   console.log('start conver book', book)

//   try {
//     const { canceled, filePaths } = await dialog.showOpenDialog({
//       properties: ['openDirectory', 'createDirectory'],
//       defaultPath: archConfig.saveDirectoryPath,
//       buttonLabel: 'Save',
//     })

//     if (!canceled && filePaths.length) {
//       convert(book, filePaths[0], progress => {
//         sender.send('convert-progress', { bookId: book.id, progress })
//       })
//     }
//   } catch (err) {
//     console.log(err)
//   }
// })

// ipcMain.on('cover-select', async ({ sender }) => {
//   try {
//     const { canceled, filePaths } = await dialog.showOpenDialog({
//       properties: ['openFile'],
//       defaultPath: archConfig.coversPath,
//       buttonLabel: 'Select',
//       filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
//     })

//     if (!canceled && filePaths.length) {
//       sender.send('cover-selected', filePaths[0])
//     }
//   } catch (err) {
//     console.log(err)
//   }
// })
