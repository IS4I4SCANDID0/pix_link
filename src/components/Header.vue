<template>
  <header
    class="bg-linear-to-br from-primary-green via-primary-red to-primary-green text-white p-4 lg:p-8 font-manrope relative"
  >
    <div class="flex flex-col justify-center items-center relative text-center gap-6 py-4">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-black text-shadow-lg/20 text-center">
        🤍 Faça a Diferença 🤍
      </h1>
      <h4 class="text-md md:text-xl lg:text-2xl font-semibold text-shadow-lg/10 max-w-md">
        Mantenha a live no ar! Seu PIX é o buff que o streamer precisa agora ⚡
      </h4>
    </div>

    <!-- <PhraseSelectorModal
      v-if="showModal"
      :headlines="allHeadlines"
      :selectedHeadline="currentHeadLine"
      @close="showModal = false"
      @select="handleSelect"
    /> -->
  </header>
</template>

<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from './BaseButton.vue'

const showModal = ref(false)
// const allHeadlines = TEXT_OPTIONS.TEXT_HEADLINES
const currentHeadLine = ref(allHeadlines[0])

const handleSelect = (newHeadline: string) => {
  currentHeadLine.value = newHeadline
  showModal.value = false

  localStorage.setItem('@pixlink_headline', newHeadline)
}
onMounted(() => {
  const savedHeadLinne = localStorage.getItem('@pixlink_headline')
  if (savedHeadLinne) {
    currentHeadLine.value = savedHeadLinne
  }
})
</script> -->
