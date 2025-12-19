<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-linear-to-br from-primary-green via-primary-red to-primary-green">
    <!-- Header com botão voltar -->
    <header class="shrink-0 bg-black/20 backdrop-blur-sm border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <BaseButton
          @click="$emit('close')"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-sm font-medium"
        >
          <BsArrowLeft class="w-4 h-4" />
          <span class="hidden sm:inline">Voltar</span>
        </BaseButton>
        <h1 class="text-white font-bold text-sm sm:text-base">Sobre o Desenvolvedor</h1>
        <div class="w-16 sm:w-20"></div>
        <!-- Spacer -->
      </div>
    </header>

    <!-- Conteúdo principal scrollável -->
    <main class="flex-1 overflow-auto gap-2">
      <div class="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6 sm:space-y-8">
        <!-- Hero Section -->
        <section class="text-center space-y-3 sm:space-y-4">
          <div
            class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30"
          >
            <MdTerminal class="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Isaias Candido</h2>
          <p class="text-sm sm:text-base lg:text-lg text-white/90 font-medium max-w-2xl mx-auto">
            Desenvolvedor Full Stack especializado em criar experiências web modernas e funcionais
          </p>
          <div
            class="inline-flex gap-3 px-4 py-2 rounded-full bg-secondary-green text-white text-xs sm:text-sm font-semibold items-center justify-center mx-auto"
          >
            <div class="flex gap-2 p-2 bg-primary-green rounded-full">
              <TbDeviceDesktopCode size="18" />
              <TbDeviceMobileCode size="18" />
            </div>
            <p>Disponível para Freelancer e vaga fixa</p>
          </div>
        </section>

        <!-- Cards de Contato -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- E-mail -->
          <a
            href="mailto:isaiascandido92@outlook.com?subject=Interesse%20nos%20seus%20servi%C3%A7os&body=Ol%C3%A1%20Isaias!%0A%0AEncontrei%20seu%20trabalho%20através%20do%20Pix%20Link."
            target="_blank"
            class="group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105"
          >
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-red">
              <FaEnvelopeOpen color="#ffffff" class="w-5 h-5" />
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-sm">E-mail</p>
              <p class="text-white/70 text-xs mt-1">Contato profissional</p>
            </div>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/in/isaias-c-dev-full-stack"
            target="_blank"
            class="group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105"
          >
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-[#0077B5]">
              <SiLinkedin color="#ffffff" class="w-5 h-5" />
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-sm">LinkedIn</p>
              <p class="text-white/70 text-xs mt-1">Perfil profissional</p>
            </div>
          </a>

          <!-- GitHub -->
          <a
            href="https://github.com/isaiascandido"
            target="_blank"
            class="group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105"
          >
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-[#333333]">
              <BsGithub color="#ffffff" class="w-5 h-5" />
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-sm">GitHub</p>
              <p class="text-white/70 text-xs mt-1">Projetos open source</p>
            </div>
          </a>

          <!-- WhatsApp -->
          <a
            href="https://api.whatsapp.com/send?phone=55991823188&text=Olá!%20Encontrei%20seu%20trabalho%20no%20Pix%20Link"
            target="_blank"
            class="group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-700 hover:scale-105"
          >
            <div class="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366]">
              <GrWhatsapp color="#ffffff" class="w-5 h-5" />
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-sm">WhatsApp</p>
              <p class="text-white/70 text-xs mt-1">Chat direto</p>
            </div>
          </a>
        </section>

        <!-- Portfólio -->
        <section class="space-y-4">
          <h3 class="text-xl sm:text-2xl font-bold text-white text-center mt-3">Portfólio & Projetos</h3>
          <a
            href="https://portifolio-pessoal-v2.vercel.app/"
            target="_blank"
            class="block group p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-colors duration-700"
          >
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <p class="text-white font-bold text-base sm:text-lg">Ver Portfólio Completo</p>
                <p class="text-white/70 text-xs sm:text-sm">Explore meus projetos, tecnologias e experiência</p>
              </div>
              <BsArrowRight class="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-700" />
            </div>
          </a>
        </section>

        <!-- Tech Stack -->
        <section class="space-y-4 pb-6">
          <h3 class="text-xl sm:text-2xl font-bold text-white text-center">Tecnologias</h3>
          <ul class="flex flex-wrap justify-center gap-2 sm:gap-3">
            <li
              v-for="tech in techStack"
              :key="tech.techName"
              class="inline-flex justify-center items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#333333] backdrop-blur-sm border border-white/70 text-white cursor-default text-xs sm:text-sm font-medium transition-transform duration-700 hover:scale-105"
            >
              <component :is="tech.icon" :color="tech.color" class="w-4 h-4 lg:w-4.5 lg:h-4.5 3xl:w-4.5 3xl:h-4.5 transition-transform" />
              <p>{{ tech.techName }}</p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { FaEnvelopeOpen } from 'vue-icons-plus/fa'
import { SiLinkedin } from 'vue-icons-plus/si'
import { GrWhatsapp } from 'vue-icons-plus/gr'
import { MdTerminal } from 'vue-icons-plus/md'
import { BsArrowLeft, BsArrowRight, BsGithub } from 'vue-icons-plus/bs'
import { TbDeviceDesktopCode, TbDeviceMobileCode } from 'vue-icons-plus/tb'

import BaseButton from '@/components/BaseButton.vue'
import { techStack } from '@/mock/techStaks'

defineEmits(['close'])
</script>
