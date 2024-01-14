<template>
  <div
    class="fixed bottom-0 z-20 w-full border-t md:hidden bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div"
  >
    <nav>
      <ul class="flex">
        <li v-for="(item, index) in menuItems" :key="index" class="flex-1">
          <MenuMobileSelector
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
</script>
