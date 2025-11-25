<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import BaseButton from './BaseButton.vue'
import { GrFormClose } from 'vue-icons-plus/gr'

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
        'w-screen h-screen fixed inset-0 z-20 flex flex-col items-center justify-center bg-primary-red/90 transition-all duration-300 ease-in-out',
        overlayClass,
      ]"
    >
      <div
        :class="[
          'w-3/5 md:w-96 relative p-3 z-50 transform scale-95 animate-fade-in bg-white',
          contentClass,
        ]"
      >
        <BaseButton
          class="w-fit h-fit absolute top-1 right-1 text-xl font-manrope font-semibold text-secondary-red py-0"
          @click="$emit('close')"
        >
          <GrFormClose class="text-secondary-red" />
        </BaseButton>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
