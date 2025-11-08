<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
import generatePixPayload from '../modules/pixPayloadGenerate'

const showModal = ref(false)
const modalType = ref<'qrcode' | 'pixkey' | null>(null)
// Dados do Formulário (Reativos)
const giverName = ref<string>('')
const amount = ref<number | null>(null)
const pixPayload = ref<string>('')

// Configurações do .env (Ajuste conforme o seu setup real)
const PIX_KEY = import.meta.env.VITE_PIX_KEY || 'Chave não definida'
const MERCHANT_NAME = import.meta.env.VITE_MERCHANT_NAME || 'Nome não definido'
const MERCHANT_CITY = import.meta.env.VITE_MERCHANT_CITY || 'Cidade não definida'

// Validação (Habilita botões apenas se houver um valor > 0)
const isAmountValid = computed(() => amount.value !== null && amount.value > 0)

// Lógica de ações
// função para gerar o PIX e armazenar em payload
const generatePix = () => {
  if (!isAmountValid.value || amount.value === null || amount.value) return // Impede a geração se o valor for inválido

  try {
    const payload = generatePixPayload(
      PIX_KEY,
      MERCHANT_NAME,
      MERCHANT_CITY,
      amount.value,
      // Adicionamos o nome do doador como TXID para fins de rastreio/homenagem
      // Limitando o nome para não exceder o limite do campo TXID (máx 25 caracteres)
    )
    giverName.value.toLocaleUpperCase().slice(0, 25)
  } catch (err) {
    console.error('Erro ao gerar o payload do PIX:', err)
    alert('Ocorreu um erro ao gerar o código PIX. Por favor, tente novamente.') //! substitua por uma notificação toast
    pixPayload.value = ''
  }
}

// Handler do formulário (executa a geração antes de abrir o modal)
const handleSubmit = (e: Event) => {
  e.preventDefault()
  // A geração será feita dentro do openModal para garantir que o payload
  // está pronto antes de mostrar o modal.
}
const openModal = (type: 'qrcode' | 'pixkey') => {
  // Gera o payload do PIX ao submeter o formulário
  generatePix()

  if (pixPayload.value) {
    // Abre o modal com o tipo correto
    modalType.value = type
    showModal.value = true
  } else {
    // Se o payload não foi gerado, mostra um erro e nao abre o modal
    alert('Não foi possível gerar o código PIX. Verifique o valor da doação e tente novamente.') //! substitua por uma notificação toast
  }

  // Função copiar a chave PIX (Reutilizável)
  const copyPayloadToClipboard = async () => {
    if (pixPayload.value) {
      try {
        await navigator.clipboard.writeText(pixPayload.value)
        alert('Chave PIX copiada para a área de transferência!') //! substitua por uma notificação toast
      } catch (err) {
        console.error('Erro ao copiar a chave PIX:', err)
        alert('Não foi possível copiar a chave PIX. Por favor, tente novamente.') //! substituir port toast
      }
    }
  }
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
        class="w-full"
        @click="openModal('qrcode')"
        :disabled="!isAmountValid"
      >
        Gerar QR Code
      </BaseButton>

      <span class="font-manrope text-sm md:text-base xl:text-xl">ou</span>

      <BaseButton
        bgColor="bg-zinc-50"
        textColor="text-zinc-800"
        hoverColor="hover:bg-secondary-red hover:text-zinc-50"
        class="w-full transition-all duration-300"
        @click="openModal('pixkey')"
        :disabled="!isAmountValid"
      >
        Copiar Chave Pix
      </BaseButton>
    </div>

    <BaseModal
      :visible="showModal"
      contentClass="bg-white rounded-md p-6 w-80 flex flex-col items-center gap-4"
      @close="showModal = false"
    >
      <template v-if="modalType === 'qrcode'">
        <h4>modal qrcode!</h4>
      </template>

      <template v-if="modalType === 'pixkey'">
        <h4>modal cahve pix!</h4>
      </template>
    </BaseModal>
  </form>
</template>
