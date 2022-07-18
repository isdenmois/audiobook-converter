<script setup lang="ts">
import { Dialog } from 'shared/ui'

const { params } = defineProps<{ params: { error: string } }>()
const emit = defineEmits(['close'])
</script>

<template>
  <Dialog title="Error" :description="params.error">
    <div class="flex flex-row justify-end gap-2">
      <button class="secondary" @click="$emit('close')">Close</button>
    </div>
  </Dialog>
</template>
