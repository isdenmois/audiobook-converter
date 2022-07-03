import { ipcRenderer } from 'electron'
import { atom } from 'nanostores'

interface ParserProgress {
  parsed: number
  total: number
}

export const $parserProgress = atom<ParserProgress | null>(null)

ipcRenderer.on('parser-progress', (_, { parsed, total }) => {
  console.log('[parser-progress]', { parsed, total })
  if (parsed >= total) {
    $parserProgress.set(null)
  } else {
    $parserProgress.set({ parsed, total })
  }
})
