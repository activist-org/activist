<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="flex-col space-y-2">
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
      <BtnAction
        @click="handleSupport"
        @keydown="handleTabPress(false, $event)"
        @keydown.enter="handleSupport"
        class="flex max-h-10 w-full"
        :cta="true"
        :label="
          isSupported
            ? 'i18n._global.unsupport'
            : 'i18n._global.support'
        "
        :rightIcon="IconMap.SUPPORT"
        fontSize="lg"
        :ariaLabel="
          isSupported
            ? 'i18n._global.unsupport_event_aria_label'
            : 'i18n._global.support_event_aria_label'
        "
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

/** Whether the current user supports this event. */
const isSupported = computed(() =>
  eventStore.isEventSupported(props.event.id)
);

/** Handles the support toggle action. */
async function handleSupport(): Promise<void> {
  await eventStore.toggleSupport(props.event.id);
}
</script>