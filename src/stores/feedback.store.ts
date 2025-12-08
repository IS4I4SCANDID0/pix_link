import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FeedbackType, TFeedback } from '@/types/feedback.type'

//**  SETUP  PROVISÓRIO DE DEBUG AVANÇADO **//
const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
let callSeq = 0

const startCall = (fn: any) => {
  const seq = ++callSeq
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
  const since = now - t0
  const iso = new Date().toISOString()
  const label = `${seq}:${fn}`

  // Marca início
  console.group?.(`${fn} #${seq}`)
  console.log(`[${iso}] +${since.toFixed(3)}ms ▶️ ${fn}() chamada (#${seq})`)
  console.time(label)

  return { label, seq }
}

const endCall = (label: any) => {
  console.timeEnd(label)
  console.groupEnd?.()
}

///***===================================***///

// export const useFeedbackStore = defineStore('feedback', () => {
//   // ========== ESTADOS ==========
//   const screenMessage = ref<{ text: string; isError: boolean } | null>(null)
//   const tooltipMessage = ref<{ text: string } | null>(null)
//   const isCopied = ref<boolean>(false)

//   // ========== PRIVATES ==========
//   let messageTimeout: ReturnType<typeof setTimeout> | null = null

//   // ========== ACTIONS ==========
//   const clearMessage = () => {
//     if (messageTimeout) {
//       clearTimeout(messageTimeout)
//     }
//     messageTimeout = setTimeout(() => {
//       screenMessage.value = null
//     }, 3000)
//   }
//   /**
//    * Exibe uma mensagem de feedback na tela (Banner)
//    * @param text - Texto da mensagem
//    * @param isError - Se é uma mensagem de erro (true) ou sucesso (false)
//    */
//   const showMessage = (text: string, isError: boolean): void => {
//     screenMessage.value = { text, isError }
//     // Limpa as memsagens automaticamente
//     clearMessage()
//   }

//   /**
//    * Exibe o Tooltip
//    * @param text - Texto do tooltip
//    */
//   const tooltipShowMessage = (text: string): void => {
//     const start = startCall(tooltipShowMessage)
//     if (tooltipMessage.value) return
//     console.log('💬 tooltipShowMessage chamado')
//     console.log('  └─ texto:', text)
//     console.log('  └─ tooltipMessage antes:', tooltipMessage.value)

//     console.time('tooltipShowMessage:atualizacao')
//     tooltipMessage.value = { text }
//     console.timeEnd('tooltipShowMessage:atualizacao')

//     console.log('  └─ tooltipMessage depois:', tooltipMessage.value)
//     endCall(start.label)
//     return
//   }
//   // Limpa o tooltip
//   const clearTooltipMessage = (): void => {
//     const start = startCall(clearTooltipMessage)
//     console.log('🗑️ clearTooltip chamado')
//     console.log('  └─ tooltipMessage antes:', tooltipMessage.value)
//     tooltipMessage.value = null

//     console.log('  └─ tooltipMessage depois:', tooltipMessage.value)
//     endCall(start.label)
//     return
//   }
//   //  /**
//   //  * Limpa mensagem imediatamente (sem timeout)
//   //  */
//   // const clearMessageNow = (): void => {
//   //   if (messageTimeout) {
//   //     clearTimeout(messageTimeout)
//   //     messageTimeout = null
//   //   }
//   //   screenMessage.value = null
//   // }

//   return { showMessage, screenMessage, isCopied, clearMessage, tooltipShowMessage, tooltipMessage, clearTooltipMessage }
// })

export const useFeedbackStore = defineStore('feedback', () => {
  // ========== ESTADO ==========
  // Fila de mensagens (suporta múltiplas mensagens)
  const feedbackQueue = ref<TFeedback[]>([])

  // Estado do botão "copiar"
  const isCopied = ref<boolean>(false)

  // ========== GETTERS ==========
  // Mensagem atual (primeira da fila)
  const currentFeedback = computed(() => feedbackQueue.value[0] || null)

  // Tooltip específico (último tooltip da fila)
  const tooltipMessage = computed(() => {
    const tooltips = feedbackQueue.value.filter((f) => f.type === 'tooltip')
    return tooltips[tooltips.length - 1] || null
  })

  // Mensagem de tela (erro/sucesso)
  const screenMessage = computed(() => {
    const messages = feedbackQueue.value.filter((f) => f.type !== 'tooltip')
    return messages[messages.length - 1] || null
  })

  // ========== PRIVATE ==========
  let timeoutMap = new Map<number, ReturnType<typeof setTimeout>>()

  // ========== ACTIONS ==========
  /**
   * Adiciona mensagem à fila
   */
  const addFeedback = (text: string, type: FeedbackType, duration: number = 3000) => {
    const id = Date.now() + Math.random() // ID único

    const feedback: TFeedback = { id, text, type, duration }

    // Adiciona à fila
    feedbackQueue.value.push(feedback)

    // Se tiver duração, agenda remoção automática
    if (duration > 0) {
      const timeout = setTimeout(() => {
        removeFeedback(id)
      }, duration)

      timeoutMap.set(id, timeout)
    }

    return id
  }

  /**
   * Remove mensagem específica da fila
   */
  const removeFeedback = (id: number) => {
    // Remove da fila
    const index = feedbackQueue.value.findIndex((f) => f.id === id)
    if (index !== -1) {
      feedbackQueue.value.splice(index, 1)
    }

    // Limpa timeout se existir
    const timeout = timeoutMap.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutMap.delete(id)
    }
  }

  /**
   * Remove TODOS os feedbacks de um tipo
   */
  const clearFeedbacksByType = (type: FeedbackType) => {
    const toRemove = feedbackQueue.value.filter((f) => f.type === type).map((f) => f.id)

    toRemove.forEach((id) => removeFeedback(id))
  }

  /**
   * Limpa TODOS os feedbacks
   */
  const clearAllFeedbacks = () => {
    // Limpa todos os timeouts
    timeoutMap.forEach((timeout) => clearTimeout(timeout))
    timeoutMap.clear()

    // Limpa fila
    feedbackQueue.value = []
  }

  // ========== HELPERS ESPECÍFICOS ==========

  /**
   * Mostra mensagem de erro
   */
  const showError = (text: string, duration: number = 3000) => {
    return addFeedback(text, 'error', duration)
  }

  /**
   * Mostra mensagem de sucesso
   */
  const showSuccess = (text: string, duration: number = 3000) => {
    return addFeedback(text, 'success', duration)
  }

  /**
   * Mostra tooltip (substitui tooltip anterior)
   */
  const showTooltip = (text: string, duration: number = 7000) => {
    // Remove tooltips anteriores
    clearFeedbacksByType('tooltip')

    // Adiciona novo
    return addFeedback(text, 'tooltip', duration)
  }

  /**
   * Esconde tooltip atual
   */
  const hideTooltip = () => {
    clearFeedbacksByType('tooltip')
  }

  return {
    // Estado
    feedbackQueue,
    isCopied,

    // Getters
    currentFeedback,
    tooltipMessage,
    screenMessage,

    // Actions gerais
    addFeedback,
    removeFeedback,
    clearFeedbacksByType,
    clearAllFeedbacks,

    // Actions específicas
    showError,
    showSuccess,
    showTooltip,
    hideTooltip,
  }
})
