import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import generatePixPayload from '../modules/pixPayloadGenerate'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { useFeedbackStore } from './feedback.store'
import { useRateLimitStore } from './rateLimit.store'
import { useToast } from 'vue-toast-notification'
import CryptoJS from 'crypto-js'

const NAME_REGEX = /^[a-zA-Z0-9\-_.@]{1,}$/

export const useDonationStore = defineStore('donation', () => {
  const $toast = useToast()
  const feedbackStore = useFeedbackStore()
  const rateLimitStore = useRateLimitStore()

  // ========== ESTADO ==========
  const showModal = ref(false)
  const modalType = ref<'qrcode' | 'pixkey' | null>(null)
  const giverName = ref<string>('')
  const amount = ref<number | null>(null)
  const pixPayload = ref<string>('')
  const pixValidationHash = ref<string>('')
  const nameError = ref<boolean>(false)
  const amountError = ref<boolean>(false)

  const PIX_KEY: string = import.meta.env.VITE_PIX_KEY || 'Chave não definida'
  const MERCHANT_NAME: string = import.meta.env.VITE_MERCHANT_NAME || 'Nome não definido'
  const MERCHANT_CITY: string = import.meta.env.VITE_MERCHANT_CITY || 'Cidade não definida'
  const VALIDATION_SALT: string = import.meta.env.VITE_VALIDATION_SALT || 'default-salt-change-me'

  let tooltipFeedbackId: number | null = null
  let amountWatcherStop: (() => void) | null = null

  // ========== CONTROLE DE INTEGRIDADE ==========
  let isGeneratingPayload = false // Flag para controlar geração legítima

  // ========== GETTERS ==========
  const isAmountValid = computed(() => amount.value !== null && amount.value >= 1)

  const qrcodeUrl = useQRCode(pixPayload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: '#00613C', light: '#FFFFFF' },
  })

  const createSuccessGifHTML = () => {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px;">
        <span style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; color: #00613C;">
          Você é incrível ${giverName.value ? `, ${giverName.value}` : 'Gente fina'}!
        </span>
        <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm9iN3d5dmdkczM1MmVmZm5kb2xsM2F2OTc0bmRsOHk3a3cxczJ2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qIXVd1RoKGqlO/giphy.gif"
          style="width: 170px; border-radius: 8px;" alt="GIF de aplausos" />
        <span style="font-size: 0.9rem; margin-top: 8px; color: #00613C; font-weight: 600;">
          Sua doação faz toda diferença!
        </span>
      </div>
    `
  }

  // ========== SEGURANÇA ==========
  const generateValidationHash = (pixKey: string, merchantName: string, merchantCity: string, amountValue: number, txid: string): string => {
    const dataString = `${pixKey}|${merchantName}|${merchantCity}|${amountValue}|${txid}|${VALIDATION_SALT}`
    return CryptoJS.SHA256(dataString).toString()
  }

  const validatePayload = (): boolean => {
    console.log('🔍 ============ INICIANDO VALIDAÇÃO ============')

    if (!pixPayload.value || !pixValidationHash.value) {
      console.log('❌ Payload ou hash vazio')
      return false
    }

    const txidValue = giverName.value
      ? giverName.value
          .toUpperCase()
          .slice(0, 25)
          .replace(/[^A-Z0-9]/g, '')
      : 'GENTEFINA'

    const expectedHash = generateValidationHash(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, amount.value!, txidValue)

    let expectedPayload: string
    try {
      expectedPayload = generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, amount.value!, txidValue)
    } catch (error) {
      console.error('❌ Erro ao gerar payload esperado:', error)
      return false
    }

    const hashValido = expectedHash === pixValidationHash.value
    const payloadValido = expectedPayload === pixPayload.value

    console.log('📊 Comparação de Hash:')
    console.table({
      'Hash Esperado': expectedHash.substring(0, 30) + '...',
      'Hash Armazenado': pixValidationHash.value.substring(0, 30) + '...',
      Resultado: hashValido ? '✅ VÁLIDO' : '❌ INVÁLIDO',
    })

    console.log('📊 Comparação de Payload:')
    console.table({
      'Payload Esperado': expectedPayload.substring(0, 40) + '...',
      'Payload Armazenado': pixPayload.value.substring(0, 40) + '...',
      Resultado: payloadValido ? '✅ VÁLIDO' : '❌ INVÁLIDO',
    })

    const resultado = hashValido && payloadValido

    if (resultado) {
      console.log('✅ ============ VALIDAÇÃO PASSOU ============')
    } else {
      console.error('❌ ============ VALIDAÇÃO FALHOU ============')
      console.error('🚨 TENTATIVA DE FRAUDE DETECTADA!')
    }

    return resultado
  }

  const cleanupTooltip = () => {
    if (amountWatcherStop) {
      amountWatcherStop()
      amountWatcherStop = null
    }
    feedbackStore.hideTooltip()
    tooltipFeedbackId = null
  }

  // ========== ACTIONS ==========
  const generatePix = () => {
    if (!isAmountValid.value || amount.value === null) {
      pixPayload.value = ''
      pixValidationHash.value = ''
      return false
    }

    try {
      isGeneratingPayload = true // Marca como geração legítima

      const txidValue = giverName.value
        ? giverName.value
            .toUpperCase()
            .slice(0, 25)
            .replace(/[^A-Z0-9]/g, '')
        : 'GENTEFINA'

      const payload = generatePixPayload(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, amount.value, txidValue)
      const validationHash = generateValidationHash(PIX_KEY, MERCHANT_NAME, MERCHANT_CITY, amount.value, txidValue)

      pixPayload.value = payload
      pixValidationHash.value = validationHash

      isGeneratingPayload = false // Finaliza geração legítima

      return true
    } catch (err) {
      isGeneratingPayload = false
      console.error('Error generating PIX payload:', err)
      $toast.error('Erro ao gerar o código PIX. Tente novamente!', { position: 'top', duration: 3000 })
      pixPayload.value = ''
      pixValidationHash.value = ''
      return false
    }
  }

  const handleModalOpen = (type: 'qrcode' | 'pixkey') => {
    $toast.clear()
    cleanupTooltip()

    // Rate limit
    const { allowed, timeToWait } = rateLimitStore.canProceed('donation')
    if (!allowed) {
      feedbackStore.showError(`Muitas tentativas! Aguarde alugns segundos...`, 3000)
      return
    }

    // Validações básicas
    if (giverName.value.length < 4) {
      feedbackStore.showError('Mínimo de 4 caracteres', 2500)
      nameError.value = true
      return
    }

    if (giverName.value.length && giverName.value.trim().length > 25) {
      feedbackStore.showError('Máximo de 25 caracteres', 2500)
      nameError.value = true
      return
    }

    if (!NAME_REGEX.test(giverName.value)) {
      feedbackStore.showError('Nome inválido. Use letras, números e -, ., @, _', 2500)
      nameError.value = true
      pixPayload.value = ''
      pixValidationHash.value = ''
      return
    }

    if (!isAmountValid.value) {
      feedbackStore.showError('Valor inválido. Mínimo de R$ 1,00', 2500)
      amountError.value = true
      return
    }

    // ========== VALIDAÇÃO DE SEGURANÇA ==========
    const hasExistingPayload = pixPayload.value && pixValidationHash.value

    if (hasExistingPayload) {
      if (!validatePayload()) {
        console.error('❌ ATTEMPTED FRAUD DETECTED!')
        console.error('The payload has been tampered with! Action blocked!')

        feedbackStore.showError('Tentativa de alteração detectada! Recarregando...', 3000)

        // Limpa estado comprometido
        pixPayload.value = ''
        pixValidationHash.value = ''

        // Força reload
        setTimeout(() => window.location.reload(), 2000)
        return // ⚠️ BLOQUEIA COMPLETAMENTE
      }

      console.info('✅ Payload válido. Reabrindo modal.')

      // Reabre modal com payload existente (não gera novo)
      modalType.value = type
      showModal.value = true
      return
    }

    // Se não existe payload, gera novo
    console.info('🆕 Gerando novo payload PIX...')
    const success = generatePix()

    if (pixPayload.value && success) {
      modalType.value = type
      showModal.value = true
    } else {
      $toast.error('Falha ao finalizar a doação. Tente novamente!', { position: 'top', duration: 4000 })
    }
  }

  const handleModalClose = () => {
    const currentModalType = modalType.value
    showModal.value = false
    modalType.value = null

    if (currentModalType === 'qrcode') {
      setTimeout(() => {
        $toast.success(createSuccessGifHTML(), { position: 'top', duration: 5000, dismissible: true })
        resetForm()
      }, 500)
    }
  }

  const handleCopy = async () => {
    if (!pixPayload.value) {
      $toast.error('Nenhum código PIX gerado para copiar.', { position: 'top', duration: 3000, dismissible: true })
      return
    }

    // ========== VALIDAÇÃO CRÍTICA ANTES DE COPIAR ==========
    if (!validatePayload()) {
      feedbackStore.showError('Erro de validação. Recarregue a página (Ctrl + R)', 3000)
      console.error('❌ Security validation failed during copy!')
      showModal.value = false
      modalType.value = null
      return
    }

    try {
      await navigator.clipboard.writeText(pixPayload.value)
      feedbackStore.isCopied = true
      feedbackStore.showSuccess('Chave PIX copiada com sucesso!', 2500)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      feedbackStore.clearAllFeedbacks()
      await new Promise((resolve) => setTimeout(resolve, 100))
      showModal.value = false
      modalType.value = null
      setTimeout(() => {
        $toast.success(createSuccessGifHTML(), { position: 'top', duration: 60000, dismissible: true })
        resetForm()
      }, 300)
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
      pixValidationHash.value = ''
    }, 100)
  }

  const clearNameError = () => {
    if (nameError.value) nameError.value = false
  }

  const clearAmountError = () => {
    if (amountError.value) amountError.value = false
  }

  const handleAmountFocus = () => {
    cleanupTooltip()
    if (!amountError.value) {
      tooltipFeedbackId = feedbackStore.showTooltip('Use ponto ou vírgula para centavos!', 7000)
      amountWatcherStop = watch(
        amount,
        (newValue) => {
          if (newValue !== null) cleanupTooltip()
        },
        { immediate: false },
      )
    }
  }

  const handleAmountBlur = () => cleanupTooltip()

  // ========== 🛡️ PROTEÇÃO CONTRA MANIPULAÇÃO EXTERNA ==========
  watch([pixPayload, pixValidationHash], ([newPayload, newHash], [oldPayload, oldHash]) => {
    // Ignora se:
    // 1. É a primeira atribuição (oldPayload é vazio)
    // 2. Está sendo gerado legitimamente (via generatePix)
    // 3. Está sendo limpo (ambos ficam vazios)
    if (!oldPayload || !oldHash || isGeneratingPayload || (!newPayload && !newHash)) {
      return
    }

    // Se chegou aqui, houve alteração EXTERNA suspeita
    console.error('🚨 EXTERNAL ALTERATION DETECTED!')
    console.error('☠️ The payload or hash has been modified outside of the normal flow!')

    // Em produção, bloqueia imediatamente
    if (import.meta.env.PROD) {
      $toast.error('Atividade suspeita detectada! Recarregando...', { position: 'top', duration: 3000, dismissible: true })
      pixPayload.value = ''
      pixValidationHash.value = ''
      setTimeout(() => window.location.reload(), 2000)
    } else {
      // Em dev, apenas avisa (permite testes)
      console.warn('⚠️ [DEV MODE] Change detected, but allowed in development environment!')
    }
  })

  // ========== 🧪 API DE TESTE (DEV + E2E) ==========
  // Detecta se está em ambiente de teste (Cypress adiciona window.Cypress)
  const isTestEnvironment = import.meta.env.DEV || (typeof window !== 'undefined' && (window as any).Cypress)

  if (isTestEnvironment) {
    // API para manipulação segura em testes
    const testAPI = {
      ver: () => {
        console.table({
          'PIX Payload': pixPayload.value ? pixPayload.value.substring(0, 50) + '...' : 'vazio',
          'Hash Validação': pixValidationHash.value ? pixValidationHash.value.substring(0, 20) + '...' : 'vazio',
          Nome: giverName.value,
          Valor: amount.value,
          'Em Geração': isGeneratingPayload,
        })
      },
      alterarPayload: (novoPayload: string) => {
        console.log('🔴 [TEST] SIMULANDO ATAQUE: Alterando payload...')
        const antigoPayload = pixPayload.value

        // Temporariamente desabilita watcher para permitir teste
        const oldFlag = isGeneratingPayload
        isGeneratingPayload = true

        pixPayload.value = novoPayload

        // Restaura após próximo tick
        setTimeout(() => {
          isGeneratingPayload = oldFlag
        }, 0)

        console.log('Payload antigo:', antigoPayload.substring(0, 50) + '...')
        console.log('Payload NOVO:', novoPayload)
        console.log('✅ Payload alterado! Agora tente copiar ou abrir o modal.')
      },
      validar: () => {
        const resultado = validatePayload()
        console.log('═══════════════════════════════════')
        console.log('🔍 RESULTADO DA VALIDAÇÃO:', resultado ? '✅ VÁLIDO' : '❌ INVÁLIDO')
        console.log('═══════════════════════════════════')
        return resultado
      },
      resetar: () => {
        pixPayload.value = ''
        pixValidationHash.value = ''
        giverName.value = ''
        amount.value = null
        console.log('♻️ Estado resetado')
      },
    }

    // Expõe no window para Cypress
    if (typeof window !== 'undefined') {
      ;(window as any).testSecurity = testAPI
    }

    // Apenas mostra banner em DEV (não em testes E2E)
    if (import.meta.env.DEV && !(window as any).Cypress) {
      console.log(`
      ╔═══════════════════════════════════════╗
      ║  🔧 DEBUG MODE ATIVO                  ║
      ║                                       ║
      ║  testSecurity.ver()                   ║
      ║  testSecurity.alterarPayload('fake')  ║
      ║  testSecurity.validar()               ║
      ║  testSecurity.resetar()               ║
      ╚═══════════════════════════════════════╝
    `)
    }
  }

  return {
    showModal,
    modalType,
    giverName,
    amount,
    pixPayload,
    pixValidationHash,
    nameError,
    amountError,
    isAmountValid,
    qrcodeUrl,
    merchantName: MERCHANT_NAME,
    merchantCity: MERCHANT_CITY,
    pixKeyPreview: `${PIX_KEY.slice(0, 10)}...${PIX_KEY.slice(-10)}`,
    generatePix,
    validatePayload,
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
