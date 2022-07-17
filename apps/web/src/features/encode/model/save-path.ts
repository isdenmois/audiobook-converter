import { atom, computed } from 'nanostores'
import { config } from 'shared/lib'

export const savePath$ = atom(config.saveDirectoryPath)
export const destination$ = atom<string | null>(null)

export const currentDestination$ = computed(
  [savePath$, destination$],
  (savePath, destination) => destination || savePath,
)

export const updateSavePath = (path: string) => {
  savePath$.set(path)
}
