<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <div class="flex flex-col space-y-7">
      <div
        v-for="(s, i) in sectionsToEdit"
        :key="i"
        class="flex flex-col space-y-3 text-light-text dark:text-dark-text"
      >
        <label for="textarea" class="responsive-h2">{{ s }}</label>
        <textarea
          v-model="editedTexts[i]"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
        />
      </div>
      <BtnAction
        @click="true"
        :cta="true"
        :label="$t('components.modal-edit-page-text.update-texts')"
        fontSize="base"
        :ariaLabel="
          $t('components.modal-edit-page-text.update-texts-aria-label')
        "
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  sectionsToEdit: string[];
  textsToEdit: string[];
  isOpen: boolean;
}>();

const editedTexts = computed(() => props.textsToEdit);

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};
</script>
