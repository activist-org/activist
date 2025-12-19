<template>
  <div v-if="isActive">
    <!-- You can render the progress bar here directly -->
    <div class="mb-6 text-center text-gray-600">
      <span>Step {{ context.currentStep }} of {{ context.totalSteps }}</span>
      <div class="w-full h-2 mt-2 bg-layer-1 rounded-full overflow-hidden">
        <div
          class="h-full bg-cta-orange rounded-full transition-all duration-300"
          :style="{ width: `${(context.currentStep / context.totalSteps) * 100}%` }"
        />
      </div>
    </div>

    <Loading v-if="loading && !currentScreen" :loading="(loading && currentScreen)!!" />
    <component :is="currentScreen" v-else-if="currentScreen" />
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  machineType: MachineType;
  options?: Record<string, unknown>;
}>();
const emit = defineEmits(["close", "submit"]);

const { isActive, currentScreen, context, loading, start, close, next, prev } =
  useFlowScreens(props.machineType, props.options);

// Provide both the actions and the reactive context.
provide("flow", {
  // Actions
  start,
  close: (discard?: boolean) => {
    close(discard);
    emit("close");
  },
  next,
  prev,
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
