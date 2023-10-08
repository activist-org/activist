<template>
  <div
    v-if="iconName === 'iconorganization' || iconName === 'iconsupport'"
    class="flex items-center gap-1 fill-light-text dark:fill-dark-text"
  >
    <icon
      v-if="iconName === 'iconorganization'"
      class="mr-1"
      name="iconorganization"
    />
    <icon
      v-else-if="iconName === 'iconsupport'"
      class="mr-1"
      name="iconsupport"
    />
    {{ value }}
    <p v-if="label">
      {{ $t(label) }}
    </p>
  </div>
  <div v-else class="flex items-center gap-1">
    <icon class="mr-1" :name="iconName" size="1.25em" />
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
