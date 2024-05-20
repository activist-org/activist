<template>
  <div
    class="cursor-pointer text-light-text hover:text-light-distinct-text dark:text-dark-text dark:hover:text-dark-distinct-text"
  >
    <Icon :name="IconMap.EDIT" size="1.2em" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
</script>
