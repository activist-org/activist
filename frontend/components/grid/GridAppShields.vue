<template>
  <div class="grid w-fit grid-flow-row gap-3 sm:grid-flow-col md:gap-5">
    <ShieldApp class="fill-primary-text" href="/">
      <Icon :name="IconMap.APPLE" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div class="ml-0.5 whitespace-nowrap text-xs font-semibold leading-4">
          {{ $t("components.grid_app_shields.download_on_the") }}
        </div>
        <div class="whitespace-nowrap text-2xl font-semibold leading-4">
          {{ $t("components.grid_app_shields.app_store") }}
        </div>
      </div>
    </ShieldApp>
    <ShieldApp class="fill-primary-text" href="/">
      <Icon :name="IconMap.GOOGLE_PLAY" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div
          class="ml-0.5 whitespace-nowrap text-xs font-semibold uppercase leading-4"
        >
          {{ $t("components.grid_app_shields.get_it_on") }}
        </div>
        <div class="whitespace-nowrap text-2xl font-semibold leading-4">
          {{ $t("components.grid_app_shields.google_play") }}
        </div>
      </div>
    </ShieldApp>
    <ShieldApp class="fill-primary-text" href="/">
      <Icon :name="IconMap.F_DROID" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div
          class="ml-0.5 whitespace-nowrap text-xs font-semibold uppercase leading-4"
        >
          {{ $t("components.grid_app_shields.get_it_on") }}
        </div>
        <div class="whitespace-nowrap text-2xl font-semibold leading-4">
          {{ $t("components.grid_app_shields.f_droid") }}
        </div>
      </div>
    </ShieldApp>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
</script>
