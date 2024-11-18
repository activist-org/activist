<template>
  <div class="cursor-pointer text-primary-text hover:text-distinct-text">
    <Icon :name="IconMap.EDIT" size="1.2em" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
</script>
