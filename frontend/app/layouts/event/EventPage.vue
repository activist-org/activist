<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <SidebarLeft
      v-if="aboveMediumBP"
      @blur="sidebarHover = false"
      @focus="sidebarHover = true"
      @mouseleave="sidebarHover = false"
      @mouseover="sidebarHover = true"
      class="fixed top-0 z-20 h-screen"
    />
    <div class="grid grid-rows-[1fr_auto] md:h-screen md:overflow-y-scroll">
      <div
        class="bg-layer-0 pt-14 transition-[padding] duration-500 md:pt-0"
        :class="sidebarContentDynamicClass"
      >
        <EntityIconMobile
          v-if="showMobileEntityShortcut"
          @edit="handleEditEventIcon"
          :accentClass="eventLogoAccentClass"
          :entity="event"
          :icon="IconMap.EVENT"
          :imgUrl="eventIconUrl"
          :tagline="event?.tagline"
        />
        <NuxtPage :event="event" />
      </div>
      <FooterWebsite
        class="pb-24 transition-[padding] duration-500 md:pb-12"
        :class="sidebarFooterDynamicClass"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const aboveMediumBP = useBreakpoint("md");

const route = useRoute();
const paramsEventId = route.params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const { data: event } = useGetEvent(eventId || "");

const eventIconUrl = computed(() =>
  event.value?.iconUrl?.fileObject
    ? `/api/${event.value.iconUrl.fileObject}`
    : ""
);
const eventLogoAccentClass = computed(() =>
  event.value?.type === "learn" ? "bg-learn-blue" : "bg-action-red"
);

const normalizedRoutePath = computed(() => route.path.replace(/\/$/, ""));
const showMobileEntityShortcut = computed(
  () =>
    !aboveMediumBP.value &&
    !!event.value &&
    !!eventId &&
    !normalizedRoutePath.value.endsWith(`/events/${eventId}`)
);

const sidebarHover = ref(false);
const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");
const { getSidebarContentDynamicClass, getSidebarFooterDynamicClass } =
  useSidebarClass();
const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);

const { openModal } = useModalHandlers("ModalUploadImageIcon");

function handleEditEventIcon(): void {
  if (!event.value?.id) {
    return;
  }

  openModal({
    entityId: event.value.id,
    entityType: EntityType.EVENT,
  });
}
</script>
