<template>
  <div
    class="fixed bottom-0 z-20 w-full lg:hidden bg-light-header dark:bg-dark-header"
  >
    <nav>
      <ul class="flex">
        <li class="flex-1">
          <MenuMobileSelector
            iconURL="bi:house"
            btnText="Home"
            btnURL="/home"
            :selected="isActive('/home')"
            :active="true"
          />
        </li>
        <li class="flex-1" v-for="(item, index) in menuItems" :key="index">
          <MenuMobileSelector
            :iconURL="item.iconURL"
            :btnText="item.btnText"
            :btnURL="item.btnURL"
            :selected="isActive(item.btnURL)"
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

const isActive = (btnURL: string) => {
  return isRouteActive(btnURL);
};
</script>
