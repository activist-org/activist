<template>
  <footer
    class="p-1 transition-all duration-500"
    :class="{
      'pr-4': sidebarContentScrollable,
      'shadow-sm shadow-zinc-700': contentIsScrollable,
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
  contentIsScrollable: boolean;
}>();

const { userIsSignedIn } = useUser();
</script>
