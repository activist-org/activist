<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="h-fit w-full">
    <TabGroup @change="changeTab" manual :selectedIndex="props.selectedTab">
      <TabList class="flex flex-row">
        <Tab v-for="tab in tabs" :key="tab.id" class="w-full">
          <NuxtLink
            class="flex w-full items-center justify-center rounded-none border border-primary-text px-3 py-1 focus-brand"
            :class="{
              'text-white! dark:text-black! bg-menu-selection hover:bg-menu-selection/90':
                tab.id == props.selectedTab,
              'bg-layer-2 text-primary-text-over-layer-2 hover:bg-highlight':
                tab.id != props.selectedTab,
            }"
          >
            <div v-if="!aboveMediumBP && tab.iconName">
              <Icon :name="tab.iconName" size="1em" />
            </div>
            <p
              :style="{
                color:
                  tab.id == props.selectedTab
                    ? $colorMode.value === 'dark'
                      ? 'black !important'
                      : 'white !important'
                    : 'inherit',
              }"
            >
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

const props = defineProps<{
  tabs: TabPage[];
  selectedTab: number;
}>();

const aboveMediumBP = useBreakpoint("md");

const nuxtApp = useNuxtApp();
const router = useRouter();

function changeTab(index: number) {
  const selectedTab = props.tabs[index]?.routeUrl;
  if (selectedTab) {
    router.push(nuxtApp.$localePath(selectedTab));
  }
}
</script>
