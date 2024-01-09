<template>
  <div @mouseleave="showTooltip = false" class="p-2" ref="tooltip">
    <button
      @click="toggleTooltip"
      @keydown.shift.tab="onShiftTab"
      class="relative flex items-center justify-center w-8 h-8 rounded-full style-cta md:w-6 md:h-6 elem-shadow-sm"
    >
      <Icon name="bi:three-dots-vertical" size="1.25em" />
      <TooltipMenuSearchResultEvent
        v-if="searchResultType === 'event'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:top-8 max-md:right-0 lg:bottom-6 lg:left-4"
      />
      <TooltipMenuSearchResultOrganization
        v-if="searchResultType === 'organization'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:top-8 max-md:right-0 lg:bottom-6 lg:left-4"
      />
      <TooltipMenuSearchResultResource
        v-if="searchResultType === 'resource'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:top-8 max-md:right-0 lg:bottom-6 lg:left-4"
      />
      <TooltipMenuSearchResultUser
        v-if="searchResultType === 'user'"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:top-8 max-md:right-0 lg:bottom-6 lg:left-4"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchResultType: "organization" | "event" | "resource" | "user";
}>();

const showTooltip = ref(false);
const tooltip = ref(); 

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

const closeTooltip = () => {
  showTooltip.value = false;
};

onClickOutside(tooltip, closeTooltip);

// The functions are triggered when the Tab key is pressed on the button or tooltip elements.
// They set `showTooltip` to false, making the tooltip invisible again.
// NOTE: This functionality should be reviewed if new elements are added to the tooltip.
//   - The first Btn in the tooltip should get `isLastItem = false`
//   - The last Btn should get `isLastItem = true`
const onTab = () => {
  closeTooltip();
};

const onShiftTab = () => {
  closeTooltip();
};
</script>
