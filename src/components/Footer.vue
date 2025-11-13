<template>
  <footer class="flex flex-col shrink bg-primary-red align-bottom self-end pt-4 px-4">
    <section
      class="flex flex-col items-center justify-center gap-3 p-2 mb-2 text-xs md:text-sm lg:text-base xl:text-lg"
    >
      <ul class="flex gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        <li>
          <a href="mailto:isaiascandido92@outlook.com" @click="redirectToSendEmail">
            <FaEnvelopeOpen
              class="h-4 w-4 md:w-6 md:h-6 lg:h-7 lg:w-7 xl:h-9 xl:w-9 text-zinc-50"
            />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/isaias-c-dev-full-stack">
            <SiLinkedin class="h-4 w-4 md:w-6 md:h-6 lg:h-7 lg:w-7 xl:h-9 xl:w-9 text-zinc-50" />
          </a>
        </li>
        <li>
          <a
            href="https://api.whatsapp.com/send?phone=55991823188&text=Ol%C3%A1%21%20Encontrei%20seu%20trabalho%20atrav%C3%A9s%20do%20site%20Pix%20Link%20e%20fiquei%20interessado%20em%20conhecer%20melhor%20seus%20servi%C3%A7os%20%F0%9F%98%8A%0AMe%20conta%20um%20pouco%3A%20voc%C3%AA%20est%C3%A1%20buscando%20cria%C3%A7%C3%A3o%20de%20site%2C%20loja%20virtual%20ou%20algum%20outro%20tipo%20de%20projeto%3F%0AEnquanto%20isso%2C%20d%C3%A1%20uma%20olhadinha%20no%20meu%20portf%C3%B3lio%20pra%20conhecer%20melhor%20meu%20trabalho%3A%0Ahttps%3A%2F%2Fportifolio-pessoal-v2.vercel.app%2F"
          >
            <GrWhatsapp class="h-4 w-4 md:w-6 md:h-6 lg:h-7 lg:w-7 xl:h-9 xl:w-9 text-zinc-50" />
          </a>
        </li>
      </ul>
      <div class="text-zinc-50">
        <h6 class="flex items-center gap-1 text-sm md:text-lg lg:text-xl xl:text-2xl">
          Isaias Candido
          <MdTerminal class="h-4 w-4 md:w-6 md:h-6" />
        </h6>
      </div>
    </section>
    <div class="relative flex items-center">
      <div
        class="h-0.5 grow md:h-1 w-3/4 lg:h-1.5 rounded-full bg-linear-to-r from-transparent via-secondary-red to-transparent shadow-[0_0_8px_rgb(135, 10, 40)]"
      ></div>
    </div>
    <p class="text-center text-xs text-zinc-100 p-4">
      &copy; {{ currentYear }} Pix Link. Todos os direitos reservados.
    </p>
  </footer>
</template>

<script setup lang="ts">
import { FaEnvelopeOpen } from 'vue-icons-plus/fa'
import { SiLinkedin } from 'vue-icons-plus/si'
import { GrWhatsapp } from 'vue-icons-plus/gr'
import { MdTerminal } from 'vue-icons-plus/md'

const currentYear: string = new Date().toLocaleDateString('pt-BR', { year: 'numeric' })
const redirectToSendEmail = (): void => {
  window.location.href = 'mailto:isaiascandido92@outlook.com'
}
</script>
