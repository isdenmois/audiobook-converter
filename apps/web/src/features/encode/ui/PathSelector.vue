<script setup lang="ts">
import { defineProps } from 'vue'
import { api } from 'shared/api'
import { ellipsisIcon } from 'shared/assets'
import { updateSavePath } from '../model'

defineProps<{ path: string; disabled?: boolean }>()

const selectPath = async () => {
  try {
    const path = await api.dialog.selectDirectory()

    updateSavePath(path)
  } catch {}
}
</script>

<template>
  <div class="container editable text-xs flex flex-row b-rd-1">
    <div class="path text px-2 py-1.5 flex-1">{{ path }}</div>

    <button v-if="!disabled" class="secondary selector flex justify-center items-center" @click="selectPath">
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
