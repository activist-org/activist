<template>
  <div
    class="flex items-center gap-1 fill-light-text dark:fill-dark-text"
    v-if="iconName === 'IconOrganization' || iconName === 'IconSupport'"
  >
    <Icon
      class="mr-1"
      v-if="iconName === 'IconOrganization'"
      name="IconOrganization"
    />
    <Icon
      class="mr-1"
      v-else-if="iconName === 'IconSupport'"
      name="IconSupport"
    />
    {{ value }}
    <p v-if="label">{{ label }}</p>
  </div>
  <div class="flex items-center gap-1" v-else>
    <Icon :name="iconName" class="mr-1" size="1.25em" />
    <a
      v-if="iconName === 'bi:camera-video'"
      class="block md:hidden lg:block"
      :href="value"
    ></a>
    <p v-else class="block md:hidden lg:block">{{ value }}</p>
    <p v-if="label">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconName: string;
  value: string;
  label?: string;
}>();
</script>
