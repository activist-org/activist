<template>
  <footer
    class="w-full p-1 transition-all motion-reduce:transition-none duration-500 bg-light-layer-1 dark:bg-dark-layer-1"
  >
    <div
      class="flex flex-col justify-center w-full p-1 space-y-1 rounded-md bg-light-layer-2 dark:bg-dark-layer-2 elem-shadow-sm"
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
