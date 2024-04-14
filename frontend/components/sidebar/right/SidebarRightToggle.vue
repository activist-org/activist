<template>
  <div>
    <button
      @click="$emit('toggle')"
      class="focus-brand relative z-40"
      :aria-label="
        $t('components.sidebar-right-toggle.sidebar-collapse-aria-label')
      "
    >
      <div
        class="flex h-6 w-6 transform items-center justify-center transition-transform duration-200"
        :class="{
          'rotate-180 pb-1': menuOpen,
        }"
      >
        <SidebarToggle chevronDirection="left" iconSize="1.4em" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  menuOpen: boolean;
}

withDefaults(defineProps<Props>(), {
  menuOpen: false,
});
defineEmits(["toggle"]);
</script>
