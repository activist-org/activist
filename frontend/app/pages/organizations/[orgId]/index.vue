<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="windowWidth < BreakpointMap.SMALL"
    class="flex flex-col items-center justify-between gap-8 bg-layer-0 px-8 py-8"
  >
    <Head>
      <Title>{{ organization?.name }} </Title>
    </Head>
    <div class="mx-auto h-[260px] w-3/4">
      <ImageOrganization
        :alt="
          $t('i18n._global.entity_logo', {
            entity_name: organization?.name,
          })
        "
        :imgUrl="organization?.iconUrl?.fileObject"
      />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-3xl font-bold">
        {{ organization?.name }}
      </h1>
      <h2 class="text-center text-lg font-bold text-distinct-text">
        {{ organization?.tagline }}
      </h2>
    </div>
    <div class="flex w-full flex-col items-center gap-4">
      <MenuLinkWrapper
        v-for="button in organizationButtons"
        :key="button.id"
        :selected="button.selected"
        :to="localePath(button.routeUrl)"
      >
        <div
          class="flex w-full items-center space-x-2 text-left text-sm font-medium"
        >
          <span class="width-1/6">
            <Icon
              v-if="button.iconUrl"
              class="h-5 w-5 flex-shrink-0"
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
import type { MenuSelector } from "~/types/menu/menu-selector";

import { useGetOrganization } from "~/composables/queries/useGetOrganization";
import useMenuEntriesState from "~/composables/useMenuEntriesState";
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

const { data: organization } = useGetOrganization(
  useRoute().params.orgId as string
);

const localePath = useLocalePath();

const { organizationEntry } = useMenuEntriesState();

const organizationButtons: MenuSelector[] = [];

organizationEntry.value.forEach((entry) => {
  organizationButtons.push(entry);
});

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > BreakpointMap.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

    if (
      currentRoute.path !==
        `/${locale.value}/organizations/${organization.value?.id}/about` ||
      currentRoute.path ===
        `/${locale.value}/organizations/${organization.value?.id}/`
    ) {
      navigateTo(
        `/${locale.value}/organizations/${organization.value?.id}/about`
      );
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
