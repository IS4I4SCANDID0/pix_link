<script setup lang="ts">
import usePixDonation from '@/composables/useDonation'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
import { TbCopy, TbCopyCheck } from 'vue-icons-plus/tb'

const {
  showModal,
  modalType,
  giverName,
  amount,
  pixPayload,
  isAmountValid,
  qrcodeUrl,
  handleModalOpen,
  handleModalClose,
  handleCopy,
} = usePixDonation()

// Handler do formulário (executa a geração antes de abrir o modal)
const handleSubmit = (e: Event) => {
  e.preventDefault()
  // A geração será feita dentro do openModal para garantir que o payload
  // está pronto antes de mostrar o modal.
}
</script>

<template>
  <form
    class="max-w-md w-[92%] md:w-2/3 mx-auto px-2 py-6 rounded-md border border-zinc-50 bg-primary-green/75"
    @submit="handleSubmit"
  >
    <label for="giver-name" class="block text-sm font-semibold text-zinc-50 mb-2"
      >Nome do Doador:</label
    >
    <input
      v-model="giverName"
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
      v-model.number="amount"
      type="number"
      id="donation-amount"
      name="donation-amount"
      min="1"
      step="any"
      placeholder="Digite o valor em R$"
      class="w-full p-2 outline-none border border-zinc-300 placeholder:text-zinc-400 placeholder:text-sm placeholder:md:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-zinc-50 mb-4"
    />

    <div class="flex md:flex-col items-center gap-5 mt-2 text-zinc-50">
      <BaseButton
        bgColor="bg-secondary-red"
        textColor="text-zinc-50"
        hoverColor="hover:bg-secondary-green hover:text-zinc-50"
        class="h-8 w-full text-xs md:text-base"
        @click="handleModalOpen('qrcode')"
        :disabled="!isAmountValid"
      >
        Gerar QR Code
      </BaseButton>

      <span class="font-medium font-manrope text-sm md:text-base xl:text-xl">ou</span>

      <BaseButton
        bgColor="bg-zinc-50"
        textColor="text-zinc-800"
        hoverColor="hover:bg-secondary-red hover:text-zinc-50"
        class="h-8 w-full transition-all duration-300 text-xs md:text-base"
        @click="handleModalOpen('pixkey')"
        :disabled="!isAmountValid"
      >
        Copiar Chave Pix
      </BaseButton>
    </div>

    <BaseModal
      :visible="showModal"
      contentClass="rounded-md p-6 w-80 flex flex-col items-center gap-4"
      @close="handleModalClose"
    >
      <template v-if="modalType === 'qrcode' && qrcodeUrl">
        <h4 class="font-black text-secondary-red">Esacaneie o QR Code</h4>
        <div class="flex justify-center items-center">
          <img
            :src="qrcodeUrl"
            alt="QR Code para Doação via PIX"
            class="w-48 h-48 rounded border-2 border-secondary-green"
          />
        </div>
        <span class="text-center text-sm text-secondary-red mt-2 font-bold"
          >Valor doado: R$ {{ amount?.toFixed(2) }}</span
        >
        <p v-if="giverName" class="text-center text-sm text-secondary-red mt-2 font-bold">
          Obrigado pela sua doação, {{ giverName }}! 👏
        </p>
      </template>

      <template v-if="modalType === 'pixkey'">
        <h4 class="font-black text-secondary-green">Copie e Cole</h4>
        <div
          @click="handleCopy"
          role="textbox"
          tabindex="0"
          class="max-w-full h-10 flex gap-2.5 px-2 bg-secondary-green items-center justify-center rounded-sm"
        >
          <div
            role="textbox"
            tabindex="0"
            class="max-w-full items-center text-white text-nowrap overflow-x-scroll pr-1 font-mono"
          >
            {{ pixPayload }}
          </div>
          <BaseButton class="bg-transparent max-w-fit max-h-full">
            <TbCopy
              role="button"
              tabindex="0"
              aria-labelledby="Botão para pix copia e cola"
              @click="handleCopy"
              @keydown.enter="handleCopy"
              @keydown.space.prevent="handleCopy"
              class="text-white"
            />
          </BaseButton>
        </div>
        <span class="text-center text-sm text-secondary-red font-bold">
          Valor doado: R$ {{ amount?.toFixed(2) }}</span
        >
        <p v-if="giverName" class="text-center text-sm text-secondary-red mt-2 font-bold">
          Obrigado pela sua doação, {{ giverName }}! 👏
        </p>
      </template>
    </BaseModal>
  </form>
</template>
