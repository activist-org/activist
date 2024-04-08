<template>
  <footer
    class="w-full bg-light-layer-1 p-1 transition-all duration-500 dark:bg-dark-layer-1"
  >
    <div
      class="elem-shadow-sm flex w-full flex-col justify-center space-y-1 rounded-md bg-light-layer-2 p-1 dark:bg-dark-layer-2"
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
