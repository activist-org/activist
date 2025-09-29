<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="h-fit w-full">
    <TabGroup @change="changeTab" manual :selectedIndex="props.selectedTab">
      <TabList class="flex flex-row">
        <Tab v-for="tab in tabs" :key="tab.id" class="w-full">
          <div
            @click="changeTab(tab.id)"
            @keydown.enter="changeTab(tab.id)"
            @keydown.space="changeTab(tab.id)"
            class="focus-brand flex w-full items-center justify-center rounded-none border-[1px] border-primary-text px-3 py-1"
            :class="{
              'bg-menu-selection text-layer-1 hover:bg-menu-selection/90':
                tab.id == props.selectedTab,
              'bg-layer-2 text-primary-text-over-layer-2 hover:bg-highlight':
                tab.id != props.selectedTab,
            }"
            role="tab"
            :aria-selected="tab.id == props.selectedTab"
            :tabindex="tab.id == props.selectedTab ? 0 : -1"
          >
            <div v-if="!aboveMediumBP && tab.iconName">
              <Icon :name="tab.iconName" size="1em" />
            </div>
            <p>
              {{ tab.label }}
            </p>
          </div>
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

const nuxtApp = useNuxtApp();
const router = useRouter();

function changeTab(tabId: number) {
  const selectedTab = props.tabs.find((tab) => tab.id === tabId)?.routeUrl;
  if (selectedTab) {
    router.push(nuxtApp.$localePath(selectedTab));
  }
}
</script>
