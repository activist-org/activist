<template>
  <div class="mx-1 flex flex-col justify-center transition-all duration-500">
    <div
      class="elem-shadow-sm space-y-1 rounded-md bg-light-layer-2 p-1 dark:bg-dark-layer-2"
    >
      <!-- In the v-for don't select Home. -->
      <SidebarLeftSelector
        v-for="(item, index) in menuItems.slice(1, 3)"
        :key="index"
        :label="item.label"
        :routeURL="item.routeURL"
        :iconURL="item.iconURL"
        :selected="isActive(item.routeURL)"
        :active="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const isActive = (routeURL: string) => {
  return isRouteActive(routeURL);
};
</script>
