<template>
  <div @mouseleave="showTooltip = false" class="p-2">
    <button
      @click="showTooltip = showTooltip == true ? false : true"
      ref="tooltipButton"
      class="relative flex items-center justify-center style-cta rounded-full w-6 h-6 elem-shadow-sm"
    >
      <Icon name="bi:three-dots-vertical" size="1.25em" />
      <TooltipMenuSearchResultEvent
        v-if="searchResultType === 'event'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultOrganization
        v-if="searchResultType === 'organization'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultResource
        v-if="searchResultType === 'resource'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultUser
        v-if="searchResultType === 'user'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
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
const tooltipButton = ref(null)

// The function is triggered when the Tab key is pressed on the last element of the tooltip.
// It sets the 'showTooltip' to false, making the tooltip invisible.
// NOTE: If new elements are added to the tooltip, this function should be reviewed to ensure it correctly handles the visibility of the tooltip in response to Tab key actions.
const onTab = () => {
  showTooltip.value = false
}
</script>
