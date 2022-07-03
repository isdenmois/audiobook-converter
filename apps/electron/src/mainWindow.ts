import { BrowserWindow } from 'electron'

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
    },
    autoHideMenuBar: true,
    width: import.meta.env.DEV ? 1600 : 1024,
    height: 768,
  })

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show()

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools()
    }
  })

  if (import.meta.env.DEV) {
    await browserWindow.loadURL('http://localhost:3000')
  } else {
    await browserWindow.loadFile('./node_modules/web/dist/index.html')
  }

  return browserWindow
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

  if (window === undefined) {
    window = await createWindow()
  }

  if (window.isMinimized()) {
    window.restore()
  }

  window.focus()
}
