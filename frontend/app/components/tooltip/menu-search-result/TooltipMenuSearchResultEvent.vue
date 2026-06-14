<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="flex-col space-y-2">
      <BtnAction
        @click="handleFavorite"
        @keydown="handleTabPress(false, $event)"
        @keydown.enter="handleFavorite"
        class="flex max-h-10 w-full"
        :cta="true"
        :label="
          isFavorited
            ? 'i18n._global.unfavorite'
            : 'i18n._global.favorite'
        "
        :rightIcon="IconMap.HEART"
        fontSize="lg"
        :ariaLabel="
          isFavorited
            ? 'i18n._global.unfavorite_event_aria_label'
            : 'i18n._global.favorite_event_aria_label'
        "
      />
      <BtnAction
        @click="openModalSharePage({ event: event })"
        @keydown="handleTabPress(true, $event)"
        @keydown.enter="openModalSharePage({ event: event })"
        ariaLabel="i18n._global.share_event_aria_label"
        class="flex max-h-10 w-full items-center"
        :cta="true"
        fontSize="lg"
        label="i18n._global.share"
        :rightIcon="IconMap.SHARE"
      />
      <BtnAction
        @click="downloadCalendarEntry"
        @keydown.enter="downloadCalendarEntry"
        ariaLabel="i18n._global.subscribe_to_event_aria_label"
        class="flex max-h-10 w-full items-center"
        :cta="true"
        fontSize="lg"
        :hideLabelOnMobile="false"
        label="i18n._global.subscribe"
        :rightIcon="IconMap.DATE"
      />
    </div>
  </TooltipBase>
</template>
<script setup lang="ts">
const props = defineProps<{
  event: CommunityEvent;
}>();

const emit = defineEmits(["tab"]);
const { handleTabPress } = useTabNavigationEmit(emit);
const downloadCalendarEntry = () => {};
const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");

const eventStore = useEventStore();

/** Whether the current user has favorited this event. */
const isFavorited = computed(() =>
  eventStore.isEventFavorited(props.event.id)
);

/** Handles the favorite toggle action. */
async function handleFavorite(): Promise<void> {
  await eventStore.toggleFavorite(props.event.id);
}
</script>