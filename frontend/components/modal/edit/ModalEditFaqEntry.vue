<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div
        v-for="(s, i) in sectionsToEdit"
        :key="i"
        class="flex flex-col space-y-3 text-primary-text"
      >
        <label for="textarea" class="responsive-h2">{{ s }}</label>
        <textarea
          v-if="
            s !==
              $t('i18n.components.modal.edit._global.join_organization_link') &&
            s !== $t('i18n.components.modal.edit._global.join_group_link') &&
            s !== $t('i18n.components.modal.edit._global.offer_to_help_link')
          "
          v-model="translatedTexts[i]"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
        <div v-else class="flex flex-col space-y-2">
          <p>{{ $t("i18n.components.modal.edit._global.remember_https") }}</p>
          <input
            v-model="editedTexts[i]"
            id="textarea"
            class="focus-brand elem-shadow-sm min-h-12 rounded-md bg-layer-2 px-3 py-2"
          />
        </div>
      </div>
      <BtnAction
        @click="true"
        :cta="true"
        label="i18n.components.modal.edit._global.update_texts"
        fontSize="base"
        ariaLabel="i18n.components.modal.edit._global.update_texts_aria_label"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import type { Group, GroupFaqEntry } from "~/types/communities/group";
import type {
  Organization,
  OrganizationFaqEntry,
} from "~/types/communities/organization";
import type { FaqEntry } from "~/types/content/faq-entry";

const props = defineProps<{
  name?: string;
  faqEntry: FaqEntry;
  sectionsToEdit: string[];
  textsToEdit: string[];
  pageType: "organization" | "group" | "event" | "other";
}>();

const i18n = useI18n();
const editedTexts = computed(() => props.textsToEdit);

const translatedTexts = computed(() => {
  return editedTexts.value.map((text) => {
    if (
      text === "i18n.components._global.working_groups_subtext" ||
      text === "i18n.components._global.join_organization_subtext" ||
      text === "i18n.components._global.join_group_subtext" ||
      text === "i18n.components._global.participate_subtext"
    ) {
      return i18n.t(text, { entity_name: props.name }) + ".";
    }
    return text;
  });
});

const modalName = "ModalEditFaqEntry";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const paramsGroupId = useRoute().params.groupId;
// const paramsEventId = useRoute().params.eventId;

const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;
// const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const organizationStore = useOrganizationStore();
const groupStore = useGroupStore();
// const eventStore = useEventStore();

let organization: Organization;
let group: Group;
// let event: Event;

const defaultFaqEntries: FaqEntry[] = [
  {
    id: "",
    answer: "",
    question: "",
  },
];

const formData = ref<FaqEntry[]>([
  {
    id: "",
    answer: "",
    question: "",
  },
]);

const faqEntriesRef = ref<
  OrganizationFaqEntry[] | GroupFaqEntry[] | FaqEntry[]
  // OrganizationFaqEntry[] | GroupFaqEntry[] | EventFaqEntry[] | FaqEntry[]
>();

if (props.pageType == "organization") {
  await organizationStore.fetchById(orgId);
  organization = organizationStore.organization;
  faqEntriesRef.value = organization.faqEntries;
  console.log("organization", organization);
} else if (props.pageType == "group") {
  await groupStore.fetchById(groupId);
  group = groupStore.group;
  faqEntriesRef.value = group.faqEntries;
}
// else if (props.pageType == "event") {
//   await eventStore.fetchById(eventId);
//   event = eventStore.event;
//   faqEntriesRef.value = event.faqEntries;
// }
else {
  faqEntriesRef.value = defaultFaqEntries;
}

function mapFaqEntriesToFormData() {
  formData.value =
    faqEntriesRef.value
      ?.filter(
        (faq) => faq.answer?.trim() !== "" && faq.question?.trim() !== ""
      )
      ?.map((faq) => ({
        id: faq.id,
        answer: faq.answer,
        question: faq.question,
      })) || [];
}

onMounted(() => {
  mapFaqEntriesToFormData();
});

async function handleSubmit() {
  // Sync formData with faqEntriesRef.
  mapFaqEntriesToFormData();

  let updateResponse = false;
  if (props.pageType === "organization") {
    updateResponse = await organizationStore.updateFaqEntries(
      organization,
      formData.value
    );
  } else if (props.pageType === "group") {
    updateResponse = await groupStore.updateFaqEntries(group, formData.value);
  }
  // else if (props.pageType === "event") {
  //   updateResponse = await eventStore.updateFaqEntries(event, formData.value);
  // }

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
