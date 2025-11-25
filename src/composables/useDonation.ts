import { ref, computed } from 'vue'
import generatePixPayload from '../modules/pixPayloadGenerate'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import useFeedbackMessage from './useFeedback'
import { useToast } from 'vue-toast-notification'
import { set } from '@vueuse/core'

const useDonation = () => {
  // Toast
  const $toast = useToast()

  // Estado do Modal
  const showModal = ref(false)
  const modalType = ref<'qrcode' | 'pixkey' | null>(null)
  // Dados do Formulário (Reativos)
  const giverName = ref<string>('')
  const amount = ref<number | null>(null)
  const pixPayload = ref<string>('')
  const isDonationPending = ref<boolean>(false)

  const nameError = ref<boolean>(false)
  const amountError = ref<boolean>(false)

  // Faz desestruturação para usar funções do hook useFeedbackMessage
  const { screenMessage, isCopied, showMessage, clearMessage } = useFeedbackMessage()
  // Configurações do .env (Ajuste conforme o seu setup real)
  const PIX_KEY = import.meta.env.VITE_PIX_KEY || 'Chave não definida'
  const MERCHANT_NAME = import.meta.env.VITE_MERCHANT_NAME || 'Nome não definido'
  const MERCHANT_CITY = import.meta.env.VITE_MERCHANT_CITY || 'Cidade não definida'

  // Validação (Habilita botões apenas se houver um valor > 0)
  const isAmountValid = computed(() => amount.value !== null && amount.value > 0)

  // Lógica de ações
  // função para gerar o PIX e armazenar em payload
  const generatePix = () => {
    if (!isAmountValid.value || amount.value === null) {
      // Impede a geração se o valor for inválido
      pixPayload.value = ''
      return false
    }

    try {
      const txidValue = giverName.value ? giverName.value.toLocaleUpperCase().slice(0, 25) : 'Doação'
      const payload = generatePixPayload(
        PIX_KEY,
        MERCHANT_NAME,
        MERCHANT_CITY,
        amount.value,
        txidValue,
        // Adicionamos o nome do doador como TXID para fins de rastreio/homenagem
        // Limitando o nome para não exceder o limite do campo TXID (máx 25 caracteres)
      )
      pixPayload.value = payload
      console.log('^__^ PIX PAYLOAD:', payload.substring(0, 35) + '...')
      return true
    } catch (err) {
      console.error('Error generating PIX payload:', err)

      // Toast para erro de geração do PIX
      $toast.error('Erro ao gerar o código PIX. Tente novamente!', {
        position: 'top',
        duration: 4000,
      })

      pixPayload.value = ''
      return false
    }
  }

  const handleModalOpen = (type: 'qrcode' | 'pixkey') => {
    if (!giverName.value || giverName.value.trim() === '') {
      showMessage('⚠️ Digite seu nome', true)
      nameError.value = true
      console.log('*{{erro de input nome}}*', nameError.value)
      console.log('>>NOME INVÁLIDO<<')
      return
    }
    if (!isAmountValid.value) {
      showMessage('⚠️ Digite um valor numérico vàlido', true)
      amountError.value = true
      console.log('*{{erro de input valor}}*', amountError.value)
      console.log('<<*VALOR INVÁLIDO*>>')
      return
    }

    console.log('*=//=validação completa, gerando payload...==//==*')

    const success = generatePix()
    console.log('^--^ generatePix() retornou:', success)
    console.log('^--^ pixPayload.value:', pixPayload.value ? 'GERADO' : 'VAZIO')

    if (pixPayload.value && success) {
      console.log('abre modal', type)
      modalType.value = type
      showModal.value = true
    } else {
      // $toast.error("")
      console.log('❌ Falha ao abrir modal - PIX não foi gerado')
    }
  }

  const createSuccessGifHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; padding: 4px;">
      <span style="font-weight: 800; font-size: 1.1rem; margin-bottom: 8px; color: #00613C;">
        Você é incrível ${giverName.value}!
      </span>
      <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm9iN3d5dmdkczM1MmVmZm5kb2xsM2F2OTc0bmRsOHk3a3cxczJ2OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qIXVd1RoKGqlO/giphy.gif"
        style="width: 120px; border-radius: 8px; border: 2px solid #00613C;"
        alt="GIF de sucesso" />
      <span style="font-size: 0.9rem; margin-top: 10px; color: #00613C; font-weight: 600;">
        Sua doação faz todaa diferença!
      </span>
    </div>
  `

  const resetForm = () => {
    // Reseta os campos do formulário após a doação após um pequeno delay
    setTimeout(() => {
      giverName.value = ''
      amount.value = null
      pixPayload.value = ''

      console.log('^^^ Formulário de doação resetado ^^^')
    }, 200)
  }

  const handleModalClose = () => {
    const currentModalType = modalType.value

    showModal.value = false
    modalType.value = null

    if (currentModalType === 'qrcode') {
      // Exibe um toast de agradecimento ao fechar o modal do QR Code
      setTimeout(() => {
        $toast.success(createSuccessGifHTML, {
          position: 'top',
          duration: 6000,
          dismissible: true,
        })
      }, 1000)
      resetForm()
    }
  }

  const clearNameError = (): void => {
    if (nameError.value) {
      nameError.value = false
    }
    return
  }

  const clearAmountError = (): void => {
    if (amountError.value) {
      amountError.value = false
    }
    return
  }

  // Função copiar a chave PIX (Reutilizável)
  const handleCopy = async () => {
    if (!pixPayload.value) {
      showMessage('⚠️ Nenhum código PIX gerado para copiar.', true)
      clearMessage()
      return
    }
    try {
      await navigator.clipboard.writeText(pixPayload.value)

      // Exibe um feedback amigável ao copiar com sucesso a chave
      isCopied.value = true
      showMessage('☑️ Chave PIX copiado com sucesso!', false)

      await new Promise((resolve) => setTimeout(resolve, 800))

      showModal.value = false
      modalType.value = null

      // Mostra o toast com o GIF de agradecimento
      $toast.success(createSuccessGifHTML, {
        position: 'top',
        duration: 6000,
        dismissible: true,
      })

      resetForm()

      // Reseta o estado de cópia após 2 segundos
      setTimeout(() => {
        isCopied.value = false
        clearMessage()
      }, 2000)
    } catch (err) {
      console.error('Error copying PIX key:', err)
      showMessage('✖️ Erro ao copiar a chave PIX, tente novamente!', true)
      isCopied.value = false
      clearMessage()
    }
  }

  // NOVO: Usa o composable para gerar a URL base64 do QR Code de forma reativa
  // Sempre que 'pixPayload.value' mudar, 'qrcodeUrl' será atualizado
  const qrcodeUrl = useQRCode(pixPayload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#00613C',
      light: '#FFFFFF',
    },
  })

  return {
    // Estado do Modal
    showModal,
    modalType,
    // Dados do Formulário
    giverName,
    amount,
    pixPayload,
    // Validação
    isAmountValid,
    // Ações
    handleModalOpen,
    handleModalClose,
    handleCopy,
    isDonationPending,
    // QR Code URL (base64)
    qrcodeUrl,
    // Feedback de formulário
    screenMessage,
    showMessage,
    isCopied,
    clearMessage,
    nameError,
    amountError,
    clearNameError,
    clearAmountError,
  }
}

export default useDonation
