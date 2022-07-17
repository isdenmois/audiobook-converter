import { Howl } from 'howler'
import { computed, onUnmounted, Ref, watch } from 'vue'
import { useStore } from '@nanostores/vue'
import { playing$ } from '../model'

export const usePlayer = (path: string, speed: Ref<number>) => {
  const current = useStore(playing$)
  let sound: Howl | null = null

  watch(current, () => {
    if (current.value !== path && current.value !== null) {
      sound?.stop()
    }
  })

  watch(speed, () => {
    sound?.rate(speed.value)
  })

  const isPlaying = computed(() => current.value === path)

  const togglePlaying = () => {
    if (!sound) {
      sound = new Howl({
        src: `atom://${path}`,
        rate: speed.value,
        loop: true,
        volume: 1,
        html5: true,
      })
    }

    if (playing$.get() === path) {
      playing$.set(null)
      sound.pause()
    } else {
      playing$.set(path)
      sound.play()
    }
  }

  onUnmounted(() => {
    sound?.unload()
    sound = null
  })

  return { isPlaying, togglePlaying }
}
