<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="h-fit w-full">
    <TabGroup @change="changeTab" manual :default-index="defaultIndex">
      <TabList class="flex flex-row">
        <Tab v-for="tab in tabs" :key="tab.id" class="w-full">
          <NuxtLink
            class="focus-brand flex w-full items-center justify-center rounded-none border-[1px] border-primary-text px-3 py-1"
            :class="{
              'bg-menu-selection text-layer-1 hover:bg-menu-selection/90':
                tab.id == props.selectedTab,
              'bg-layer-2 text-primary-text hover:bg-highlight':
                tab.id != props.selectedTab,
            }"
            :to="localePath(tab.routeUrl)"
          >
            <div v-if="!aboveMediumBP">
              <Icon v-if="tab.iconName" :name="tab.iconName" size="1em" />
            </div>
            <p v-if="!tab.iconName || aboveMediumBP">
              {{ tab.label }}
            </p>
          </NuxtLink>
        </Tab>
      </TabList>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList } from "@headlessui/vue";

import type { TabPage } from "~/types/tab";

const props = defineProps<{
  tabs: TabPage[];
  selectedTab: number;
}>();

const aboveMediumBP = useBreakpoint("md");

const localePath = useLocalePath();
const nuxtApp = useNuxtApp();
const router = useRouter();

const defaultIndex = computed(() => {
  return props.tabs.findIndex((tab) => tab.selected) || 0;
});

function changeTab(index: number) {
  const selectedTab = props.tabs[index]?.routeUrl;
  if (selectedTab) {
    router.push(nuxtApp.$localePath(selectedTab));
  }
}
</script>
