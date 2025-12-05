<template>
  <div v-if="isActive" class="machine-container">
    <!-- You can render the progress bar here directly -->
    <div class="progress-bar-container">
      <span>Step {{ context.currentStep }} of {{ context.totalSteps }}</span>
      <progress
        :max="context.totalSteps"
        :value="context.currentStep"
      />
    </div>

    <Loading v-if="loading && !currentScreen" :loading="loading && currentScreen" />
    <component :is="currentScreen" v-else-if="currentScreen" />
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
import Loading from '../Loading.vue';

const props = defineProps<{
  machineType: MachineType;
  options?: Record<string, unknown>;
}>();
const emit = defineEmits(["close", "submit"]);

const { isActive, currentScreen, context, loading, start, close, next } =
  useFlowScreens(props.machineType, props.options);
watch(
  currentScreen,
  (newVal) => {
    console.log("Current screen changed to:", newVal, loading.value);
  },
  { immediate: true }
);
onMounted(() => {
  console.log("Machine component mounted. Starting flow...");
});

// Provide both the actions and the reactive context.
provide("flow", {
  // Actions
  start,
  close: (discard?: boolean) => {
    close(discard);
    emit("close");
  },
  next,
  // Reactive state
  context,
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
</style>
