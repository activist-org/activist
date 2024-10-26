<template>
  <div class="mx-1 flex flex-col justify-center transition-all duration-500">
    <div
      class="elem-shadow-sm space-y-1 rounded-md bg-light-layer-2 p-1 dark:bg-dark-layer-2"
    >
      <!-- In the v-for don't select Home. -->
      <SidebarLeftSelector
        v-for="(item, index) in menuItems.slice(1, 3)"
        :key="index"
        :id="getSelectorId(item.label)"
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

const getSelectorId = (label: string) => {
  const idMap: Record<string, string> = {
    organizations: 'organizations',
    events: 'events'
  };

  const key = Object.keys(idMap).find(k => label.includes(k));
  return key ? idMap[key] : undefined;
};
</script>
