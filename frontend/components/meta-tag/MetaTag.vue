<template>
  <div
    v-if="iconName === 'IconOrganization' || iconName === 'IconSupport'"
    class="fill-light-text dark:fill-dark-text flex items-center gap-1"
  >
    <Icon
      v-if="iconName === 'IconOrganization'"
      class="mr-1"
      name="IconOrganization"
      size="1.25em"
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
    <Icon class="mr-1" :name="iconName" size="1.25em" />
    <a
      v-if="iconName === 'bi:camera-video'"
      class="block md:hidden lg:block"
      :href="value"
      >{{ value }}</a
    >
    <p v-else class="block md:hidden lg:block">
      {{ value }}
    </p>
    <p v-if="label">
      {{ $t(label) }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconName: string;
  value: string;
  label?: string;
}>();
</script>
