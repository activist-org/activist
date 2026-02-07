<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-if="isActive">
    <div class="mb-6 text-center text-gray-600">
      <span>
        {{
          $t("i18n.components.machine._global.machine", {
            current_step: context.currentStep,
            total_steps: context.totalSteps,
          })
        }}
      </span>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-layer-1">
        <div
          class="h-full rounded-full bg-cta-orange transition-all duration-300"
          :style="{
            width: `${(context.currentStep / context.totalSteps) * 100}%`,
          }"
        />
      </div>
    </div>

    <Loading
      v-if="loading && !currentScreen"
      :loading="(loading && currentScreen)!!"
    />
    <component :is="currentScreen" v-else-if="currentScreen" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  machineType: MachineType;
  options?: UseFlowScreensOptions;
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
/* Add some styling for the progress bar. */
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
