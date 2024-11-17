<template>
  <div class="mx-1 flex flex-col justify-center transition-all duration-500">
    <div class="elem-shadow-sm bg-layer-2 space-y-1 rounded-md p-1">
      <!-- In the v-for don't select Home. -->
      <SidebarLeftSelector
        v-for="(item, index) in menuItems.slice(1, 3)"
        :key="index"
        :label="item.label"
        :routeUrl="item.routeUrl"
        :iconUrl="item.iconUrl"
        :selected="isActive(item.routeUrl)"
        :active="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const isActive = (routeUrl: string) => {
  return isRouteActive(routeUrl);
};
</script>
