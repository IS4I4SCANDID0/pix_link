<!-- <script setup lang="ts">
// 🔥 IMPORTANTE: Importa os ESTADOS GLOBAIS diretamente, não o hook!
import { useDonation } from '@/composables/useDonation'
import useFeedback from '@/composables/useFeedback'
import { Transition } from 'vue'

const {
  toastState,
  clearScreenMessage,
  showScreenMessage,
  hideCustomToast,
  isCopied,
  screenMessage,
  showCustomToast,
} = useFeedback()
</script> -->

<!-- <template> -->
<!-- ==================================================================== -->
<!-- 1. MENSAGEM DE VALIDAÇÃO RÁPIDA (screenMessage) -->
<!-- Usada para erros de formulário e feedback de cópia -->
<!-- ==================================================================== -->
<!-- <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div
      v-if="screenMessage?.text"
      :class="[
        'fixed top-4 left-1/2 -translate-x-1/2 z-1000 px-6 py-3 rounded-lg shadow-2xl font-manrope font-semibold text-sm border-2',
        screenMessage.isError
          ? 'bg-red-50 text-red-800 border-red-300'
          : 'bg-green-50 text-green-800 border-green-300',
      ]"
    >
      {{ screenMessage.text }}
    </div>
  </Transition> -->

<!-- ==================================================================== -->
<!-- 2. TOAST CUSTOMIZADO (toastState) -->
<!-- Usado para QR Code gerado, sucesso com GIF, erros gerais -->
<!-- ==================================================================== -->
<!-- <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-4 scale-95"
  >
    <div
      v-if="toastState.isVisible"
      :class="[
        'fixed top-20 left-1/2 -translate-x-1/2 z-[1000] px-6 py-4 rounded-xl shadow-2xl font-manrope font-semibold text-sm flex items-center gap-3 min-w-fit max-w-md',
        {
          'bg-red-50 text-red-800 border-2 border-red-300': toastState.isError,
          'bg-green-50 text-green-800 border-2 border-green-300':
          /  !toastState.isError && !toastState.text.includes('<img'),
          'bg-white border-2 border-green-400 shadow-xl': toastState.text.includes('<img'),
        },
      ]"
    > -->
<!-- Renderiza HTML (GIF) -->
<!-- <div v-if="toastState.text.includes('<img')" v-html="toastState.text"></div> -->

<!-- Renderiza texto simples -->
<!-- <span v-else>{{ toastState.text }}</span>
    </div>
  </Transition>
</template> -->

<!-- <style scoped>
/* Garantir que z-index funcione */
div[class*='z-[1000]'] {
  position: fixed;
}



</style> -->
