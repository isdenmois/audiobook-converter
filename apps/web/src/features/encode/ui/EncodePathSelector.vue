<script setup lang="ts">
import { defineProps } from 'vue'
import { PathSelector } from 'shared/ui'
import { updateSavePath } from '../model'

defineProps<{ path: string; disabled?: boolean }>()
</script>

<template>
  <PathSelector :path="path" :disabled="disabled" @select="updateSavePath" />
</template>
