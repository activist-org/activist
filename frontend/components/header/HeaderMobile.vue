<template>
  <div
    class="relative top-0 z-10 w-full h-12 border-b-2 md:hidden bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div"
  >
    <nav class="h-full">
      <div class="flex justify-between h-full gap-2 px-4">
        <SearchBar
          location="header"
          :expanded="isSearchExpanded"
          @on-search-toggle="toggleSearchExpanded"
          class="my-1.5"
          :class="{ 'w-full': isSearchExpanded }"
        />
        <IconActivist
          v-if="!isSearchExpanded"
          class="flex items-center w-6 h-8 absolute top-[0.3rem] m-auto left-0 right-0 overflow-clip"
        />
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
