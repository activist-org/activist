<template>
  <div>
    <h2>Create an Event Flow</h2>
    <p>Click the button below to start.</p>
    <button v-if="!isFlowActive" @click="startFlow">Start Creating Event</button>

    <!-- The Machine component is now self-contained. -->
    <!-- It no longer needs the `:screens` prop. -->
    <Machine
      v-if="isFlowActive"
      ref="machineRef"
      machine-type="createEvent"
      :options="flowOptions"
      @close="onFlowClose"
      @submit="onFlowSubmit"
    />

    <!-- ... rest of template ... -->
  </div>
</template>

<script setup lang="ts">
// NO MORE importing all the step components here!

const machineRef = ref<InstanceType<typeof Machine> | null>(null);
const isFlowActive = ref(false);
const submittedData = ref<any>(null);
// NO MORE `createEventScreens` map!

const flowOptions = {
  onLogicNode: (nodeId: string) => {
    console.log(`Machine is processing logic for node: ${nodeId}`);
  },
};

const startFlow = () => { /* ... */ };
const onFlowClose = () => { /* ... */ };
const onFlowSubmit = (result: any) => { /* ... */ };
</script>
