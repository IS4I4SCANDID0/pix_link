<template>
  <div class="h-svh w-svw flex flex-col overflow-hidden">
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <HomePage v-if="!showAbout" @show-about="showAbout = true" key="home" />

      <AboutPage v-else @close="showAbout = false" key="about" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'

const showAbout = ref(false)
</script>
