import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import generatePixPayload from '../modules/pixPayloadGenerate'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { useFeedbackStore } from './feedback.store'
import { useToast } from 'vue-toast-notification'

// Regex para validação de nome
const NAME_REGEX = /^[a-zA-Z0-9\-_.@]{1,}$/

export const useDonationStore = defineStore('donation', () => {
  // Toast (mantido do composable original)
  const $toast = useToast()

  // Feedback Store (Pinia)
  const feedbackStore = useFeedbackStore()

  // ========== ESTADO ==========
  const showModal = ref(false)
  const modalType = ref<'qrcode' | 'pixkey' | null>(null)
  const giverName = ref<string>('')
  const amount = ref<number | null>(null)
  const pixPayload = ref<string>('')
  const nameError = ref<boolean>(false)
  const amountError = ref<boolean>(false)

  // Configurações do .env
  const PIX_KEY = import.meta.env.VITE_PIX_KEY || 'Chave não definida'
  const MERCHANT_NAME = import.meta.env.VITE_MERCHANT_NAME || 'Nome não definido'
  const MERCHANT_CITY = import.meta.env.VITE_MERCHANT_CITY || 'Cidade não definida'

  // Controla se o watcher do amount está ativo
  let tooltipFeedbackId: number | null = null
  let amountWatcherStop: (() => void) | null = null

  // ========== GETTERS (COMPUTEDS) ==========
  //  CORRIGIDO: Validação agora considera zero e valores negativos
  const isAmountValid = computed(() => {
    return amount.value !== null && amount.value >= 1
  })

  const qrcodeUrl = useQRCode(pixPayload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#00613C',
      light: '#FFFFFF',
    },
  })

  // HTML do GIF de sucesso (função para pegar nome atualizado)
  const createSuccessGifHTML = () => {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; padding: 8px;">
        <span style="font-weight: 800; font-size: 1.1rem; margin-bottom: 8px; color: #00613C;">
          Você é incrível${giverName.value ? `, ${giverName.value}` : 'Gente fina'}! 
        </span>
        <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm9iN3d5dmdkczM1MmVmZm5kb2xsM2F2OTc0bmRsOHk3a3cxczJ2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qIXVd1RoKGqlO/giphy.gif"
          style="width: 120px; border-radius: 8px; border: 2px solid #00613C;"
          alt="GIF de aplausos" />
        <span style="font-size: 0.9rem; margin-top: 10px; color: #00613C; font-weight: 600;">
          Sua doação faz toda diferença!
        </span>
      </div>
    `
  }

  // ========== HELPER: Limpa recursos do tooltip ==========
  const cleanupTooltip = () => {
    // Para o watcher se existir
    if (amountWatcherStop) {
      amountWatcherStop()
      amountWatcherStop = null
    }

    // Esconde tooltip via store (remove da fila)
    feedbackStore.hideTooltip()

    // Limpa referência do ID
    tooltipFeedbackId = null
  }

  // ========== ACTIONS ==========
  const generatePix = () => {
    if (!isAmountValid.value || amount.value === null) {
      pixPayload.value = ''
      return false
    }

    try {
      const txidValue = giverName.value
        ? giverName.value
            .toLocaleUpperCase()
            .slice(0, 25)
            .replace(/[^A-Z0-9]/g, '')
        : 'Gente fina'

      const payload = generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, amount.value, txidValue)
      pixPayload.value = payload
      return true
    } catch (err) {
      console.error('Error generating PIX payload:', err)

      $toast.error('Erro ao gerar o código PIX. Tente novamente!', {
        position: 'top',
        duration: 3000,
      })

      pixPayload.value = ''
      return false
    }
  }

  const handleModalOpen = (type: 'qrcode' | 'pixkey') => {
    // Limpa tooltip antes de validar
    cleanupTooltip()

    // feedbackStore.clearTooltipMessage()

    // Validação 1: Nome vazio
    if (!giverName.value || giverName.value.trim() === '') {
      feedbackStore.showError('Digite seu nome', 2500)
      nameError.value = true
      return
    }

    // Validação 2: Nome muito curto
    if (giverName.value.length < 4) {
      feedbackStore.showError('Mínimo de 4 caracteres', 2500)
      nameError.value = true
      return
    }

    // Validação 3: Formato do nome
    if (!NAME_REGEX.test(giverName.value)) {
      feedbackStore.showError('Nome inválido. Use letras, números e -, ., @, _', 2500)
      nameError.value = true
      return
    }

    // Validação 4: CORRIGIDA - Valor inválido (menor que 1 real)
    // console.log('🔍 Validando valor:', {
    //   amount: amount.value,
    //   isAmountValid: isAmountValid.value,
    //   typeof: typeof amount.value,
    // })

    if (!isAmountValid.value) {
      console.log('❌ ENTROU NA VALIDAÇÃO DE ERRO - Valor inválido!')
      feedbackStore.showError('Valor inválido. Mínimo de R$ 1,00', 2500)
      amountError.value = true
      return
    }

    const success = generatePix()

    if (pixPayload.value && success) {
      modalType.value = type
      showModal.value = true
    } else {
      $toast.error('Falha ao finalizar a doação. Tente novamente!', {
        position: 'top',
        duration: 4000,
      })
    }
  }

  const handleModalClose = () => {
    const currentModalType = modalType.value

    showModal.value = false
    modalType.value = null

    // Se for QR Code, mostra toast após 1 segundo
    if (currentModalType === 'qrcode') {
      setTimeout(() => {
        $toast.success(createSuccessGifHTML(), {
          position: 'top',
          duration: 6000,
          dismissible: true,
        })
        resetForm()
      }, 1000)
    }
  }

  const handleCopy = async () => {
    if (!pixPayload.value) {
      $toast.error('Nenhum código PIX gerado para copiar.', {
        position: 'top',
        duration: 3000,
        dismissible: true,
      })
      return
    }

    try {
      // 1. Copia para clipboard
      await navigator.clipboard.writeText(pixPayload.value)

      // 2. Mostra feedback visual
      feedbackStore.isCopied = true
      feedbackStore.showSuccess('Chave PIX copiada com sucesso!', 2500)

      // 3. Aguarda para usuário ver
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 4. Limpa mensagem e fecha modal
      feedbackStore.clearAllFeedbacks()
      showModal.value = false
      modalType.value = null

      // 5. Mostra toast com GIF
      setTimeout(() => {
        $toast.success(createSuccessGifHTML(), {
          position: 'top',
          duration: 6000,
          dismissible: true,
        })
        resetForm()
      }, 500)

      // 6. Reseta estado copiado
      setTimeout(() => {
        feedbackStore.isCopied = false
      }, 3000)
    } catch (err) {
      console.error('Error copying PIX key:', err)
      feedbackStore.showError('Erro ao copiar a chave PIX, tente novamente!', 2500)
      feedbackStore.isCopied = false
    }
  }

  const resetForm = () => {
    setTimeout(() => {
      giverName.value = ''
      amount.value = null
      pixPayload.value = ''
    }, 100)
  }

  // CORRIGIDO: Removida limpeza de tooltip (causa chamadas duplicadas)
  const clearNameError = () => {
    if (nameError.value) {
      nameError.value = false
    }
  }

  const clearAmountError = () => {
    if (amountError.value) {
      amountError.value = false
    }
  }

  // FUNÇÃO CORRIGIDA - Tooltip otimizado
  const handleAmountFocus = () => {
    // Limpa recursos anteriores
    cleanupTooltip()

    // Só mostra tooltip se NÃO houver erro
    if (!amountError.value) {
      // Mostra tooltip e armazena ID
      tooltipFeedbackId = feedbackStore.showTooltip('Use ponto ou vírgula para centavos!', 6000)

      // Watch isolado: remove tooltip quando usuário digitar
      amountWatcherStop = watch(
        amount,
        (newValue) => {
          // Remove tooltip assim que digitar qualquer valor
          if (newValue !== null) {
            cleanupTooltip()
          }
        },
        { immediate: false },
      )
    }
  }

  const handleAmountBlur = () => {
    // Limpa todos os recursos ao sair do campo
    cleanupTooltip()
  }

  // ========== RETURN (expõe para componentes) ==========
  return {
    // Estado
    showModal,
    modalType,
    giverName,
    amount,
    pixPayload,
    nameError,
    amountError,

    // Getters
    isAmountValid,
    qrcodeUrl,

    // Actions
    handleModalOpen,
    handleModalClose,
    handleCopy,
    clearNameError,
    clearAmountError,
    handleAmountFocus,
    handleAmountBlur,
    resetForm,
  }
})
