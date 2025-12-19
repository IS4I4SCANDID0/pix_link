<template>
  <div class="max-w-md w-[97%] lg:w-[400px] mx-auto relative">
    <!-- ==================== TOOLTIP (Campo de Valor) ==================== -->
    <Teleport to="body">
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
          class="min-w-fit max-w-md lg:min-w-max fixed text-nowrap top-4 left-1/2 -translate-x-1/2 z-10000 flex items-center gap-2 py-3 px-4 lg:py-4 rounded-lg bg-slate-300 text-slate-800 border border-slate-800 shadow-2xl font-semibold text-sm"
        >
          <GiLightBulb color="#1d293d" class="w-4 h-4 lg:w-5.5 lg:h-5.5 3xl:w-6 3xl:h-6 4xl:w-6.5 4xl:h-6.5" />
          <span class="text-base lg:max-3xl:text-lg 3xl:max-4xl:text-xl 4xl:text-2xl">{{ tooltipMessage.text }}</span>
        </div>
      </Transition>
    </Teleport>

    <!-- ==================== MENSAGENS COM TELEPORT ==================== -->
    <Teleport to="body">
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
            'min-w-fit max-w-md md:w-fit lg:min-w-max fixed top-4 left-1/2 -translate-x-1/2 z-10000 flex items-center justify-center text-center gap-2 p-4 rounded-xl shadow-2xl font-semibold text-sm lg:text-base text-nowrap',
            screenMessage.type === 'error'
              ? 'bg-tertiary-red text-secondary-red border-2 border-secondary-red'
              : 'bg-tertiary-green text-secondary-green border-2 border-secondary-green',
          ]"
        >
          <component
            class="w-4 h-4 lg:w-5.5 lg:h-5.5 3xl:w-6 3xl:h-6 4xl:w-6.5 4xl:h-6.5"
            :is="screenMessage.type === 'error' ? PiWarningCircleFill : BsFillCheckSquareFill"
          />
          <span class="text-base lg:max-3xl:text-lg 3xl:max-4xl:text-xl 4xl:text-2xl">{{ screenMessage.text }}</span>
        </div>
      </Transition>
    </Teleport>

    <!-- ==================== FORMULÁRIO ==================== -->
    <form
      class="w-full h-full rounded-2xl px-3.5 py-6.5 lg:py-10 3xl:py-10.5 4xl:py-11 border-2 border-white bg-primary-green"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <!-- INPUT NOME -->
      <label for="giver-name" class="block text-sm lg:text-base 3xl:text-lg font-semibold text-white mb-2"> Nome: </label>
      <input
        v-model="giverName"
        @focus="clearNameError"
        type="text"
        id="giver-name"
        placeholder="Digite seu nome"
        :class="[
          'w-full p-3 rounded-lg outline-none bg-transparent placeholder:text-zinc-200 text-white mb-4 lg:mb-6 transition-all duration-300 ease-in-out',
          nameError
            ? 'border-2 border-red-500 ring-2 ring-red-400/50'
            : 'border-2 border-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50',
        ]"
      />

      <!-- INPUT VALOR -->
      <label for="donation-amount" class="block text-sm lg:text-base 3xl:text-lg font-semibold text-white mb-2"> Valor a doar (R$): </label>
      <input
        v-model.number="amount"
        @focus="handleAmountFocus"
        @blur="handleAmountBlur"
        type="number"
        id="donation-amount"
        min="1"
        step="0.50"
        placeholder="Digite o valor"
        :class="[
          'w-full p-3 rounded-lg outline-none bg-transparent placeholder:text-white text-white mb-6 transition-all duration-300 ease-in-out',
          amountError
            ? 'border-2 border-red-500 ring-2 ring-red-400/50'
            : 'border-2 border-white focus:border-green-400 focus:ring-2 focus:ring-green-400/50',
        ]"
      />

      <!-- BOTÕES -->
      <div class="flex flex-col items-center gap-2 mt-3 lg:mt-4">
        <BaseButton
          bgColor="bg-secondary-red"
          textColor="text-white"
          :disabled="cooldownTime"
          class="h-10 lg:h-12 3xl:h-14 4xl:h-16 w-full inline-flex justify-center items-center gap-1 font-bold shadow-md md:cursor-pointer text-sm md:text-base 3xl:text-lg hover:bg-tertiary-red hover:text-primary-red transition-colors duration-1000 ease-in-out disabled:bg-linear-to-r disabled:from-slate-600 disabled:to-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed disabled:shadow-inner"
          @click="handleModalOpen('qrcode')"
        >
          <template v-if="cooldownTime > 0">
            <span class="max-w-fit flex items-center justify-center gap-4 transition-all duration-700">
              <span>Aguarde</span>
              <Transition mode="out-in" enter-active-class="animate-regressive-fade-enter" leave-active-class="animate-regressive-fade-leave">
                <span :key="cooldownTime" class="tabular-nums">{{ cooldownTime }}s</span>
              </Transition>
            </span>
          </template>
          <template v-else>Gerar QR Code</template>
        </BaseButton>

        <span class="font-medium text-white text-sm md:text-base 3xl:text-lg">ou</span>

        <BaseButton
          bgColor="bg-white"
          textColor="text-secondary-green"
          :disabled="cooldownTime > 0"
          class="h-10 lg:h-12 w-full 3xl:h-14 4xl:h-16 font-bold shadow-md md:cursor-pointer text-sm md:text-base 3xl:text-lg 4xl:text-xl hover:bg-tertiary-green hover:text-primary-green transition-colors duration-1000 ease-in-out disabled:bg-linear-to-r disabled:from-slate-600 disabled:to-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed disabled:shadow-inner"
          @click="handleModalOpen('pixkey')"
        >
          <template v-if="cooldownTime > 0">
            <span class="w-fit flex items-center justify-center gap-4 transition-all duration-700">
              Aguarde
              <Transition mode="out-in" enter-active-class="animate-regressive-fade-enter" leave-active-class="animate-regressive-fade-leave">
                <span :key="cooldownTime" class="max-w-fit tabular-nums">{{ cooldownTime }}s</span>
              </Transition>
            </span>
          </template>
          <template v-else>Copiar Chave PIX</template>
        </BaseButton>
      </div>

      <!-- MODAL -->
      <BaseModal
        :visible="showModal"
        contentClass="rounded-xl p-6 w-80 flex flex-col items-center gap-4 bg-white shadow-2xl"
        @close="handleModalClose"
      >
        <!-- Conteúdo QR Code -->
        <template v-if="modalType === 'qrcode' && qrcodeUrl">
          <h4 class="font-black text-lg lg:text-xl text-secondary-red">Escaneie o QR Code</h4>
          <div class="p-1 rounded border-4 border-secondary-green">
            <img :src="qrcodeUrl" alt="QR Code PIX" class="w-48 h-48 rounded" />
          </div>
          <span class="text-secondary-red font-extrabold text-lg">
            {{ amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </span>
        </template>

        <!-- Conteúdo Copia e Cola -->
        <template v-if="modalType === 'pixkey'">
          <h4 class="font-black text-xl text-secondary-red">Copie e Cole</h4>
          <div
            @click="handleCopy"
            class="w-full h-12 flex items-center justify-between px-3 bg-secondary-green rounded-lg cursor-pointer hover:opacity-90 transition-all duration-700 shadow-md gap-2"
          >
            <div class="flex-1 overflow-x-scroll scroll-auto text-white text-xs font-mono whitespace-nowrap mask-fade">
              {{ pixPayload }}
            </div>
            <div class="text-white flex items-center gap-1 bg-white/20 px-2 py-1 rounded font-bold transition-all duration-1000">
              <component :is="isCopied ? TbCopyCheckFilled : TbCopy" class="text-lg" />
              <span class="text-sm">{{ isCopied ? 'Copiado!' : 'Copiar' }}</span>
            </div>
          </div>
          <span class="text-secondary-red font-extrabold mt-2">
            {{ amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </span>
        </template>

        <p v-if="giverName" class="text-center text-base lg:text-lg text-secondary-green mt-2 font-medium">
          Obrigado por apoiar, {{ giverName }}! 👏
        </p>
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
import { TbCopy, TbCopyCheckFilled } from 'vue-icons-plus/tb'
import { GiLightBulb } from 'vue-icons-plus/gi'
import { BsFillCheckSquareFill } from 'vue-icons-plus/bs'
import { PiWarningCircleFill } from 'vue-icons-plus/pi'
import { useRateLimitStore } from '@/stores/rateLimit.store'

// ========== STORES ==========
const donationStore = useDonationStore()
const feedbackStore = useFeedbackStore()
const rateLimitStore = useRateLimitStore()

// ========== ESTADO REATIVO ==========
const { showModal, modalType, giverName, amount, pixPayload, qrcodeUrl, nameError, amountError } = storeToRefs(donationStore)
const { tooltipMessage, screenMessage, isCopied } = storeToRefs(feedbackStore)
const { cooldownTime } = storeToRefs(rateLimitStore)

// ========== ACTIONS ==========
const { handleModalOpen, handleModalClose, handleCopy, clearNameError, clearAmountError, handleAmountFocus, handleAmountBlur } = donationStore

const handleSubmit = (e: Event): void => {
  e.preventDefault()
}
</script>

<style scoped>
.mask-fade {
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
}

/* Animação de entrada do contador */
.animate-regressive-fade-enter {
  animation: fadeSlideIn 0.3s ease-out;
}

/* Animação de saída do contador */
.animate-regressive-fade-leave {
  animation: fadeSlideOut 0.3s ease-in;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
}
</style>
