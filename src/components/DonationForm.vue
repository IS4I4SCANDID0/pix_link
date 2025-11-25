<script setup lang="ts">
import useDonation from '@/composables/useDonation'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
// import FeedbackMessage from '@/components'
import { TbCopy, TbCopyCheck } from 'vue-icons-plus/tb'
import useFeedbackMessage from '@/composables/useFeedback'

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
  isCopied,
  screenMessage,
  showMessage,
  nameError,
  amountError,
  clearNameError,
  clearAmountError,
} = useDonation()

// Handler do formulário (executa a geração antes de abrir o modal)
const handleSubmit = (e: Event) => {
  e.preventDefault()
  // A geração será feita dentro do openModal para garantir que o payload
  // está pronto antes de mostrar o modal.
}
// // Limpa os erros quando o usuário começa a digitar
// const handleNameInput = () => {
//   if (nameError.value) {
//     nameError.value = false
//   }
// }

// const handleAmountInput = () => {
//   if (amountError.value) {
//     amountError.value = false
//   }
// }

console.log('nameError:', nameError)
console.log('amountError:', amountError)
</script>

<template>
  <div class="max-w-md w-[92%] md:w-2/3 mx-auto relative border border-yellow-200">
    <form class="w-full h-full rounded-2xl px-4 py-8 border-2 border-zinc-50 bg-primary-green/75 shadow-lg backdrop-blur-sm" @submit.prevent>
      <!-- Input Nome -->
      <label for="giver-name" class="block text-sm font-semibold text-zinc-50 mb-2">Nome:</label>
      <input
        v-model="giverName"
        @input="clearNameError"
        type="text"
        id="giver-name"
        placeholder="Digite seu nome"
        :class="[
          'w-full p-3 rounded-lg outline-none bg-transparent placeholder:text-zinc-200 text-white mb-4 transition-all duration-200 autofill:bg-transparent',
          // Lógica de Erro vs Foco
          nameError ? 'border-2 border-red-500 ring-2 ring-red-400/50' : 'border-2 border-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50',
        ]"
      />

      <!-- Input Valor -->
      <label for="donation-amount" class="block text-sm font-semibold text-zinc-50 mb-2">Valor a doar (R$):</label>
      <input
        v-model.number="amount"
        @input="clearAmountError"
        type="number"
        id="donation-amount"
        min="0.1"
        step="0.01"
        placeholder="Digite o valor"
        :class="[
          'w-full p-3 rounded-lg outline-none bg-transparent placeholder:text-zinc-200 text-white mb-6 transition-all duration-200 autofill:bg-transparent',
          // Lógica de Erro vs Foco
          amountError ? 'border-2 border-red-500 ring-2 ring-red-400/50' : 'border-2 border-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50',
        ]"
      />

      <!-- Botões -->
      <div class="max-w-full flex md:flex-col flex-auto md:flex-none items-center text-xs md:text-base gap-2 mt-2">
        <BaseButton
          bgColor="bg-secondary-red"
          textColor="text-zinc-50"
          hoverColor="hover:bg-opacity-90"
          class="h-10 w-full font-bold shadow-md"
          @click="handleModalOpen('qrcode')"
        >
          Gerar QR Code
        </BaseButton>

        <span class="font-medium text-white text-sm">ou</span>

        <BaseButton
          bgColor="bg-zinc-50"
          textColor="text-zinc-800"
          hoverColor="hover:bg-gray-200"
          class="h-10 w-full font-bold shadow-md"
          @click="handleModalOpen('pixkey')"
        >
          Copiar Chave Pix
        </BaseButton>
      </div>

      <!-- MODAL -->
      <BaseModal :visible="showModal" contentClass="rounded-xl p-6 w-80 flex flex-col items-center gap-4 bg-white shadow-2xl" @close="handleModalClose">
        <!-- Conteúdo QR Code -->
        <template v-if="modalType === 'qrcode' && qrcodeUrl">
          <h4 class="font-black text-xl text-secondary-red">Escaneie o QR Code</h4>
          <div class="p-1 rounded border-4 border-secondary-green">
            <img :src="qrcodeUrl" alt="QR Code PIX" class="w-48 h-48 rounded" />
          </div>
          <span class="text-secondary-red font-extrabold text-lg">{{ amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
        </template>

        <!-- Conteúdo Copia e Cola -->
        <template v-if="modalType === 'pixkey'">
          <h4 class="font-black text-xl text-secondary-green">Copie e Cole</h4>

          <div
            @click="handleCopy"
            class="w-full h-12 flex items-center justify-between px-3 bg-secondary-green rounded-lg cursor-pointer hover:opacity-90 transition shadow-md gap-2"
          >
            <div class="flex-1 overflow-x-auto text-white text-xs font-mono whitespace-nowrap mask-fade">
              {{ pixPayload }}
            </div>

            <div class="text-white flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-xs font-bold">
              <component :is="isCopied ? TbCopyCheck : TbCopy" class="text-lg" />
              <span>{{ isCopied ? 'Copiado!' : 'Copiar' }}</span>
            </div>
          </div>

          <span class="text-secondary-red font-extrabold mt-2">{{ amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
        </template>

        <p v-if="giverName" class="text-center text-sm text-gray-500 mt-2 font-medium">Obrigado por contribuir, {{ giverName }}! 👏</p>
      </BaseModal>
    </form>
  </div>
</template>

<style scoped>
/* Efeito visual para o texto longo do PIX não cortar bruscamente */
.mask-fade {
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
}
</style>
