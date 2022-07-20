import { unlinkSync, accessSync } from 'fs'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'

const tmpDir = path.join(os.tmpdir(), 'encode')

fs.access(tmpDir)
  .then(() => fs.rmdir(tmpDir))
  .catch(() => {})
  .then(() => fs.access(tmpDir))
  .catch(() => fs.mkdir(tmpDir))

let toRemove: string[] = []

export const createTempFile = (fileName: string) => {
  const filePath = path.join(tmpDir, fileName)

  toRemove.push(filePath)

  return filePath
}

export const removeFiles = async (paths: string[]) => {
  for (const path of paths) {
    try {
      await fs.access(path)
      await fs.unlink(path)
    } catch {
    } finally {
      toRemove = toRemove.filter(pathToRemove => pathToRemove === path)
    }
  }
}

process.on('exit', () => {
  toRemove.forEach(filePath => {
    try {
      accessSync(filePath)
      unlinkSync(filePath)
    } catch {}
  })
})
