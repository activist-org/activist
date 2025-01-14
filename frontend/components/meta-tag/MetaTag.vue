<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="iconName === 'IconOrganization' || iconName === 'IconSupport'"
    class="flex items-center gap-1 fill-primary-text"
  >
    <Icon
      v-if="iconName === 'IconOrganization'"
      class="mr-1"
      name="IconOrganization"
      :size="iconSize ? iconSize : '1.25em'"
    />
    <Icon
      v-else-if="iconName === 'IconSupport'"
      class="mr-1"
      name="IconSupport"
    />
    {{ value }}
    <p v-if="label">
      {{ $t(label) }}
    </p>
  </div>
  <div v-else class="flex items-center gap-1">
    <Icon
      class="mr-1"
      :name="iconName"
      :size="iconSize ? iconSize : '1.25em'"
    />
    <a v-if="iconName === IconMap.VIDEO" :href="value">{{ value }}</a>
    <p v-else>
      {{ value }}
    </p>
    <p v-if="label">
      {{ $t(label) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  iconName: string;
  value: string;
  label?: string;
  iconSize?: string;
}>();
</script>
