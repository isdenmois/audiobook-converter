<script lang="ts">
import { usePlayer } from './use-player'
</script>

<script lang="ts" setup>
import { playIcon, pauseIcon } from 'shared/assets'
import { ref, watch } from 'vue'

const props = defineProps<{ path: string; speed: number }>()
const speed = ref(props.speed)

watch(
  () => props.speed,
  () => {
    speed.value = props.speed
  },
)

const { isPlaying, togglePlaying } = usePlayer(props.path, speed)
</script>

<template>
  <img :class="{ playing: isPlaying }" :src="isPlaying ? pauseIcon : playIcon" @click="togglePlaying" />
</template>

<style scoped>
img {
  cursor: pointer;
  padding: 0 8px;
  width: 40px;
  background-color: var(--card-background);
  opacity: 0;
  transition: opacity 200ms;
}

img:hover {
  opacity: 1;
}

img.playing {
  opacity: 1;
}
</style>
