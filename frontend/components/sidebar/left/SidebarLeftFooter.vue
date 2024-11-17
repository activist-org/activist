<template>
  <footer
    class="p-1 transition-all duration-500"
    :class="{
      'pr-4': sidebarContentScrollable,
    }"
  >
    <div
      class="elem-shadow-sm bg-layer-2 flex w-full flex-col justify-center space-y-1 rounded-md p-1"
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

const { userIsSignedIn } = useUser();
</script>
