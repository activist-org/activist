<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase class="rounded-md" data-testid="menu-tooltip">
    <div class="flex-col space-y-2">
      <!-- <BtnAction
        @keydown="handleTabPress(false, $event)"
        class="flex max-h-10 w-full"
        :cta="true"
        label="i18n._global.support"
        leftIcon="IconSupport"
        fontSize="lg"
        ariaLabel="i18n._global.support_event_aria_label"
      /> -->
      <!-- <BtnAction
        class="flex max-h-10 w-full items-center"
        :cta="true"
        label="i18n.components.tooltip_menu_search_result_event.attend"
        leftIcon="IconJoin"
        fontSize="lg"
        ariaLabel="i18n.components.tooltip_menu_search_result_event.attend_aria_label"
      /> -->
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

const config = useRuntimeConfig();

const downloadCalendarEntry = async () => {
  try {
    const url = `${config.public.apiBase}/v1/events/event_calendar?event_id=${props.event.id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const filename = match ? match[1].replace(/['"]/g, "") : `event-${props.event.id}.ics`;
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Failed to download calendar entry:", err);
  }
};

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");
</script>
