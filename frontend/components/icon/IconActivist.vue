<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink class="focus-brand" :to="localePath('/')">
    <svg
      class="transition duration-100"
      :class="{
        'fill-primary-text hover:fill-distinct-text': !color,
        '{{color}}': color,
      }"
      width="503"
      height="647"
      viewBox="0 0 503 647"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M116.208 396.836C116.208 469.308 174.947 528.049 247.418 528.049C283.639 528.049 316.456 513.371 340.189 489.608L154.647 304.063C130.915 327.796 116.208 360.614 116.208 396.836ZM430.237 158.409H503.24V635.233H430.237C419.406 635.233 410.41 627.124 410.41 616.294V582.884C366.881 621.058 309.887 644.229 247.448 644.229C110.763 644.259 0 533.464 0 396.836C0 260.207 110.763 149.413 247.418 149.413C309.857 149.413 366.851 172.584 410.381 210.758V177.348C410.381 166.517 419.406 158.409 430.207 158.409H430.237ZM411.92 396.836C411.92 305.987 338.265 232.331 247.418 232.331C156.571 232.331 82.9166 305.987 82.9166 396.836C82.9166 487.685 156.571 561.34 247.418 561.34C338.265 561.34 411.92 487.685 411.92 396.836Z"
      />
    </svg>
    <span class="sr-only">{{
      $t("components._global.navigate_to_start")
    }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

defineProps<{
  color?: string;
}>();
</script>
