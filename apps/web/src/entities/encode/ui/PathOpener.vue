<script setup lang="ts">
import { api } from 'shared/api'
const props = defineProps<{ path: string }>()

const open = () => {
  api.shell.openPath(props.path)
}
</script>

<template>
  <button class="secondary" @click="open">Open</button>
</template>
