<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-primary-text">
        <label for="textarea" class="responsive-h2">{{
          $t(i18nMap._global.about)
        }}</label>
        <textarea
          v-model="formData.description"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
      </div>
      <div class="flex flex-col space-y-3 text-primary-text">
        <label for="textarea" class="responsive-h2">{{
          $t(i18nMap.components._global.participate)
        }}</label>
        <textarea
          v-model="formData.getInvolved"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
      </div>
      <div class="flex flex-col space-y-3 text-primary-text">
        <div class="flex flex-col space-y-2">
          <label for="input" class="responsive-h2">{{
            $t(i18nMap.components._global.offer_to_help_link)
          }}</label>
          <p>{{ $t(i18nMap.components.modal.edit._global.remember_https) }}</p>
          <input
            v-model="formData.getInvolvedUrl"
            id="textarea"
            class="focus-brand elem-shadow-sm min-h-12 rounded-md bg-layer-2 px-3 py-2"
          />
        </div>
      </div>
      <BtnAction
        @click="handleSubmit()"
        :cta="true"
        :label="$t(i18nMap.components.modal.edit._global.update_texts)"
        fontSize="base"
        :ariaLabel="
          $t(i18nMap.components.modal.edit._global.update_texts_aria_label)
        "
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import type { EventUpdateTextFormData } from "~/types/events/event";
import { i18nMap } from "~/types/i18n-map";

const modalName = "ModalEditTextEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(id);

const { event } = eventStore;

const formData = ref<EventUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = event.texts.description;
  formData.value.getInvolved = event.texts.getInvolved;
  formData.value.getInvolvedUrl = event.getInvolvedUrl;
});

async function handleSubmit() {
  const response = await eventStore.updateTexts(event, formData.value);
  if (response) {
    handleCloseModal();
  }
}
</script>
