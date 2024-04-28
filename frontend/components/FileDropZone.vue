<template>
  <button
    @drop.prevent="onDrop"
    @dragenter.prevent="activate"
    @dragover.prevent="activate"
    @dragleave.prevent="deactivate"
    class="card-style-base flex w-full rounded-lg"
    :class="{
      'bg-light-highlight dark:bg-dark-highlight': isActive,
      'bg-light-layer-1 dark:bg-dark-layer-1': !isActive,
    }"
  >
    <label
      for="file-input"
      class="flex h-80 w-full cursor-pointer items-center justify-center"
    >
      <slot :isDropZoneActive="isActive"></slot>
      <input
        @change="onInputChange"
        id="file-input"
        class="hidden"
        type="file"
        multiple
      />
    </label>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(["files-dropped"]);

const isActive = ref(false);

let deactivateTimeoutKey: number | null = null;

const activate = () => {
  isActive.value = true;
  if (deactivateTimeoutKey) clearTimeout(deactivateTimeoutKey);
};

const deactivate = () => {
  isActive.value = false;
  deactivateTimeoutKey = window.setTimeout(() => {
    isActive.value = false;
  }, 50);
};

function onDrop(e: DragEvent) {
  if (!e.dataTransfer) return;
  emit("files-dropped", [...e.dataTransfer.files]);
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  emit("files-dropped", [...target.files]);
}

function preventDefaults(e: Event) {
  e.preventDefault();
}

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});
</script>
