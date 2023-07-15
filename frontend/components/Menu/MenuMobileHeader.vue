<template>
  <div
    class="sm:hidden fixed top-0 w-full bg-light-header dark:bg-dark-header h-12 z-20 border-b-2 border-light-section-div dark:border-dark-section-div"
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
    </nav>
  </div>
</template>

<script setup lang="ts">
const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
