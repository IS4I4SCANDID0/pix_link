<template>
  <button :class="[baseClass, customColors]" @click="$emit('click')">
    <slot />
    <slot name="icon" />
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
const props = defineProps({
  text: String,
  bgColor: {
    type: String,
    default: 'bg-white',
  },
  textColor: {
    type: String,
    default: 'text-zinc-800',
  },
  hoverColor: {
    type: String,
    default: 'hover:bg-gray-200',
  },
})
defineEmits(['click'])

const baseClass: string[] = [
  'h-8',
  'max-w-fit',
  'flex',
  'justify-evenly',
  'items-center',
  'gap-1.5',
  'font-bold',
  'rounded-lg',
  'p-2',
  'text-xs',
  'text-center',
  'transition',
]

const customColors = computed(() => [props.bgColor, props.textColor, props.hoverColor])
</script>
