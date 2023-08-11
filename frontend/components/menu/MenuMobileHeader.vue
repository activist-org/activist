<template>
  <div
    class="fixed top-0 z-20 w-full h-12 border-b-2 sm:hidden bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div">
    <nav class="h-full">
      <div class="h-full flex justify-between gap-2 px-4">
        <SearchBar location="header" :expanded="isSearchExpanded" @on-search-toggle="toggleSearchExpanded"
          class="my-1.5" :class="{ 'w-full': isSearchExpanded }" />
        <IconActivist v-if="!isSearchExpanded"
          class="flex items-center w-6 h-8 absolute top-[0.3rem] m-auto left-0 right-0 overflow-clip" />

        <SidebarRight>
          <div class="flex-col space-y-2">
            <SelectorTheme location="sideMenu" class="w-full" />
            <SelectorLanguage location="sideMenu" class="w-full" />
          </div>
        </SidebarRight>

      </div>

    </nav>
  </div>
</template>

<script setup lang="ts">
const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
