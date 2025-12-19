<template>
  <button :class="[...baseClass, customColors]" @click="$emit('click')">
    <slot></slot>
    <slot name="icon"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  text: String,
  bgColor: {
    type: String,
    default: 'bg-transparent',
  },
  textColor: {
    type: String,
    default: 'text-white',
  },
  hoverStyle: {
    type: String,
    default: 'hover:bg-gray-200',
  },
})
defineEmits(['click'])

const baseClass: string[] = [
  'min-h-fit',
  'min-w-fit',
  'flex',
  'justify-evenly',
  'items-center',
  'gap-1.5',
  'font-bold',
  'rounded-lg',
  'text-center',
  'transition',
]

const customColors = computed(() => [...baseClass, props.bgColor, props.textColor, props.hoverStyle, props.text])
</script>
