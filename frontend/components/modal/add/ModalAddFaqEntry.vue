<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :initial-values="formData"
      :submit-label="$t('i18n.components.modal_add_faq_entry.add_faq_entry')"
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

import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { Event } from "~/types/events/event";

const props = defineProps<{
  pageType: "organization" | "group" | "event" | "other";
}>();

const modalName = "ModalAddFaqEntry";
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

const formData = ref<FaqEntry>({
  id: "",
  iso: "en",
  order: 0,
  question: "",
  answer: "",
});

const { t } = useI18n();

const schema = z.object({
  question: z.string().min(1, t("i18n.components._global.question_required")),
  answer: z.string().min(1, t("i18n.components._global.answer_required")),
});

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

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  if (props.pageType === "organization") {
    updateResponse = await organizationStore.createFaqEntry(
      organization,
      newValues as FaqEntry
    );
  } else if (props.pageType === "group") {
    updateResponse = await groupStore.createFaqEntry(
      group,
      newValues as FaqEntry
    );
  } else if (props.pageType === "event") {
    updateResponse = await eventStore.createFaqEntry(
      event,
      newValues as FaqEntry
    );
  }

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
