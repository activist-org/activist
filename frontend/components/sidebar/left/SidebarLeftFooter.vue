<template>
  <footer
    class="bg-light-layer-1 dark:bg-dark-layer-1 w-full p-1 transition-all duration-500"
  >
    <div
      class="bg-light-layer-2 dark:bg-dark-layer-2 elem-shadow-sm flex w-full flex-col justify-center space-y-1 rounded-md p-1"
    >
      <DropdownCreate
        class="w-full"
        :location="DropdownLocation.SIDELEFTMENU"
      />
      <DropdownInfo class="w-full" :location="DropdownLocation.SIDELEFTMENU" />
      <DropdownUserOptions
        class="w-full"
        :location="DropdownLocation.SIDELEFTMENU"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { DropdownLocation } from "~/types/location";
</script>
