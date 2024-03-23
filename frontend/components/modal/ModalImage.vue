<template>
  <ModalBase imageModal>
    <template #normalDisplay>
      <button
        class="focus-brand hidden h-min cursor-pointer p-4 md:float-right md:block md:w-1/3 2xl:col-span-1 2xl:w-full"
        :aria-label="$t('components.modal-image.open-modal-aria-label')"
      >
        <img
          v-if="$colorMode.value == 'light'"
          :src="imageURL + '_light.png'"
          :alt="$t(imageAltText)"
        />
        <img
          v-else-if="$colorMode.value == 'dark'"
          :src="imageURL + '_dark.png'"
          :alt="$t(imageAltText)"
        />
      </button>
    </template>
    <template #modalDisplay>
      <img
        v-if="$colorMode.value == 'light'"
        class="w-4/5 object-contain"
        :src="imageURL + '_light.png'"
        :alt="$t(imageAltText)"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="w-4/5 object-contain"
        :src="imageURL + '_dark.png'"
        :alt="$t(imageAltText)"
      />
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
defineProps<{
  imageURL: string;
  imageAltText: string;
}>();
</script>
