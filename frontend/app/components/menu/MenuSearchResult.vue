<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- ADDED "relative" to the parent div so absolute tooltips anchor here -->
  <div
    ref="quickActionBtnAndMenu"
    @mouseleave="showTooltip = false"
    class="relative p-2"
  >
    <!-- MARK: The Trigger Button -->
    <button
      @click="toggleTooltip"
      @keydown.shift.tab="onShiftTab"
      :aria-label="
        $t('i18n.components.menu_search_result.toggle_menu_aria_label')
      "
      class="style-cta flex h-8 w-8 items-center justify-center rounded-full elem-shadow-sm md:h-6 md:w-6"
      data-testid="menu-button"
    >
      <Icon :name="IconMap.DOTS_THREE_VERTICAL" size="1.25em" />
    </button>
    <TooltipMenuSearchResultEvent
      v-if="event"
      v-show="showTooltip"
      @blur="showTooltip = false"
      @keydown.shift.tab.stop
      @tab="onTab"
      class="max-md:right-0 max-md:top-8 absolute z-50 lg:bottom-6 lg:left-4"
      :event="event"
    />
    <TooltipMenuSearchResultOrganization
      v-if="organization"
      v-show="showTooltip"
      @blur="showTooltip = false"
      @keydown.shift.tab.stop
      @tab="onTab"
      class="max-md:right-0 max-md:top-8 absolute z-50 lg:bottom-6 lg:left-4"
      :organization="organization"
    />
    <TooltipMenuSearchResultGroup
      v-if="group"
      v-show="showTooltip"
      @blur="showTooltip = false"
      @keydown.shift.tab.stop
      @tab="onTab"
      class="max-md:right-0 max-md:top-8 absolute z-50 lg:bottom-6 lg:left-4"
      :group="group"
    />
    <TooltipMenuSearchResultResource
      v-if="resource"
      v-show="showTooltip"
      @blur="showTooltip = false"
      @keydown.shift.tab.stop
      @tab="onTab"
      class="max-md:right-0 max-md:top-8 absolute z-50 lg:bottom-6 lg:left-4"
      :resource="resource"
    />
    <TooltipMenuSearchResultUser
      v-if="user"
      v-show="showTooltip"
      @blur="showTooltip = false"
      @keydown.shift.tab.stop
      @tab="onTab"
      class="max-md:right-0 max-md:top-8 absolute z-50 lg:bottom-6 lg:left-4"
      :user="user"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  organization?: Organization;
  group?: Group;
  event?: CommunityEvent;
  resource?: Resource;
  user?: UserActivist;
}>();

const showTooltip = ref(false);
const quickActionBtnAndMenu = ref();

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

const closeTooltip = () => {
  showTooltip.value = false;
};

onClickOutside(quickActionBtnAndMenu, closeTooltip);

const onTab = () => {
  closeTooltip();
};

const onShiftTab = () => {
  closeTooltip();
};
</script>
