<template>
  <div class="max-w-md w-[92%] md:w-2/3 mx-auto relative">
    <!-- ==================== TOOLTIP (Campo de Valor) ==================== -->
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="tooltipMessage"
        :key="tooltipMessage.id"
        class="w-[75%] max-w-md md:w-fit lg:min-w-max fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 lg:py-4 rounded-lg bg-slate-300 text-slate-800 border border-slate-800 shadow-lg font-semibold text-sm"
      >
        <GiLightBulb color="#1d293d" :size="iconSize" />
        <span>{{ tooltipMessage.text }}</span>
      </div>
    </Transition>

    <!-- ==================== MENSAGENS (Erro/Sucesso) ==================== -->
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-4"
    >
      <div
        v-if="screenMessage"
        :key="screenMessage.id"
        :class="[
          'w-[75%] max-w-md md:w-fit lg:min-w-max fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 px-4 py-2 rounded-xl shadow-2xl font-semibold text-sm lg:text-base',
          screenMessage.type === 'error'
            ? 'bg-tertiary-red text-secondary-red border-2 border-secondary-red'
            : 'bg-tertiary-green text-secondary-green border-2 border-secondary-green',
        ]"
      >
        <component class="" :is="screenMessage.type === 'error' ? PiWarningCircleFill : BsFillCheckSquareFill" />
        <span class="text-base lg:text-lg 2xl:text-xl">{{ screenMessage.text }}</span>
      </div>
    </Transition>

    <!-- ==================== FORMULÁRIO ==================== -->
    <form class="w-full h-full rounded-2xl px-4 py-8 border-2 border-white bg-primary-green/75 shadow-lg backdrop-blur-sm" @submit.prevent="handleSubmit">
      <!-- INPUT NOME -->
      <label for="giver-name" class="block text-sm font-semibold text-white mb-2"> Nome: </label>
      <input
        v-model="giverName"
        @focus="clearNameError"
        type="text"
        required="false"
        id="giver-name"
        placeholder="Digite seu nome"
        :class="[
          'w-full p-3 rounded-lg outline-none bg-transparent placeholder:text-zinc-200 text-white mb-4 transition-all duration-200 ease-in',
          nameError ? 'border-2 border-red-500 ring-2 ring-red-400/50' : 'border-2 border-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50',
        ]"
      />

      <!-- INPUT VALOR -->
      <label for="donation-amount" class="block text-sm font-semibold text-zinc-50 mb-2"> Valor a doar (R$): </label>
      <input
        v-model.number="amount"
        @focus="handleAmountFocus"
        @blur="handleAmountBlur"
        required="false"
        type="number"
        id="donation-amount"
        min="1"
        step="0.50"
        placeholder="Digite o valor"
        :class="[
          'w-full p-3 rounded-lg outline-none bg-transparent placeholder:text-white text-white mb-6 transition-all duration-200 ease-in',
          amountError ? 'border-2 border-red-500 ring-2 ring-red-400/50' : 'border-2 border-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50',
        ]"
      />

      <!-- BOTÕES -->
      <div class="flex flex-col md:flex-row items-center gap-4 mt-2">
        <BaseButton
          bgColor="bg-secondary-red"
          textColor="text-zinc-50"
          hoverColor="hover:bg-opacity-90"
          class="h-10 w-full font-bold shadow-md md:cursor-pointer"
          @click="handleModalOpen('qrcode')"
        >
          Gerar QR Code
        </BaseButton>

        <span class="font-medium text-white text-sm">ou</span>

        <BaseButton
          bgColor="bg-zinc-50"
          textColor="text-zinc-800"
          hoverColor="hover:bg-gray-200"
          class="h-10 w-full font-bold shadow-md md:cursor-pointer"
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
          <span class="text-secondary-red font-extrabold text-lg">
            {{ amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </span>
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
          <span class="text-secondary-red font-extrabold mt-2">
            {{ amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </span>
        </template>

        <p v-if="giverName" class="text-center text-sm text-gray-500 mt-2 font-medium">Obrigado por contribuir, {{ giverName }}! 👏</p>
      </BaseModal>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useDonationStore } from '@/stores/donation.store'
import { useFeedbackStore } from '@/stores/feedback.store'
import { storeToRefs } from 'pinia'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
import { TbCopy, TbCopyCheck } from 'vue-icons-plus/tb'
import { GiLightBulb } from 'vue-icons-plus/gi'
import { BsFillCheckSquareFill } from 'vue-icons-plus/bs'
import { PiWarningCircleFill } from 'vue-icons-plus/pi'
import { useBreakpoint } from '@/composables/useBreakpoint'

// ========== STORES ==========
const donationStore = useDonationStore()
const feedbackStore = useFeedbackStore()

// ========== ESTADO REATIVO ==========
const { showModal, modalType, giverName, amount, pixPayload, qrcodeUrl, nameError, amountError } = storeToRefs(donationStore)
const { tooltipMessage, screenMessage, isCopied } = storeToRefs(feedbackStore)

// ========== ACTIONS ==========
const { handleModalOpen, handleModalClose, handleCopy, clearNameError, clearAmountError, handleAmountFocus, handleAmountBlur } = donationStore

const handleSubmit = () => {
  // Previne comportamento padrão do form
}

const { iconSize } = useBreakpoint()
</script>

<style scoped>
.mask-fade {
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
}
</style>
