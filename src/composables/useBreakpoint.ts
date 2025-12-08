import type { TUseBreakpoint } from '@/types/feedback.type'
import { ref, onMounted, onUnmounted } from 'vue'

export const useBreakpoint = (): TUseBreakpoint => {
  const iconSize = ref(18)

  const checkScreen = () => {
    const width = window.innerWidth

    if (width <= 769) {
      iconSize.value = 18
      return
    }
    if (width <= 1537) {
      iconSize.value = 24
      return
    }
    if (width > 1537 && width <= 2000) {
      iconSize.value = 32
    } else {
      iconSize.value = 40
    }
    console.log('tamanho da tela:', width, 'APLICA O ICON SIZE:', iconSize)
  }

  onMounted(() => {
    checkScreen()
    window.addEventListener('resize', checkScreen)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreen)
  })
  console.log('TAMNHO FINAL DO ÍCONE: ', iconSize)
  return { iconSize }
}
