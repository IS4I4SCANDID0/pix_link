<template>
  <form
    class="max-w-md w-[92%] md:w-2/3 mx-auto px-2 py-6 rounded-md border border-zinc-50 bg-primary-green/75"
  >
    <label for="giver-name" class="block text-sm font-semibold text-zinc-50 mb-2"
      >Nome do Doador:</label
    >
    <input
      type="text"
      id="giver-name"
      name="giver-name"
      min="1"
      step="any"
      placeholder="Digite seu nome"
      class="w-full p-2 border border-zinc-300 placeholder:text-zinc-400 placeholder:text-sm placeholder:md:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-zinc-50 mb-4"
    />
    <label for="donation-amount" class="block text-sm font-semibold text-zinc-50 mb-2"
      >Valor da Doação:</label
    >
    <input
      type="number"
      id="donation-amount"
      name="donation-amount"
      min="1"
      step="any"
      placeholder="Digite o valor em R$"
      class="w-full p-2 outline-none border border-zinc-300 placeholder:text-zinc-400 placeholder:text-sm placeholder:md:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-zinc-50 mb-4"
    />
  </form>
</template>
