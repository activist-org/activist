<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-light-text dark:text-dark-text">
        <label for="textarea" class="responsive-h2">{{
          $t("_global.about")
        }}</label>
        <textarea
          v-model="formData.description"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
        />
      </div>
      <div class="flex flex-col space-y-3 text-light-text dark:text-dark-text">
        <label for="textarea" class="responsive-h2">{{
          $t("components._global.participate")
        }}</label>
        <textarea
          v-model="formData.getInvolved"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
        />
      </div>
      <div class="flex flex-col space-y-3 text-light-text dark:text-dark-text">
        <div class="flex flex-col space-y-2">
          <label for="input" class="responsive-h2">{{
            $t("components._global.offer_to_help_link")
          }}</label>
          <p>{{ $t("components.modal.edit._global.remember_https") }}</p>
          <input
            v-model="formData.getInvolvedUrl"
            id="textarea"
            class="focus-brand elem-shadow-sm min-h-12 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
          />
        </div>
      </div>
      <BtnAction
        @click="handleSubmit()"
        :cta="true"
        :label="$t('components.modal.edit._global.update_texts')"
        fontSize="base"
        :ariaLabel="$t('components.modal.edit._global.update_texts_aria_label')"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
}>();

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(id);

const { event } = eventStore;

const formData = ref({
  description: event.description,
  getInvolved: event.getInvolved,
  getInvolvedUrl: event.getInvolvedUrl,
});

async function handleSubmit() {
  const response = await putWithToken(
    `/events/event_texts/${event.id}/`,
    formData
  );

  if (response) {
    console.log("Success!");
  }
}

const modals = useModals();
const modalName = "ModalEditAboutEvent";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>
