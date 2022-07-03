import { atom, computed } from 'nanostores'

export const $parsedMedia = atom<any>([])

export const $currentMedia = computed($parsedMedia, media => media[0])

let id = 0

export function addMedia(media: any) {
  $parsedMedia.set([...$parsedMedia.get(), { ...media, id: id++ }])
}

export function toNextMedia() {
  $parsedMedia.set($parsedMedia.get().slice(1))
}
