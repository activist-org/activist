<template>
  <div
    @mouseleave="showTooltip = false"
    ref="quickActionBtnAndMenu"
    class="p-2"
  >
    <button
      @click="toggleTooltip"
      @keydown.shift.tab="onShiftTab"
      class="style-cta elem-shadow-sm relative flex h-8 w-8 items-center justify-center rounded-full md:h-6 md:w-6"
    >
      <Icon :name="IconMap.DOTS_THREE_VERTICAL" size="1.25em" />
      <TooltipMenuSearchResultEvent
        v-if="event"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:right-0 max-md:top-8 lg:bottom-6 lg:left-4"
        :event="event"
      />
      <TooltipMenuSearchResultOrganization
        v-if="organization"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:right-0 max-md:top-8 lg:bottom-6 lg:left-4"
        :organization="organization"
      />
      <TooltipMenuSearchResultGroup
        v-if="group"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:right-0 max-md:top-8 lg:bottom-6 lg:left-4"
        :group="group"
      />
      <TooltipMenuSearchResultResource
        v-if="resource"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:right-0 max-md:top-8 lg:bottom-6 lg:left-4"
        :resource="resource"
      />
      <TooltipMenuSearchResultUser
        v-if="user"
        v-show="showTooltip"
        @blur="showTooltip = false"
        @tab="onTab"
        @keydown.shift.tab.stop
        class="absolute max-md:right-0 max-md:top-8 lg:bottom-6 lg:left-4"
        :user="user"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/auth/user";
import type { Resource } from "~/types/content/resource";
import type { Group } from "~/types/entities/group";
import type { Organization } from "~/types/entities/organization";
import type { Event } from "~/types/events/event";
import { IconMap } from "~/types/icon-map";

defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
}>();

const showTooltip = ref(false);
const quickActionBtnAndMenu = ref();

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

const closeTooltip = () => {
  showTooltip.value = false;
};

onClickOutside(quickActionBtnAndMenu.value, closeTooltip);

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
