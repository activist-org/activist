<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="fixed bottom-0 z-20 w-full border-t border-section-div bg-layer-2"
  >
    <nav>
      <ul class="flex">
        <li v-for="(item, index) in menuItems" :key="index" class="flex-1">
          <MenuMobileSelector
            :id="getSelectorId(item.label)"
            :active="true"
            class="rounded-none"
            :iconUrl="item.iconUrl"
            :label="item.label"
            :routeUrl="item.routeUrl"
            :selected="isActive(item.routeUrl)"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const isActive = (routeUrl: string) => {
  return isTopLevelRouteActive(routeUrl);
};

const getSelectorId = (label: string) => {
  const idMap: Record<string, string> = {
    home: "home",
    events: "events",
    organizations: "organizations",
  };

  const key = Object.keys(idMap).find((k) => label.includes(k));
  return key ? idMap[key] : undefined;
};
</script>
