<template>
  <header
    ref="header"
    class="relative sticky top-0 z-10 w-full h-12 md:hidden duration-500 drop-shadow-md bg-light-header dark:bg-dark-header"
  >
    <div class="h-full">
      <div class="flex justify-between h-full px-4 gap-2">
        <SearchBar
          @on-search-toggle="toggleSearchExpanded"
          class="my-1.5"
          :class="{ 'w-full': isSearchExpanded }"
          location="header"
          :expanded="isSearchExpanded"
        />
        <IconActivist
          v-if="!isSearchExpanded"
          class="flex items-center w-6 h-8 absolute top-[0.3rem] m-auto left-0 right-0 overflow-clip"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
