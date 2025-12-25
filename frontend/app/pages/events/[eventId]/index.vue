<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="windowWidth < BreakpointMap.SMALL"
    class="flex flex-col items-center justify-between gap-8 bg-layer-0 px-8 py-8"
  >
    <Head>
      <Title>{{ event?.name }} </Title>
    </Head>
    <div class="mx-auto h-[260px] w-3/4">
      <ImageEvent
        :alt="
          $t('i18n._global.entity_logo', {
            entity_name: event?.name,
          })
        "
        :eventType="event?.type"
        :imgUrl="event?.iconUrl?.fileObject || ''"
      />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-center text-3xl font-bold">
        {{ event?.name }}
      </h1>
      <h2 class="text-lg font-bold text-distinct-text">
        {{ event?.tagline }}
      </h2>
    </div>
    <div class="flex w-full flex-col items-center gap-4">
      <MenuLinkWrapper
        v-for="[i, button] of eventButtons.entries()"
        :key="i"
        :selected="button.selected"
        :to="localPath(button.routeUrl as string)"
      >
        <div
          class="flex w-full items-center space-x-2 text-left text-sm font-medium"
        >
          <span class="width-1/6">
            <Icon
              v-if="button.iconUrl"
              class="h-5 w-5 shrink-0"
              :name="button.iconUrl"
            />
          </span>
          <p
            class="width-5/6 hover:menu-selection select-none whitespace-nowrap text-lg font-bold"
          >
            <span class="sr-only">{{ $t("i18n._global.navigate_to") }}</span>
            {{ $t(button.label) }}
          </p>
        </div>
      </MenuLinkWrapper>
      <BtnRouteInternal
        ariaLabel="i18n._global.offer_to_help_aria_label"
        class="w-max"
        :cta="true"
        fontSize="base"
        iconSize="1.25em"
        label="i18n._global.offer_to_help"
        linkTo="/"
        :rightIcon="IconMap.ARROW_RIGHT"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  event: CommunityEvent;
}>();

const localPath = useLocalePath();

const { eventEntry } = useMenuEntriesState();

const eventButtons: MenuSelector[] = [];

eventEntry.value.forEach((entry) => {
  eventButtons.push(entry);
});

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > BreakpointMap.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

    if (
      currentRoute.path !== `/${locale.value}/events/${props.event.id}/about` ||
      currentRoute.path === `/${locale.value}/events/${props.event.id}/`
    ) {
      navigateTo(`/${locale.value}/events/${props.event.id}/about`);
    }
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUpdated(() => {
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
