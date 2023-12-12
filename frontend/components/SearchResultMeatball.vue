<template>
  <button
    @click="showTooltip = showTooltip == true ? false : true"
    @mouseleave="showTooltip = false"
    class="relative flex items-center justify-center hover:cursor-pointer style-cta rounded-full w-6 h-6 elem-shadow-sm"
  >
    <Icon name="bi:three-dots-vertical" size="1.25em" />
    <TooltipOrganizations
      v-if="searchResultType === 'organization'"
      v-show="showTooltip"
    />
    <TooltipEvents v-if="searchResultType === 'event'" v-show="showTooltip" />
    <TooltipUsers v-if="searchResultType === 'user'" v-show="showTooltip" />
    <TooltipResources
      v-if="searchResultType === 'resource'"
      v-show="showTooltip"
    />
  </button>
</template>
<script setup lang="ts">
import TooltipOrganizations from "./tooltip/TooltipOrganizations.vue";
import TooltipEvents from "./tooltip/TooltipEvents.vue";
defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
}>();
const showTooltip = ref(false);
</script>
