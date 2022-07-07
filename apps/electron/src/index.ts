import { app, BrowserWindow, dialog, ipcMain, OpenDialogOptions, protocol } from 'electron'
import promiseIpc from 'electron-promise-ipc/build/mainProcess'
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

promiseIpc.on('dialog/open', async (options: any) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(options)

  if (canceled || !filePaths.length) {
    throw 'Not selected'
  }

  return filePaths
})

promiseIpc.on('parser/parse', async (path: string): Promise<any> => {
  return parseDirectory(path)
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

promiseIpc.on('encoder/encode', async (book: any, defaultPath: string) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    defaultPath,
    buttonLabel: 'Save',
  })

  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

  if (!canceled && filePaths.length) {
    convert(book, filePaths[0], progress => {
      console.log('progress', progress)
      window?.webContents.send('encoder/progress', { bookId: book.id, progress })
      // promiseIpc.send('encoder/progress', { bookId: book.id, progress })
    })
  }
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
