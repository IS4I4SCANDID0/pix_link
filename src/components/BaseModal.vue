<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  headlines: {
    type: Array as () => string[],
    required: true,
  },
  selectedHeadline: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['close', 'select'])

const selectHeadline = (headline: string) => {
  emit('select', headline)
  localStorage.setItem('@pixlink_headline', headline)
}
</script>
