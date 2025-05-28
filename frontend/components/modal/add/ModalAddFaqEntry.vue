<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-primary-text">
        <label for="textarea" class="responsive-h2">{{
          $t("i18n.components.modal._global.question")
        }}</label>
        <textarea
          v-model="formData.question"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
        <label for="textarea" class="responsive-h2">{{
          $t("i18n.components.modal._global.answer")
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
        label="i18n._global.new_faq"
        fontSize="base"
        ariaLabel="i18n._global.new_faq_aria_label"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

const props = defineProps<{
  pageType: "organization" | "group" | "event";
}>();

const modalName = "ModalAddFaqEntry";
const { handleCloseModal } = useModalHandlers(modalName);

const formData = ref<FaqEntry>({
  id: "",
  iso: "en",
  order: 0,
  question: "",
  answer: "",
});

const entityType: "organization" | "group" | "event" = props.pageType;

async function handleSubmit() {
  let updateResponse = false;

  switch (entityType) {
    case "organization":
      updateResponse = await useOrganizationStore().createFaqEntry(
        formData.value
      );
      break;
    case "group":
      updateResponse = await useGroupStore().createFaqEntry(formData.value);
      break;
    case "event":
      updateResponse = await useEventStore().createFaqEntry(formData.value);
      break;
  }
  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
