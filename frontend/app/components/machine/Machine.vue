<template>
  <div v-if="isActive" class="machine-container">
    <!-- You can render the progress bar here directly -->
    <div class="progress-bar-container">
      <span>Step {{ context.currentStep }} of {{ context.totalSteps }}</span>
      <progress :value="context.currentStep" :max="context.totalSteps"></progress>
    </div>

    <div v-if="loading" class="loading-overlay">Loading...</div>
    <component v-else-if="currentScreen" :is="currentScreen" />
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'; // Import computed
import { useFlowScreens } from '~/composables/useFlowScreens';
// ... other imports

const props = defineProps<{ /* ... */ }>();
const emit = defineEmits(['close', 'submit']);

const { store, isActive, currentScreen, loading, start, close, next } = useFlowScreens(
  props.machineType,
  props.options
);

// We create a more comprehensive context object to provide to child screens.
// It now includes the original store context AND the new progress getters.
const flowContext = computed(() => ({
  // Core state from the store
  active: store.active,
  nodeId: store.nodeId,
  currentNode: store.currentNode,
  nodeData: store.nodeData,

  // NEW: Progress information from the getters
  currentStep: store.currentStep,
  totalSteps: store.totalSteps,
}));

// Provide both the actions and the reactive context.
provide('flow', {
  // Actions
  start,
  close: (discard?: boolean) => { close(discard); emit('close'); },
  next,
  // Reactive state
  context: flowContext,
});

defineExpose({ start, close });
</script>

<style scoped>
/* Add some styling for the progress bar */
.progress-bar-container {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #555;
}
progress {
  width: 100%;
  height: 8px;
  margin-top: 0.5rem;
}
.machine-container { /* ... */ }
.loading-overlay { /* ... */ }
</style>
