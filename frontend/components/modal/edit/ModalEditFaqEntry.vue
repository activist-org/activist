<template>
  <ModalBase :modalName="modalName">
    <Form
      :schema="schema"
      @submit="onSubmit"
      submit-label="i18n.components.modal.edit._global.update_texts"
    >
      <div class="flex flex-col space-y-7">
        <FormItem name="question" :label="$t('i18n.components.modal_edit_faq_entry.question')" :required="true">
          <FormTextArea v-model="formData.question" />
        </FormItem>
        <FormItem name="answer" :label="$t('i18n.components.modal_edit_faq_entry.answer')" :required="true">
          <FormTextArea v-model="formData.answer" />
        </FormItem>
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { z } from 'zod';
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

const formData = ref<FaqEntry>({
  id: props.faqEntry.id,
  iso: props.faqEntry.iso,
  order: props.faqEntry.order,
  question: '',
  answer: '',
});

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
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

function onSubmit(values: { question: string; answer: string }) {
  handleSubmit(values);
}

async function handleSubmit(values: { question: string; answer: string }) {
  let updateResponse = false;
  formData.value.question = values.question;
  formData.value.answer = values.answer;
  if (props.pageType === "organization") {
    updateResponse = await organizationStore.updateFaqEntry(organization, formData.value);
  } else if (props.pageType === "group") {
    updateResponse = await groupStore.updateFaqEntry(group, formData.value);
  } else if (props.pageType === "event") {
    updateResponse = await eventStore.updateFaqEntry(event, formData.value);
  }

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
