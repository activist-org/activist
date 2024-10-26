<template>
  <div
    class="fixed bottom-0 z-20 w-full border-t border-light-section-div bg-light-layer-2 dark:border-dark-section-div dark:bg-dark-layer-2"
  >
    <nav>
      <ul class="flex">
        <li v-for="(item, index) in menuItems" :key="index" class="flex-1">
          <MenuMobileSelector
            :id="getSelectorId(item.label)"
            class="rounded-none"
            :label="item.label"
            :routeURL="item.routeURL"
            :iconURL="item.iconURL"
            :selected="isActive(item.routeURL)"
            :active="true"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const isActive = (routeURL: string) => {
  return isRouteActive(routeURL);
};

const getSelectorId = (label: string) => {
  const idMap: Record<string, string> = {
    home: 'home',
    events: 'events',
    organizations: 'organizations',
  };

  const key = Object.keys(idMap).find(k => label.includes(k));
  return key ? idMap[key] : undefined;
};
</script>
