<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
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
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="[
        'w-svw h-svh fixed inset-0 z-50 flex flex-col items-center justify-center gb-primary-green/55 transition-all duration-300',
        overlayClass,
      ]"
    >
      <div
        :class="[
          'relative p-4 shadow-lg transform opacity-0 scale-95 animate-fade-in',
          contentClass,
        ]"
      >
        <BaseButton
          class="absolute top-2 right-2 text-xl font-manrope font-medium"
          @click="$emit('close')"
        >
          x
        </BaseButton>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
