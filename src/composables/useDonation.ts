import { ref, computed } from 'vue'
import generatePixPayload from '../modules/pixPayloadGenerate'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import useFeedbackMessage from './useFeedback'

const usePixDonation = () => {
  // Estado do Modal
  const showModal = ref(false)
  const modalType = ref<'qrcode' | 'pixkey' | null>(null)
  // Dados do Formulário (Reativos)
  const giverName = ref<string>('')
  const amount = ref<number | null>(null)
  const pixPayload = ref<string>('')
  const isDonationPending = ref<boolean>(false)

  // Faz desestruturação para usar funções do hook useFeedbackMessage
  const { screenMessage, isCopied, clearMessage } = useFeedbackMessage()

  let donationMonitoringTimer: number | null = null

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
      return
    }

    try {
      const txidValue = giverName.value.toLocaleUpperCase().slice(0, 25)
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
    } catch (err) {
      console.error('Erro ao gerar o payload do PIX:', err)
      alert('Ocorreu um erro ao gerar o código PIX. Por favor, tente novamente.') //! substitua por uma notificação toast
      pixPayload.value = ''
    }
  }

  const handleModalOpen = (type: 'qrcode' | 'pixkey') => {
    // Gera o payload do PIX ao submeter o formulário
    generatePix()
    console.log('**FUNÇÃO PARA GERAR O PIX**')

    if (pixPayload.value) {
      // Abre o modal com o tipo correto
      modalType.value = type
      showModal.value = true
      console.log('**/MODAL ABRINDO/**', showModal, showModal.value)
      console.log('**/PAYLOAD/**', pixPayload.value)
    } else {
      // Se o payload não foi gerado, mostra um erro e nao abre o modal
      alert('Não foi possível gerar o código PIX. Verifique o valor da doação e tente novamente.') //! substitua por uma notificação toast
    }
  }

  const handleModalClose = () => {
    if (isDonationPending.value) {
      showModal.value = false
    } else {
      showModal.value = false
    }
  }

  // Função copiar a chave PIX (Reutilizável)
  const handleCopy = async () => {
    if (!pixPayload.value) {
      screenMessage.value = { text: 'Nenhum código PIX gerado para copiar.', isError: true }
      clearMessage()
      return
    }
    try {
      await navigator.clipboard.writeText(pixPayload.value)
      handleModalClose()

      // Exibe um feedback amigável ao copiar com sucesso a chave
      isCopied.value = true
      screenMessage.value = { text: '☑️ Chave PIX copiado com sucesso!', isError: false }

      setTimeout(() => {
        isCopied.value = false
        clearMessage()
      }, 2000)
    } catch (err) {
      console.error('Error copying PIX key:', err)
      screenMessage.value = {
        text: '✖️ Erro ao copiar a chave PIX, tente novamente!',
        isError: true,
      }
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
  }
}

export default usePixDonation

// const showModal = ref(false)
// const modalType = ref<'qrcode' | 'pixkey' | null>(null)
// // Dados do Formulário (Reativos)
// const giverName = ref<string>('')
// const amount = ref<number | null>(null)
// const pixPayload = ref<string>('')

// // Configurações do .env (Ajuste conforme o seu setup real)
// const PIX_KEY = import.meta.env.VITE_PIX_KEY || 'Chave não definida'
// const MERCHANT_NAME = import.meta.env.VITE_MERCHANT_NAME || 'Nome não definido'
// const MERCHANT_CITY = import.meta.env.VITE_MERCHANT_CITY || 'Cidade não definida'

// // Validação (Habilita botões apenas se houver um valor > 0)
// const isAmountValid = computed(() => amount.value !== null && amount.value > 0)

// // Lógica de ações
// // função para gerar o PIX e armazenar em payload
// const generatePix = () => {
//   if (!isAmountValid.value || amount.value === null || amount.value) {
//     // Impede a geração se o valor for inválido
//     pixPayload.value = ''
//     return
//   }

//   try {
//     const txidValue = giverName.value.toLocaleUpperCase().slice(0, 25)
//     const payload = generatePixPayload(
//       PIX_KEY,
//       MERCHANT_NAME,
//       MERCHANT_CITY,
//       amount.value,
//       txidValue,
//       // Adicionamos o nome do doador como TXID para fins de rastreio/homenagem
//       // Limitando o nome para não exceder o limite do campo TXID (máx 25 caracteres)
//     )
//     pixPayload.value = payload
//   } catch (err) {
//     console.error('Erro ao gerar o payload do PIX:', err)
//     alert('Ocorreu um erro ao gerar o código PIX. Por favor, tente novamente.') //! substitua por uma notificação toast
//     pixPayload.value = ''
//   }
// }

// // Handler do formulário (executa a geração antes de abrir o modal)
// const handleSubmit = (e: Event) => {
//   e.preventDefault()
//   // A geração será feita dentro do openModal para garantir que o payload
//   // está pronto antes de mostrar o modal.
// }

// // Função copiar a chave PIX (Reutilizável)
// const copyPayloadToClipboard = async () => {
//   if (pixPayload.value) {
//     try {
//       await navigator.clipboard.writeText(pixPayload.value)
//       alert('Chave PIX copiada para a área de transferência!') //! substitua por uma notificação toast
//     } catch (err) {
//       console.error('Erro ao copiar a chave PIX:', err)
//       alert('Não foi possível copiar a chave PIX. Por favor, tente novamente.') //! substituir port toast
//     }
//   }
// }

// const openModal = (type: 'qrcode' | 'pixkey') => {
//   // Gera o payload do PIX ao submeter o formulário
//   generatePix()

//   if (pixPayload.value) {
//     // Abre o modal com o tipo correto
//     modalType.value = type
//     showModal.value = true
//   } else {
//     // Se o payload não foi gerado, mostra um erro e nao abre o modal
//     alert('Não foi possível gerar o código PIX. Verifique o valor da doação e tente novamente.') //! substitua por uma notificação toast
//   }
// }
// // NOVO: Usa o composable para gerar a URL base64 do QR Code de forma reativa
// // Sempre que 'pixPayload.value' mudar, 'qrcodeUrl' será atualizado
// const qrcodeUrl = useQRCode(pixPayload, {
//   errorCorrectionLevel: 'H',
//   margin: 2,
//   color: {
//     dark: '#003322',
//     light: '#FFFFFF',
//   },
// })
