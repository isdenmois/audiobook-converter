<script setup lang="ts">
import { computed, ref } from 'vue'
import { interpolate } from 'shared/lib'
import { Dialog } from 'shared/ui'

const { params } = defineProps<{ params: { tags: any; apply: (value: string) => void } }>()
const emit = defineEmits(['close'])
const tags: string[] = Object.keys(params.tags)

const text = ref('{{number}} - {{title}}')
const interpolated = computed(() => interpolate(text.value, params.tags))

const appendTag = (tag: string) => {
  text.value += `{{${tag}}}`
}

const apply = () => {
  params.apply(text.value)
  emit('close')
}
</script>

<template>
  <Dialog title="Chapter title editor" class="w-600px">
    <input class="w100%" type="text" v-model="text" />

    <div class="text-s mt-2">{{ interpolated }}</div>

    <ul class="mt-4 mb-0 p-0">
      <li class="secondary">
        <div>Tag</div>
        <div class="secondary">Value</div>
      </li>

      <li v-for="tag of tags" :key="tag" @click="appendTag(tag)">
        <div>
          {{ tag }}
        </div>

        <div class="text-s">
          {{ params.tags[tag] }}
        </div>
      </li>
    </ul>

    <div class="flex flex-row justify-end gap-2 mt-4">
      <button class="secondary" @click="$emit('close')">Cancel</button>
      <button @click="apply">Apply</button>
    </div>
  </Dialog>
</template>

<style scoped>
ul {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 600px;
}

li {
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  text-overflow: ellipsis;
  padding: 8px 0;
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: space-between;
}

li:hover {
  background-color: var(--background);
}
</style>
