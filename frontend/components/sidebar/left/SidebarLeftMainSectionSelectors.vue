<template>
  <div class="mx-1 flex flex-col justify-center transition-all duration-500">
    <div class="elem-shadow-sm space-y-1 rounded-md bg-layer-2 p-1">
      <!-- In the v-for don't select Home. -->
      <SidebarLeftSelector
        v-for="(item, index) in menuItems.slice(1, 3)"
        :key="index"
        :id="getSelectorId(item.label)"
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

const getSelectorId = (label: string) => {
  const idMap: Record<string, string> = {
    organizations: 'organizations',
    events: 'events'
  };

  const key = Object.keys(idMap).find(k => label.includes(k));
  return key ? idMap[key] : undefined;
};
</script>
