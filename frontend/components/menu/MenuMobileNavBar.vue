<template>
  <div
    class="fixed bottom-0 z-20 w-full md:hidden bg-light-header dark:bg-dark-header"
  >
    <nav>
      <ul class="flex">
        <li class="flex-1" v-for="(item, index) in menuItems" :key="index">
          <MenuMobileSelector
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
import { menuItems } from "@/utils/navMenuItems";
import { isRouteActive } from "@/utils/routeUtils";

const isActive = (routeURL: string) => {
  return isRouteActive(routeURL);
};
</script>
