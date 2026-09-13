<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <header
    id="mobile-header"
    v-if="!aboveMediumBP"
    ref="header"
    class="sticky top-0 z-50 h-12 w-full bg-layer-2 drop-shadow-md duration-500"
  >
    <div class="h-full">
      <div class="flex h-full justify-between gap-2 px-4">
        <SearchBar
          @on-search-toggle="toggleSearchExpanded"
          class="my-1.5"
          :class="{ 'w-full': isSearchExpanded }"
          :expanded="isSearchExpanded"
          :location="searchBarLocation"
        />
        <IconActivist
          v-if="!isSearchExpanded"
          class="absolute left-0 right-0 top-[0.3rem] m-auto flex h-8 w-6 items-center overflow-clip"
        />
        <SidebarRight>
          <div class="flex-col space-y-2">
            <DropdownCreate
              id="create"
              v-if="userIsSignedIn"
              class="w-full"
              :location="dropdownLocation"
            />
            <DropdownInfo
              id="info"
              class="w-full"
              :location="dropdownLocation"
            />
            <DropdownTheme class="w-full" :location="dropdownLocation" />
            <DropdownLanguage class="w-full" :location="dropdownLocation" />
            <DropdownUserOptions
              id="user-options"
              class="w-full"
              :location="dropdownLocation"
              :userIsSignedIn="userIsSignedIn"
            />
          </div>
        </SidebarRight>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const aboveMediumBP = useBreakpoint("md");

const dropdownLocation = DropdownLocation.SIDE_MENU;
const searchBarLocation = SearchBarLocation.HEADER;

const { userIsSignedIn } = useUser();

const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
