<template>
  <div class="h-fit w-full">
    <TabGroup
      v-model="currentTabIndex"
      @change="changeTab"
      manual
      :default-index="defaultIndex"
    >
      <TabList class="flex flex-row">
        <Tab v-for="selector in selectors" :key="selector.id" class="w-full">
          <template #default="{ selected }">
            <NuxtLink
              :class="[
                'flex w-full justify-center border-y-[1px] border-l-[1px] px-3 py-1',
                'border-light-text dark:border-dark-text',
                selected
                  ? 'bg-light-menu-selection dark:bg-dark-menu-selection text-light-layer-1 dark:text-dark-layer-1 hover:bg-light-menu-selection/90 dark:hover:bg-dark-menu-selection/90'
                  : 'bg-light-layer-2 dark:bg-dark-layer-2 text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight',
              ]"
              :to="localePath(selector.routeURL)"
            >
              {{ selector.label }}
            </NuxtLink>
          </template>
        </Tab>
      </TabList>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList } from "@headlessui/vue";
import type { SubPageSelector } from "~/types/sub-page-selector";
const localePath = useLocalePath();

const router = useRouter();
const nuxtApp = useNuxtApp();

const props = defineProps<{
  selectors: SubPageSelector[];
}>();

const defaultIndex = computed(() => {
  return props.selectors.findIndex((selector) => selector.selected) || 0;
});

function changeTab(index: number) {
  const selectedRoute = props.selectors[index]?.routeURL;
  if (selectedRoute) {
    router.push(nuxtApp.$localePath(selectedRoute));
  }
}
</script>
