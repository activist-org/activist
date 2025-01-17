<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style-base border border-action-red bg-action-red/30 px-5 py-5 text-primary-text dark:bg-action-red/20"
  >
    <div class="flex flex-col gap-5">
      <h3 class="responsive-h3 text-left font-display font-bold">
        {{ $t(i18nMap.components.card_danger_zone.header) }}
      </h3>
      <p>{{ description }}</p>
      <form method="post">
        <div
          class="grid grid-cols-1 justify-between gap-4 sm:grid-cols-2 sm:gap-8"
        >
          <div class="flex flex-col gap-2">
            <label
              class="responsive-h4 font-bold text-primary-text"
              for="username"
              :placeholder="
                $t(i18nMap.components.card_danger_zone.username_placeholder)
              "
            >
              {{ $t(i18nMap.components.card_danger_zone.username_label) }} *
            </label>
            <input
              id="username"
              class="rounded-md border border-primary-text bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary-text"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="responsive-h4 font-bold text-primary-text"
              for="password"
              :placeholder="$t(i18nMap._global.enter_password)"
            >
              {{ $t(i18nMap.components.card_danger_zone.password_label) }} *
            </label>
            <input
              id="password"
              class="rounded-md border border-primary-text bg-transparent px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary-text"
              type="password"
            />
          </div>
        </div>
        <div class="mt-5">
          <button
            class="w-auto rounded-md bg-primary-text px-3 py-2 text-layer-1 hover:bg-action-red"
            type="button"
            :aria-label="ctaBtnAriaLabel"
          >
            {{ ctaBtnText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from '~/types/i18n-map';

defineProps<{
  description: string;
  ctaBtnText: string;
  ctaBtnAriaLabel: string;
}>();
</script>
