import { ref } from 'vue'

const useFeedbackMessage = () => {
  const screenMessage = ref<{ text: string; isError: boolean } | null>(null)
  const isCopied = ref<boolean>(false)

  let messageTimeout: ReturnType<typeof setTimeout> | null = null

  const clearMessage = () => {
    if (messageTimeout) {
      clearTimeout(messageTimeout)
    }

    messageTimeout = setTimeout(() => {
      screenMessage.value = null
    }, 4000)
  }
  /**
   * Exibe uma mensagem de feedback na tela
   * @param text - Texto da mensagem
   * @param isError - Se é uma mensagem de erro (true) ou sucesso (false)
   */
  const showMessage = (text: string, isError: boolean): void => {
    console.log('°-° exibindo msg:', text, 'erro?', isError)

    screenMessage.value = { text, isError }
    console.log('°||° atualização da mensagen<screenMessage.value>:', screenMessage.value)

    // Limpa as memsagens automaticamente
    clearMessage()
  }

  return { showMessage, screenMessage, isCopied, clearMessage }
}

export default useFeedbackMessage
