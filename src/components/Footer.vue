<template>
  <footer class="w-full flex flex-col shrink bg-primary-red align-bottom self-end pt-4 px-4">
    <div
      class="min-w-fit min-h-fit flex flex-col justify-center items-center gap-2 p-2 text-white relative text-xs lg:text-sm 2xl:text-lg font-medium"
    >
      <BaseButton
        @click="$emit('show-about')"
        class="max-w-fit max-h-fit flex justify-center items-center p-2 lg:p-2.5 3xl:p-3 text-sm lg:text-base font-medium cursor-pointer text-white/85 hover:text-tertiary-red hover:font-semibold transition-all duration-1000"
        hover-style="bg-transparent"
      >
        Desenvolvido por Isaias Candido
        <MdTerminal class="h-4 w-4 lg:h-4.5 lg:w-4.5 3xl:w-5 3xl:h-5 4xl:w-5.5 4xl:h-5.5 mr-4" />
        <FaChevronRight
          class="w-3 h-3 lg:h-3.5 lg:w-3.5 3xl:w-5 3xl:h-5 text-white transition-all duration-700 animate-arrow-pointing-right ease-in-out"
        />
      </BaseButton>
    </div>
    <div class="relative flex items-center">
      <div
        class="h-[0.063rem] grow md:h-[0.094rem] 2xl:h-0.5 w-3/4 rounded-full bg-linear-to-r from-transparent via-secondary-red to-transparent shadow-[0_0_8px_rgb(135, 10, 40)]"
      ></div>
    </div>
    <p class="text-center text-xs text-white/85 3xl:text-lg p-4">&copy; {{ currentYear }} Pix Link</p>
  </footer>
</template>

<script setup lang="ts">
import { MdTerminal } from 'vue-icons-plus/md'
import { FaChevronRight } from 'vue-icons-plus/fa'
import BaseButton from '@/components/BaseButton.vue'

defineEmits(['show-about'])

const currentYear: string = new Date().toLocaleDateString('pt-BR', { year: 'numeric' })
</script>
