<template>
  <Teleport to="body" data-testid="modal-container">
    <div
      v-if="visible"
      :class="[
        'w-screen h-screen fixed inset-0 z-9000! flex flex-col items-center justify-center bg-primary-red/85 transition-all duration-500 animate-overlay-fade',

        overlayClass,
      ]"
      data-testid="modal-overlay"
    >
      <div
        :class="[
          'w-[88%] md:w-96 relative flex flex-col items-center justify-center gap-2 p-3 z-9010! transition-all duration-300 scale-95 animate-fade-in bg-white rounded-xl',

          contentClass,
        ]"
        data-testid="modal-wrapper"
      >
        <BaseButton
          class="w-fit h-fit absolute top-1 right-1 text-xl font-manrope font-semibold text-secondary-red py-0 hover:scale-105 hover:bg-tertiary-green transition-colors duration-700 ease-in cursor-pointer"
          @click="$emit('close')"
          type="button"
          data-testid="modal-close-btn"
          aria-label="Fechar modal"
        >
          <GrFormClose class="text-secondary-green" />
        </BaseButton>

        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { GrFormClose } from 'vue-icons-plus/gr'

defineProps({
  visible: Boolean,
  overlayClass: {
    type: String,
    default: '',
  },
  contentClass: {
    type: String,
    default: '',
  },
})

defineEmits(['close'])
</script>
