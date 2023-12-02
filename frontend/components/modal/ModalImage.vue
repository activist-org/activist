<template>
  <ModalBase imageModal>
    <template v-slot:normalDisplay>
      <button
        class="hidden p-4 cursor-pointer md:block md:float-right md:w-1/3 2xl:w-full 2xl:col-span-1 h-min focus-brand"
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
    <template v-slot:modalDisplay>
      <img
        v-if="$colorMode.value == 'light'"
        class="object-contain p-12"
        :src="imageURL + '_light.png'"
        :alt="$t(imageAltText)"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="object-contain p-12"
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
