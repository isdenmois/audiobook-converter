<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <h3>Count is: {{ count }}</h3>

  <p>
    <button type="button" @click="count++">++</button>
    <button type="button" @click="count > 0 && count--">--</button>
  </p>

  <p></p>
</template>
