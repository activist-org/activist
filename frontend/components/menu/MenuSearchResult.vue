<template>
  <div @mouseleave="showTooltip = false" class="p-2">
    <button
      @click="showTooltip = showTooltip == true ? false : true"
      class="relative flex items-center justify-center style-cta rounded-full w-6 h-6 elem-shadow-sm"
    >
      <Icon name="bi:three-dots-vertical" size="1.25em" />
      <TooltipMenuSearchResultEvent
        v-if="searchResultType === 'event'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultOrganization
        v-if="searchResultType === 'organization'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultResource
        v-if="searchResultType === 'resource'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultUser
        v-if="searchResultType === 'user'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        class="absolute bottom-6 left-4"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
}>();
const showTooltip = ref(false);
</script>
