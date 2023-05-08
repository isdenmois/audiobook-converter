import { atom } from 'nanostores'

export const showSettings$ = atom(false)

export const openSettings = () => showSettings$.set(true)
export const closeSettings = () => showSettings$.set(false)
