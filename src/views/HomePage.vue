<template>
  <div class="h-full w-full flex flex-col overflow-hidden">
    <Header />
    <main class="flex-1 flex items-center justify-center relative py-8 lg:py-12">
      <!-- ==================== LAYER 1: Imagem Base (Mais Visível) ==================== -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/image/setup_gamer_white.webp'); filter: brightness(0.55) contrast(1.05) saturate(0.9)"
      ></div>

      <!-- ==================== LAYER 2: Overlay Suave ==================== -->
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- ==================== LAYER 3: Gradiente Verde Sutil ==================== -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(135deg, rgba(0, 37, 23, 0.45) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 37, 23, 0.35) 100%)"
      ></div>

      <!-- ==================== LAYER 4: Vinheta Leve (Foco no Centro) ==================== -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.25) 80%, rgba(0, 0, 0, 0.5) 100%)"
      ></div>

      <!-- ==================== LAYER 5: Brilho Verde no Centro ==================== -->
      <div class="absolute inset-0 opacity-25" style="background: radial-gradient(circle at center, rgba(0, 97, 60, 0.4) 0%, transparent 50%)"></div>

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
