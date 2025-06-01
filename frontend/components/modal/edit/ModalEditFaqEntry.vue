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
  question: props.faqEntry.question,
  answer: props.faqEntry.answer,
});

if (props.pageType == "organization") {
  await organizationStore.fetchById(orgId);
  organization = organizationStore.organization;
  console.log("organization", organization);
} else if (props.pageType == "group") {
  await groupStore.fetchById(groupId);
  group = groupStore.group;
} else if (props.pageType == "event") {
  await eventStore.fetchById(eventId);
  event = eventStore.event;
}

async function handleSubmit() {
  let updateResponse = false;
  if (props.pageType === "organization") {
    updateResponse = await organizationStore.updateFaqEntry(
      organization,
      formData.value
    );
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
