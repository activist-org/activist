<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="mx-1 flex flex-col justify-center transition-all duration-500">
    <div class="space-y-1 rounded-md bg-layer-2 p-1 elem-shadow-sm">
      <!-- In the v-for don't select Home. -->
      <SidebarLeftSelector
        :id="getSelectorId(item.label)"
        v-for="(item, index) in menuItems.slice(1, 3)"
        :key="index"
        :active="true"
        :iconUrl="item.iconUrl"
        :label="item.label"
        :routeUrl="item.routeUrl"
        :selected="isActive(item.routeUrl)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const isActive = (routeUrl: string) => {
  return isTopLevelRouteActive(routeUrl);
};

const getSelectorId = (label: string) => {
  const idMap: Record<string, string> = {
    organizations: "organizations",
    events: "events",
  };

  const key = Object.keys(idMap).find((k) => label.includes(k));
  return key ? idMap[key] : undefined;
};
</script>
