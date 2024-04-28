<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
    :imageModal="true"
  >
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
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  imageURL: string;
  imageAltText: string;
  isOpen: boolean;
}>();

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};
</script>
