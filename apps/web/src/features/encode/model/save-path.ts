import { atom, computed } from 'nanostores'
import { settings$, updateSetting } from 'entities/settings'

export const savePath$ = atom(settings$.get().outputPath)
export const destination$ = atom<string | null>(null)

export const currentDestination$ = computed(
  [savePath$, destination$],
  (savePath, destination) => destination || savePath,
)

export const updateSavePath = (path: string) => {
  savePath$.set(path)

  if (!settings$.get().outputPath) {
    updateSetting('outputPath', path)
  }
}

settings$.listen(({ outputPath }) => {
  savePath$.set(outputPath)
})
