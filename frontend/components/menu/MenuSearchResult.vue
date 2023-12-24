<template>
  <div @mouseleave="showTooltip = false" class="p-2">
    <button
      @click="showTooltip = !showTooltip"
      @keydown.shift.tab="onShiftTab"
      class="relative flex items-center justify-center style-cta rounded-full w-6 h-6 elem-shadow-sm"
    >
      <Icon name="bi:three-dots-vertical" size="1.25em" />
      <TooltipMenuSearchResultEvent
        v-if="searchResultType === 'event'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultOrganization
        v-if="searchResultType === 'organization'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultResource
        v-if="searchResultType === 'resource'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute bottom-6 left-4"
      />
      <TooltipMenuSearchResultUser
        v-if="searchResultType === 'user'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
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

// The functions are triggered when the Tab key is pressed on the button or tooltip elements.
// They set `showTooltip` to false, making the tooltip invisible again.
// NOTE: This functionality should be reviewed if new elements are added to the tooltip.
//   - The first BtnLabeled in the tooltip should get `isLastItem = false`
//   - The last BtnLabeled should get `isLastItem = true`
const onTab = () => {
  showTooltip.value = false;
};

const onShiftTab = () => {
  showTooltip.value = false;
};
</script>
