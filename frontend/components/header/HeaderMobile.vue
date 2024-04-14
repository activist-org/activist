<template>
  <header
    ref="header"
    class="sticky top-0 z-10 h-12 w-full bg-light-layer-2 drop-shadow-md duration-500 dark:bg-dark-layer-2 md:hidden"
  >
    <div class="h-full">
      <div class="flex h-full justify-between gap-2 px-4">
        <SearchBar
          @on-search-toggle="toggleSearchExpanded"
          class="my-1.5"
          :class="{ 'w-full': isSearchExpanded }"
          :location="SearchBarLocation.HEADER"
          :expanded="isSearchExpanded"
        />
        <IconActivist
          v-if="!isSearchExpanded"
          class="absolute left-0 right-0 top-[0.3rem] m-auto flex h-8 w-6 items-center overflow-clip"
        />
        <SidebarRight>
          <div class="flex-col space-y-2">
            <DropdownTheme
              class="w-full"
              :location="DropdownLocation.SIDEMENU"
            />
            <DropdownLanguage
              class="w-full"
              :location="DropdownLocation.SIDEMENU"
            />
            <DropdownCreate
              class="w-full"
              :location="DropdownLocation.SIDEMENU"
            />
            <DropdownInfo
              class="w-full"
              :location="DropdownLocation.SIDEMENU"
            />
            <DropdownUserOptions
              class="w-full"
              :location="DropdownLocation.SIDEMENU"
            />
          </div>
        </SidebarRight>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { DropdownLocation, SearchBarLocation } from "~/types/location";

const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
