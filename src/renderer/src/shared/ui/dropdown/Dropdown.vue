<script lang="ts">
import { computed, ref, StyleValue } from 'vue'
</script>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  size?: number
  imageSrc: string
}>()
const size = computed(() => ({ width: props.size || 24, height: props.size || 24 } as StyleValue))

const opened = ref(false)
const buttonRef = ref<HTMLElement>()
const position = ref({ left: '0px', top: '0px' })

const open = () => {
  const { left, bottom } = buttonRef.value?.getBoundingClientRect() || { left: 0, bottom: 0 }

  position.value = {
    left: `${left}px`,
    top: `${bottom}px`,
  }

  if (!opened.value) {
    opened.value = true

    setTimeout(() => {
      document.body.addEventListener('click', function close() {
        opened.value = false
        document.body.removeEventListener('click', close)
      })
    })
  }
}

const dropdownShown = (ref: any | null) => {
  if (ref) {
    const { left, width, top, height } = ref.getBoundingClientRect()
    const { innerWidth, innerHeight } = window
    const [maxWidth, maxHeight] = [innerWidth - width - 12, innerHeight - height - 12]

    if (left > maxWidth || top > maxHeight) {
      position.value = {
        left: Math.min(left, maxWidth) + 'px',
        top: Math.min(top, maxHeight) + 'px',
      }
    }
  }
}
</script>

<template>
  <div class="dropdown">
    <img class="dropbtn" :src="props.imageSrc" :style="size" @click="open" ref="buttonRef" />

    <teleport v-if="opened" to="#modals">
      <div class="dropdown-content" :style="position" :ref="dropdownShown">
        <div v-if="title" class="dropdown-content__title text-m">{{ title }}</div>
        <slot></slot>
      </div>
    </teleport>
  </div>
</template>

<style>
.dropbtn {
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: fixed;
  background-color: var(--card-background);
  border-radius: 12px;
  max-width: 400px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.dropdown-content__title {
  padding: 16px;
}
</style>
