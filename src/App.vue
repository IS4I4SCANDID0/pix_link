<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import DonationForm from './components/DonationForm.vue'
</script>

<template>
  <Header />
  <main
    class="max-h-svh h-[345px] bg-zinc-900 flex flex-col items-center justify-center bg-[url('/image/setup_gamer_white.png')]"
  >
    <DonationForm />
  </main>
  <Footer />
</template>

<style scoped></style>
