<template>
  <div class="flex flex-col justify-center mx-1 transition-all duration-500">
    <div class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header">
      <SidebarLeftSelector
        v-for="(item, index) in menuItems"
        :key="index"
        :iconURL="item.iconURL"
        :btnText="item.btnText"
        :btnURL="item.btnURL"
        :selected="isActive(item.btnURL)"
        :active="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { menuItems } from "@/utils/navMenuItems";
import { isRouteActive } from "@/utils/routeUtils";

const isActive = (btnURL: string) => {
  return isRouteActive(btnURL);
};
</script>
