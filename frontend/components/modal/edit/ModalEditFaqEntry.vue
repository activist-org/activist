<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :initial-values="formData"
      :submit-label="$t('i18n.components.modal.edit._global.update_texts')"
    >
      <h2>
        {{ $t("i18n.components.modal_edit_faq_entry.edit_entry") }}
      </h2>
      <div class="flex flex-col space-y-7">
        <FormItem
          v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
          name="question"
          :label="$t('i18n.components.modal_edit_faq_entry.question')"
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
          :label="$t('i18n.components.modal_edit_faq_entry.answer')"
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
import { onMounted, ref } from "vue";
import { z } from "zod";

import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { Event } from "~/types/events/event";

const props = defineProps<{
  faqEntry: FaqEntry;
  pageType: "organization" | "group" | "event" | "other";
}>();

const modalName = "ModalEditFaqEntry" + props.faqEntry.id;
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const paramsGroupId = useRoute().params.groupId;
const paramsEventId = useRoute().params.eventId;

const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const organizationStore = useOrganizationStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

let organization: Organization;
let group: Group;
let event: Event;

const { t } = useI18n();

const formData = ref<FaqEntry>({
  id: props.faqEntry.id,
  iso: props.faqEntry.iso,
  order: props.faqEntry.order,
  question: "",
  answer: "",
});

const schema = z.object({
  question: z
    .string()
    .min(1, t("i18n.components.modal_edit_faq_entry.question_required")),
  answer: z
    .string()
    .min(1, t("i18n.components.modal_edit_faq_entry.answer_required")),
});

onMounted(async () => {
  formData.value.question = props.faqEntry.question;
  formData.value.answer = props.faqEntry.answer;
  if (props.pageType == "organization") {
    await organizationStore.fetchById(orgId);
    organization = organizationStore.organization;
  } else if (props.pageType == "group") {
    await groupStore.fetchById(groupId);
    group = groupStore.group;
  } else if (props.pageType == "event") {
    await eventStore.fetchById(eventId);
    event = eventStore.event;
  }
});

async function handleSubmit(values: unknown) {
  let updateResponse = false;

  if (props.pageType === "organization") {
    updateResponse = await organizationStore.updateFaqEntry(
      organization,
      values as FaqEntry
    );
  } else if (props.pageType === "group") {
    updateResponse = await groupStore.updateFaqEntry(group, values as FaqEntry);
  } else if (props.pageType === "event") {
    updateResponse = await eventStore.updateFaqEntry(event, values as FaqEntry);
  }

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
