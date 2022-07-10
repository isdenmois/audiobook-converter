<script setup lang="ts">
import { Dialog } from 'shared/ui'
import { removeBook } from '../model'

const { params } = defineProps<{ params: { book: any } }>()
const emit = defineEmits(['close'])

const remove = () => {
  removeBook(params.book.id)
  emit('close')
}
</script>

<template>
  <Dialog title="Do you really want to remove this book?" :description="params.book.title">
    <div class="flex flex-row justify-end gap-2">
      <button class="secondary" @click="$emit('close')">Cancel</button>
      <button class="dangerous" @click="remove">Remove</button>
    </div>
  </Dialog>
</template>
