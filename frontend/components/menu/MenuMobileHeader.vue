<template>
  <div
    class="fixed top-0 z-20 w-full h-12 border-b-2 md:hidden bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div"
  >
    <nav>
      <div class="relative">
        <SearchBar
          location="header"
          :expanded="isSearchExpanded"
          @on-search-toggle="toggleSearchExpanded"
          class="absolute left-4 top-2"
          :class="{ 'w-5/6': isSearchExpanded }"
        />
        <IconActivist
          v-if="!isSearchExpanded"
          class="flex items-center w-6 h-8 absolute top-[0.3rem] m-auto left-0 right-0 overflow-clip"
        />
      </div>
      <SidebarRight>
        <div class="flex-col space-y-2">
          <SelectorTheme location="sideMenu" class="w-full" />
          <SelectorLanguage location="sideMenu" class="w-full" />
        </div>
      </SidebarRight>
    </nav>
  </div>
</template>

<script setup lang="ts">
const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
