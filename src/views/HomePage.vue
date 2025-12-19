<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <Header />
    <main class="flex-1 flex items-center justify-center overflow-hidden relative">
      <!-- Camada de fundo com imagem -->
      <div
        class="absolute inset-0 bg-[url('/image/setup_gamer_white.webp')] bg-cover bg-position-[center_left_35%] bg-no-repeat brightness-[0.45] contrast-[1.15] saturate-105 sm:bg-position-[center_35%] md:bg-position-[center_40%] lg:bg-position-[center_50%] lg:brightness-[0.42] lg:contrast-[1.18]"
      ></div>

      <!-- Base PRETA dominante (substituiu verde como base) -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Toque SUTIL de verde (apenas 15% de opacidade) -->
      <div class="absolute inset-0 bg-[rgb(0,37,23)]/15"></div>

      <!-- Efeito Buraco de Fechadura - PRETO nas bordas -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.95)_100%)]"></div>

      <!-- Gradiente vertical - PRETO no topo/fundo -->
      <div class="absolute inset-0 bg-linear-to-b from-black/85 via-transparent via-25% to-black/85"></div>

      <!-- Gradiente lateral - PRETO nas laterais -->
      <div class="absolute inset-0 bg-linear-to-r from-black/75 via-transparent via-18% to-black/75"></div>

      <!-- Sombra extra no topo - PRETO -->
      <div class="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-black to-transparent opacity-70"></div>

      <!-- Sombra extra no fundo - PRETO -->
      <div class="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-black to-transparent opacity-70"></div>

      <!-- Detalhes verdes SUTIS nos cantos (apenas perceptível) -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,97,60,0.12)_0%,transparent_40%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,97,60,0.1)_0%,transparent_40%)]"></div>

      <!-- Conteúdo -->
      <div class="relative z-10 w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4">
        <DonationForm />
      </div>
    </main>
    <Footer @show-about="$emit('show-about')" />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import DonationForm from '@/components/DonationForm.vue'
</script>

<style scoped>
/* Apenas para garantir que o breakpoint 3xl funcione caso não esteja no @theme */
@media (min-width: 100rem) {
  .max-w-5xl {
    max-width: 64rem;
  }
}
</style>
