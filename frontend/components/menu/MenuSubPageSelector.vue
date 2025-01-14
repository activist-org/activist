<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="h-fit w-full">
    <TabGroup @change="changeTab" manual :default-index="defaultIndex">
      <TabList class="flex flex-row">
        <Tab v-for="selector in selectors" :key="selector.id" class="w-full">
          <NuxtLink
            class="focus-brand flex w-full items-center justify-center rounded-none border-[1px] border-primary-text px-3 py-1"
            :class="{
              'bg-menu-selection text-layer-1 hover:bg-menu-selection/90':
                selector.id == props.selectedRoute,
              'bg-layer-2 text-primary-text hover:bg-highlight':
                selector.id != props.selectedRoute,
            }"
            :to="localePath(selector.routeUrl)"
          >
            <div v-if="!aboveMediumBP">
              <Icon
                v-if="selector.iconName"
                :name="selector.iconName"
                size="1em"
              />
            </div>
            <p v-if="!selector.iconName || aboveMediumBP">
              {{ selector.label }}
            </p>
          </NuxtLink>
        </Tab>
      </TabList>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList } from "@headlessui/vue";
import type { SubPageSelector } from "~/types/sub-page-selector";

const props = defineProps<{
  selectors: SubPageSelector[];
  selectedRoute: number;
}>();

const aboveMediumBP = useBreakpoint("md");

const localePath = useLocalePath();
const nuxtApp = useNuxtApp();
const router = useRouter();

const defaultIndex = computed(() => {
  return props.selectors.findIndex((selector) => selector.selected) || 0;
});

function changeTab(index: number) {
  const selectedRoute = props.selectors[index]?.routeUrl;
  if (selectedRoute) {
    router.push(nuxtApp.$localePath(selectedRoute));
  }
}
</script>
