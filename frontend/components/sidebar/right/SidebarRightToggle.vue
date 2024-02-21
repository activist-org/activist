<template>
  <div>
    <button
      @click="$emit('toggle')"
      class="relative z-50 group focus-brand"
      :aria-label="
        $t('components.sidebar-right-toggle.sidebar-collapse-aria-label')
      "
    >
      <div class="w-6 h-6">
        <SidebarToggle
          v-if="!menuOpen"
          chevronDirection="left"
          iconSize="1.4em"
        />
        <SidebarToggle
          v-if="menuOpen"
          chevronDirection="right"
          iconSize="1.4em"
        />
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
