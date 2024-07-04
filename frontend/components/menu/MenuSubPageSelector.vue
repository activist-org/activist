<template>
  <div class="h-fit w-full">
    <TabGroup @change="changeTab" manual :default-index="defaultIndex">
      <TabList class="flex flex-row">
        <Tab v-for="selector in selectors" :key="selector.id" class="w-full">
          <NuxtLink
            class="focus-brand flex w-full items-center justify-center rounded-none border-[1px] border-light-text px-3 py-1 dark:border-dark-text"
            :class="{
              'bg-light-menu-selection text-light-layer-1 hover:bg-light-menu-selection/90 dark:bg-dark-menu-selection dark:text-dark-layer-1 dark:hover:bg-dark-menu-selection/90':
                selector.id == props.selectedRoute,
              'bg-light-layer-2 text-light-text hover:bg-light-highlight dark:bg-dark-layer-2 dark:text-dark-text dark:hover:bg-dark-highlight':
                selector.id != props.selectedRoute,
            }"
            :to="localePath(selector.routeURL)"
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
import useBreakpoint from "~/composables/useBreakpoint";
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
  const selectedRoute = props.selectors[index]?.routeURL;
  if (selectedRoute) {
    router.push(nuxtApp.$localePath(selectedRoute));
  }
}
</script>
