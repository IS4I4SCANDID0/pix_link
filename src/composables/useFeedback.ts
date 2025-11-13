import { ref } from 'vue'

const useFeedbackMessage = () => {
  const screenMessage = ref<{ text: string; isError: boolean } | null>(null)
  const isCopied = ref<boolean>(false)

  const clearMessage = () => {
    setTimeout(() => {
      screenMessage.value = null
    }, 4000)
  }
  return { screenMessage, isCopied, clearMessage }
}

export default useFeedbackMessage
