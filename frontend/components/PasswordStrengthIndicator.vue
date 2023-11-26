<template>
  <div
    v-if="!!passwordValue.length"
    class="h-1 bg-gray-400"
  >
    <div
      class="h-1 transition-width ease-in duration-500"
      :style="`width: ${width}%; background: ${color};`"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import zxcvbn from 'zxcvbn'

const props = defineProps({
  passwordValue: {
    type: String,
    default: '',
  }
})

const width = ref<number>(0)
const color = ref<string>('')

const strength: Record<number, string> = {
  0: '#FF0000',
  1: '#FFA500',
  2: '#FFFF00',
  3: '#90EE90',
  4: '#008000'
}


const strengthMeter = () => {
  const score = zxcvbn(props.passwordValue).score
  width.value = (score + 1) * 20
  color.value = strength[score]
}
watch(() => props.passwordValue, () => {
 strengthMeter()
})
</script>
