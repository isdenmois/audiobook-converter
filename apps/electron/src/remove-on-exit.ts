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

const toRemove: string[] = []

export const createTempFile = (fileName: string) => {
  const filePath = path.join(tmpDir, fileName)

  toRemove.push(filePath)

  return filePath
}

process.on('exit', () => {
  toRemove.forEach(filePath => {
    try {
      accessSync(filePath)
      unlinkSync(filePath)
    } catch {}
  })
})
