<template>
  <footer
    class="px-1 pb-1 transition-all duration-500"
    :class="{
      'pr-4': sidebarContentScrollable,
    }"
  >
    <div
      class="bottom-0 h-20 w-full rounded-md bg-layer-2"
      :class="{
        'shadow-[rgba(63,63,70,0.5)_0px_0px_15px_0.75px]':
          sidebarContentScrollable,
      }"
    ></div>
    <div
      class="elem-shadow-sm -mt-20 flex w-full flex-col justify-center space-y-1 rounded-md bg-layer-2 p-1"
    >
      <DropdownCreate
        v-if="userIsSignedIn"
        id="create"
        class="w-full"
        :location="DropdownLocation.SIDE_LEFT_MENU"
      />
      <DropdownInfo
        id="info"
        class="w-full"
        :location="DropdownLocation.SIDE_LEFT_MENU"
      />
      <DropdownUserOptions
        id="user-options"
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
