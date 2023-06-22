<template>
  <div
    class="sm:hidden fixed top:0 w-full bg-light-header dark:bg-dark-header z-20"
  >
    <nav>
      <ul class="flex items-center py-2 px-6">
        <li class="flex-1">
          <SearchBar
            location="header"
            :expanded="isSearchExpanded"
            @on-search-toggle="toggleSearchExpanded"
          />
        </li>
        <li
          v-if="!isSearchExpanded"
          class="flex-1 flex justify-center"
        >
          <IconActivist
            class="flex items-center justify-center w-6 h-8 overflow-clip"
          />
        </li>
        <li class="flex-1 flex justify-end">
          <MenuMeatball />
        </li>
      </ul>
    </nav>
  </div>
</template>
<script setup lang="ts">
const isSearchExpanded = ref(false);

const toggleSearchExpanded = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};
</script>
