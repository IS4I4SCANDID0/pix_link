<template>
  <footer class="flex flex-col shrink bg-primary-red align-bottom self-end pt-4 px-4">
    <ul class="border border-amber-200 flex items-center justify-center gap-8 p-2">
      <li>
        <a href="mailto:isaiascandido92@outlook.com" @click="redirectToSendEmail">
          <FaEnvelopeOpen class="h-4 w-4 md:w-6 md:h-6 lg:h-7 lg:w-7 xl:h-9 xl:w-9 text-zinc-50" />
        </a>
      </li>
      <li>
        <a href="">
          <SiLinkedin class="h-4 w-4 md:w-6 md:h-6 lg:h-7 lg:w-7 xl:h-9 xl:w-9 text-zinc-50" />
        </a>
      </li>
      <li>
        <a href="">
          <GrWhatsapp class="h-4 w-4 md:w-6 md:h-6 lg:h-7 lg:w-7 xl:h-9 xl:w-9 text-zinc-50" />
        </a>
      </li>
    </ul>
    <p class="text-center text-sm text-zinc-100 p-4">
      &copy; {{ currentYear }} Pix Link. Todos os direitos reservados.
    </p>
  </footer>
</template>

<script setup lang="ts">
import { FaEnvelopeOpen } from 'vue-icons-plus/fa'
import { SiLinkedin } from 'vue-icons-plus/si'
import { GrWhatsapp } from 'vue-icons-plus/gr'

const currentYear: string = new Date().toLocaleDateString('pt-BR', { year: 'numeric' })
const redirectToSendEmail = (): void => {
  window.location.href = 'mailto:isaiascandido92@outlook.com'
}
</script>
