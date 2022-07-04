<script setup lang="ts">
import { unref, ref, toRaw, computed } from 'vue'
import { Dropdown, DropdownItem } from 'shared/ui'
import { formatDuration } from 'shared/lib'
import { currentIcon, currentAndBelowIcon } from 'shared/assets'
import { api } from 'shared/api'

const props = defineProps(['book'])
const emit = defineEmits(['save', 'skip'])

let image = ref(props.book.image)
let title = ref(props.book.title)
let author = ref(props.book.author)
let speed = ref(1.6)
let chapters = ref(props.book.chapters.map((chapter: any) => ({ ...chapter })))

const tags = Object.values(props.book.chapters[0].tags)

const duration = computed(() => formatDuration(props.book.duration / speed.value))

const setChaptersTags = (index: number, tag: string) => {
  chapters.value.forEach((chapter: any, i: number) => {
    if (i >= index) {
      chapter.title = chapter.tags[tag]
    }
  })
}

const save = () => {
  emit('save', {
    ...props.book,
    title: unref(title),
    author: unref(author),
    image: unref(image),
    speed: unref(speed),
    chapters: toRaw(chapters.value),
  })
}

const selectCover = async () => {
  try {
    const [imagePath] = await api.dialog.openCover()

    image.value = imagePath
  } catch {}
}
</script>
<template>
  <div @click="selectCover">
    <img v-if="image" :src="`atom://${image}`" :alt="title" class="cover" />
    <div v-else class="cover cover_empty" />
  </div>

  <p>
    <input type="text" v-model="title" />
    <Dropdown :image-src="currentIcon">
      <DropdownItem v-for="tag of tags" @click="title = tag">{{ tag }}</DropdownItem>
    </Dropdown>
  </p>
  <p>
    <input type="text" v-model="author" />
    <Dropdown :image-src="currentAndBelowIcon">
      <DropdownItem v-for="tag of tags" @click="author = tag">{{ tag }}</DropdownItem>
    </Dropdown>
  </p>

  <p>
    <input type="range" min="0.1" max="2.0" step="0.1" :value="speed" @input="speed = +$event.target.value" />
    <span>{{ speed }}x, {{ duration }} </span>
  </p>

  <ol>
    <li v-for="(chapter, index) in chapters">
      <input v-model="chapter.title" />

      <Dropdown :image-src="currentIcon">
        <DropdownItem v-for="tag of Object.values(chapter.tags)" @click="chapter.title = tag">{{ tag }}</DropdownItem>
      </Dropdown>

      <Dropdown :image-src="currentAndBelowIcon">
        <DropdownItem v-for="tag of Object.keys(chapter.tags)" @click="setChaptersTags(index, tag)">{{
          chapter.tags[tag]
        }}</DropdownItem>
      </Dropdown>
    </li>
  </ol>

  <button @click="save">Save</button>
  <button @click="emit('skip')">Skip</button>
</template>

<style scoped>
.cover {
  cursor: pointer;
  width: 184px;
  height: 184px;
  border-radius: 16px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  object-fit: cover;
}

.cover_empty {
  background-color: gray;
}
</style>
