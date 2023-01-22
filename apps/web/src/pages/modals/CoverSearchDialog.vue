<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from 'shared/api'
import { Dialog } from 'shared/ui'
import Spinner from "shared/ui/Spinner.vue";

const { params } = defineProps<{ params: { query: string; apply: (value: string) => void } }>()
const emit = defineEmits(['close'])

const text = ref(params.query ?? '')

const covers = ref<null | string[]>(null)

const search = async () => {
  covers.value = null

  covers.value = await api.covers.getCovers(text.value)
}

const apply = (url: string) => {
  params.apply(url)
  emit('close')
}

onMounted(search)
</script>

<template>
  <Dialog title="Cover search" class="w-600px">
    <form @submit.prevent="search">
      <input class="w100%" type="text" v-model="text"/>
      <button type="submit">Search</button>
    </form>

    <div class="loading" v-if="!covers">
      <Spinner/>
    </div>

    <ul v-if="covers">
      <li v-for="url of covers" @click="apply(url)">
        <img :src="url" height="200" loading="lazy">
      </li>
    </ul>
  </Dialog>
</template>

<style scoped>
form {
  display: flex;
  gap: 16px;
}

.loading {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 16px;
}

ul {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 600px;

  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

li {
  cursor: pointer;
  display: block;
}

img {
  object-fit: contain;
}
</style>
