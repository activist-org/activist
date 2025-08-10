<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :initial-values="formData"
      :submit-label="
        $t('i18n.components.modal.add.faq_entry._global.add_faq_entry')
      "
    >
      <h2>
        {{ $t("i18n._global.new_faq") }}
      </h2>
      <div class="flex flex-col space-y-7">
        <FormItem
          v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
          name="question"
          :label="$t('i18n.components._global.question')"
          :required="true"
        >
          <FormTextArea
            @input="handleChange"
            @blur="handleBlur"
            :id="id"
            :value="value.value"
            :hasError="!!errorMessage.value"
          />
        </FormItem>
        <FormItem
          v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
          name="answer"
          :label="$t('i18n.components._global.answer')"
          :required="true"
        >
          <FormTextArea
            @input="handleChange"
            @blur="handleBlur"
            :id="id"
            :value="value.value"
            :hasError="!!errorMessage.value"
          />
        </FormItem>
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { FaqEntry } from "~/types/content/faq-entry";

const modalName = "ModalAddFaqEntryOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;

const formData = ref<FaqEntry>({
  id: "",
  iso: "en",
  order: organization.faqEntries.length,
  question: "",
  answer: "",
});

const { t } = useI18n();

const schema = z.object({
  question: z.string().min(1, t("i18n.components._global.question_required")),
  answer: z.string().min(1, t("i18n.components._global.answer_required")),
});

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = await organizationStore.createFaqEntry(
    organization,
    newValues as FaqEntry
  );

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
