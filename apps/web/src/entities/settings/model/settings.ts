import { atom } from 'nanostores'
import type { Settings } from 'types'
import { api } from 'shared/api'

const DEFAULT_SETTINGS = <Settings>{
  coversPath: '',
  outputPath: '',
  sourceBooksPath: '',
  defaultSpeed: 1.6,
}

export const settings$ = atom<Settings>(DEFAULT_SETTINGS)

export const loadSettings = async () => {
  const settings = await api.settings.get()

  settings$.set(settings)
}

export const saveSettings = async (settings: Settings) => {
  if (await api.settings.set(settings)) {
    settings$.set(settings)
  }
}

export const updateSetting = <T extends keyof Settings>(setting: T, value: Settings[T]) => {
  return saveSettings({ ...settings$.get(), [setting]: value })
}

loadSettings()
