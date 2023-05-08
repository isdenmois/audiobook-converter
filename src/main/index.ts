import { app, shell, BrowserWindow, protocol, ipcMain, dialog, OpenDialogOptions } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import storage from 'electron-json-storage'
import { access, mkdir } from 'fs/promises'
import { parseDirectory } from './ffprobe-parser'
import { convert } from './ffmpeg-converter'
import icon from '../../resources/icon.ico?asset'
import { settingsSchema, type Settings } from './settings'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: is.dev ? 1600 : 1000,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (is.dev) {
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

ipcMain.handle('dialog/open', async (_, options: OpenDialogOptions) => {
  const window = getCurrentWindow()

  const { canceled, filePaths } = await dialog.showOpenDialog(window, options)

  if (canceled || !filePaths.length) {
    throw 'Not selected'
  }

  return filePaths
})

ipcMain.handle('parser/parse', async (_, path: string) => {
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

ipcMain.handle('encoder/encode', async ({ sender }, book: any, path: string) => {
  await convert(book, path, progress => {
    sender.send('encoder/progress', { bookId: book.id, progress })
  })
})

const SETTINGS_KEY = 'settings'
const DEFAULT_SETTINGS: Settings = {
  coversPath: '',
  outputPath: '',
  sourceBooksPath: '',
  defaultSpeed: 1.6,
}

ipcMain.handle('settings/get', (): Settings => {
  const settings = storage.getSync(SETTINGS_KEY) as Settings

  if (!settingsSchema.safeParse(settings).success) {
    return DEFAULT_SETTINGS
  }

  return settings
})

ipcMain.handle('settings/set', (_, settings: Settings): boolean => {
  if (!settingsSchema.safeParse(settings).success) {
    return false
  }

  storage.set(SETTINGS_KEY, settings, () => {})

  return true
})
