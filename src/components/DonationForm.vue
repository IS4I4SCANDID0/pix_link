<script setup lang="ts">
import usePixDonation from '@/composables/useDonation'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
// import FeedbackMessage from '@/components'
import { TbCopy, TbCopyCheck } from 'vue-icons-plus/tb'

const {
  showModal,
  modalType,
  giverName,
  amount,
  pixPayload,
  isAmountValid,
  isDonationPending,
  qrcodeUrl,
  handleModalOpen,
  handleModalClose,
  handleCopy,
  isCopied,
  screenMessage,
  showMessage,
} = usePixDonation()

// Handler do formulário (executa a geração antes de abrir o modal)
const handleSubmit = (e: Event) => {
  e.preventDefault()
  // A geração será feita dentro do openModal para garantir que o payload
  // está pronto antes de mostrar o modal.
}
</script>

<template>
  <div class="max-w-md w-[92%] md:w-2/3 mx-auto relative border-2 border-amber-500">
    <!-- Mensagem de Feedback Flutuante -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="screenMessage"
        :class="[
          'fixed top-4 left-1/2 -translate-x-1/2 mx-auto z-50 px-6 py-3 rounded shadow-lg font-manrope font-semibold text-sm',
          screenMessage.isError ? 'bg-secondary-red text-white' : 'bg-secondary-green text-white',
        ]"
      >
        {{ screenMessage.text }}
      </div>
    </Transition>
    <form
      class="w-full h-full rounded-md px-2 py-6 border border-zinc-50 bg-primary-green/75"
      @submit="handleSubmit"
    >
      <label for="giver-name" class="block text-sm font-semibold text-zinc-50 mb-2">Nome:</label>
      <input
        v-model="giverName"
        type="text"
        id="giver-name"
        name="giver-name"
        placeholder="Digite seu nome"
        :class="[
          'w-full p-2 border border-white placeholder:text-white placeholder:text-sm placeholder:md:text-base rounded-md text-white mb-4 focus:outline-none',
          !screenMessage?.isError
            ? 'focus:ring-2 focus:ring-green-500'
            : 'focus:ring-2 focus:ring-red-500',
        ]"
      />
      <label for="donation-amount" class="block text-sm font-semibold text-zinc-50 mb-2"
        >Valor a doar:</label
      >
      <input
        v-model.number="amount"
        type="number"
        id="donation-amount"
        name="donation-amount"
        min="1"
        step="0.1"
        placeholder="Digite o valor em R$"
        :class="[
          'w-full p-2 outline-none border border-white placeholder:text-white placeholder:text-sm placeholder:md:text-base rounded-md  text-white mb-4 focus:outline-none',
          !screenMessage?.isError
            ? 'focus:ring-2 focus:ring-green-500'
            : 'focus:ring-2 focus:ring-red-500',
        ]"
      />

      <div class="flex md:flex-col items-center gap-5 mt-2 text-zinc-50">
        <BaseButton
          bgColor="bg-secondary-red"
          textColor="text-zinc-50"
          hoverColor="hover:bg-secondary-green hover:text-zinc-50"
          class="h-8 w-full text-xs md:text-base"
          @click="handleModalOpen('qrcode')"
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
          <h4 class="font-black text-secondary-green">Esacaneie o QR Code</h4>
          <div class="flex justify-center items-center p-0">
            <img
              :src="qrcodeUrl"
              aria-label="Aponte câmera do smartphone, ou passe o scan do navegador para escanear este QR Code"
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
  </div>
</template>
