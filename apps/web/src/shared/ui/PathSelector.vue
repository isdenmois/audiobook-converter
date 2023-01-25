<script setup lang="ts">
import { api } from 'shared/api'
import { ellipsisIcon } from 'shared/assets'

const props = defineProps<{ path: string; disabled?: boolean }>()

const emit = defineEmits(['select'])

const selectPath = async () => {
  try {
    const path = await api.dialog.selectDirectory(props.path || '')

    emit('select', path)
  } catch {}
}
</script>

<template>
  <div class="container editable text-xs flex flex-row b-rd-1">
    <div class="path text px-2 py-1.5 flex-1">{{ path }}</div>

    <button
      v-if="!disabled"
      class="secondary selector flex justify-center items-center"
      type="button"
      @click="selectPath"
    >
      <img :src="ellipsisIcon" />
    </button>
  </div>
</template>

<style scoped>
.container {
  color: var(--disabled-primary-text);
  min-width: 250px;
}
.editable {
  background-color: var(--background);
}

.path {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selector {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  width: 40px;
}
</style>
