<template>
  <Header />
  <main
    class="max-w-svw bg-primary-green border-2 border-sky-400 flex flex-col items-center justify-center bg-[url('/image/setup_gamer_white.webp')] bg-contain bg-center bg-no-repeat py-11"
  >
    <DonationForm />
  </main>
  <Footer />
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import DonationForm from './components/DonationForm.vue'
</script>
