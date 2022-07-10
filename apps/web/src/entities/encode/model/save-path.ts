import { atom } from 'nanostores'
import { config } from 'shared/lib'

export const savePath$ = atom(config.saveDirectoryPath)

export const updateSavePath = (path: string) => {
  savePath$.set(path)
}
