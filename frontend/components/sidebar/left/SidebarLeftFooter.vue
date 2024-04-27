<template>
  <footer
    class="w-full bg-light-layer-1 p-1 transition-all duration-500 dark:bg-dark-layer-1"
    :class="{
      'pr-4': sidebarContentScrollable,
    }"
  >
    <div
      class="elem-shadow-sm flex w-full flex-col justify-center space-y-1 rounded-md bg-light-layer-2 p-1 dark:bg-dark-layer-2"
    >
      <DropdownCreate
        v-if="userIsSignedIn"
        class="w-full"
        :location="DropdownLocation.SIDE_LEFT_MENU"
      />
      <DropdownInfo
        class="w-full"
        :location="DropdownLocation.SIDE_LEFT_MENU"
      />
      <DropdownUserOptions
        class="w-full"
        :location="DropdownLocation.SIDE_LEFT_MENU"
        :userIsSignedIn="userIsSignedIn"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { DropdownLocation } from "~/types/location";

defineProps<{
  sidebarContentScrollable: boolean;
}>();

const userIsSignedIn = false;
</script>
