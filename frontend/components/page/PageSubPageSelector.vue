<template>
  <div class="w-full h-fit">
    <TabGroup v-model="currentTabIndex"
    @change="changeTab"
    manual
    :default-index="defaultIndex"
    >
      <TabList class="flex flex-row">
        <Tab v-for="selector in selectors" :key="selector.id" class="w-full">
          <template v-slot="{ selected }">
            <NuxtLink
              :class="[
                'justify-center flex px-3 py-1 border-l-[1px] border-y-[1px] w-full',
                'border-light-text dark:border-dark-text',
                selected
                  ? 'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct hover:bg-light-menu-selection/90 dark:hover:bg-dark-menu-selection/90'
                  : 'bg-light-header dark:bg-dark-header text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight',
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
import { computed } from 'vue';
import { Tab, TabList, TabGroup } from '@headlessui/vue';
import { SubPageSelector } from '~/types/sub-page-selector';

const router = useRouter();
const nuxtApp = useNuxtApp();

const props = defineProps<{
  selectors: SubPageSelector[];
}>();

const defaultIndex = computed(() => {
  return props.selectors.findIndex(selector => selector.selected) || 0;
});

function changeTab(index: number) {
  const selectedRoute = props.selectors[index]?.routeURL;
  if (selectedRoute) {
    router.push(nuxtApp.$localePath(selectedRoute));
  }
}
</script>
