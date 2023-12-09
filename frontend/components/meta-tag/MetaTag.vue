<template>
  <div
    v-if="iconName === 'IconOrganization' || iconName === 'IconSupport'"
    class="flex items-center gap-1 fill-light-text dark:fill-dark-text"
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
    ></a>
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
