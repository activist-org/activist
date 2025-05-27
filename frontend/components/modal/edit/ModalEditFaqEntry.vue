<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-primary-text">
        <label for="textarea" class="responsive-h2">{{
          $t("i18n.components.modal_edit_faq_entry.question")
        }}</label>
        <textarea
          v-model="formData.question"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
        <label for="textarea" class="responsive-h2">{{
          $t("i18n.components.modal_edit_faq_entry.answer")
        }}</label>
        <textarea
          v-model="formData.answer"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
      </div>
      <BtnAction
        @click="handleSubmit"
        :cta="true"
        label="i18n.components.modal.edit._global.update_texts"
        fontSize="base"
        ariaLabel="i18n.components.modal.edit._global.update_texts_aria_label"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

import { useFaqEntryStore } from "~/stores/content";

const props = defineProps<{
  faqEntry: FaqEntry;
  pageType: "organization" | "group" | "event";
}>();

const modalName = "ModalEditFaqEntry" + props.faqEntry.id;
const { handleCloseModal } = useModalHandlers(modalName);

const formData = ref<FaqEntry>({
  id: props.faqEntry.id,
  iso: props.faqEntry.iso,
  order: props.faqEntry.order,
  question: props.faqEntry.question,
  answer: props.faqEntry.answer,
});

const faqEntryStore = useFaqEntryStore();
const entityType: "organization" | "group" | "event" = props.pageType;
let paramsEntityId: string | string[];

switch (entityType) {
  case "organization":
    paramsEntityId = useRoute().params.orgId;
    break;
  case "group":
    paramsEntityId = useRoute().params.groupId;
    break;
  case "event":
    paramsEntityId = useRoute().params.eventId;
    break;
}
const entityId =
  typeof paramsEntityId === "string" ? paramsEntityId : undefined;

async function handleSubmit() {
  let updateResponse = false;

  if (entityId) {
    updateResponse = await faqEntryStore.update(
      entityType,
      entityId,
      formData.value
    );
  }

  if (updateResponse) {
    switch (entityType) {
      case "organization":
        useOrganizationStore().fetchById(entityId);
        break;
      case "group":
        useGroupStore().fetchById(entityId);
        break;
      case "event":
        useEventStore().fetchById(entityId);
        break;
    }

    handleCloseModal();
  }
}
</script>
