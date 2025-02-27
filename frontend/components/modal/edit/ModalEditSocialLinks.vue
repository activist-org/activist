<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-primary-text">
        <label for="textarea" class="responsive-h2">{{
          $t("i18n.components.modal_edit_social_links.social_links")
        }}</label>
        <div class="flex flex-col space-y-3">
          <div
            v-for="(socLink, index) in socialLinksRef"
            :key="index"
            class="flex items-center space-x-3"
          >
            <IconClose @click="removeLink(socLink.order)" />
            <!-- Bind to 'socLink.label' -->
            <input
              v-model="socLink.label"
              class="focus-brand w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              :placeholder="
                i18n.t('i18n.components.modal_edit_social_links.new_link_url')
              "
            />
            <!-- Bind to 'socLink.link' -->
            <input
              v-model="socLink.link"
              class="focus-brand w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              :placeholder="
                i18n.t('i18n.components.modal_edit_social_links.new_link_label')
              "
            />
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <BtnAction
          @click="addNewLink()"
          :cta="true"
          :label="$t('i18n.components.modal_edit_social_links.add_link')"
          fontSize="base"
          :ariaLabel="
            $t('i18n.components.modal_edit_social_links.add_link_aria_label')
          "
        />
        <BtnAction
          @click="handleSubmit()"
          :cta="true"
          :label="$t('i18n.components.modal_edit_social_links.update_links')"
          fontSize="base"
          :ariaLabel="
            $t(
              'i18n.components.modal_edit_social_links.update_links_aria_label'
            )
          "
        />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import type { Group, GroupSocialLink } from "~/types/communities/group";
import type {
  Organization,
  OrganizationSocialLink,
} from "~/types/communities/organization";
import type {
  SocialLink,
  SocialLinkFormData,
} from "~/types/content/social-link";
import type { Event, EventSocialLink } from "~/types/events/event";

const props = defineProps<{
  pageType: "organization" | "group" | "event" | "other";
}>();

const i18n = useI18n();

const modalName = "ModalEditSocialLinks";
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

const defaultSocialLinks: SocialLink[] = [
  {
    link: "",
    label: "",
    order: 0,
    creationDate: "",
    lastUpdated: "",
  },
];

const formData = ref<SocialLinkFormData[]>([
  {
    link: "",
    label: "",
    order: 0,
  },
]);

const socialLinksRef = ref<
  | OrganizationSocialLink[]
  | GroupSocialLink[]
  | EventSocialLink[]
  | SocialLink[]
>();

if (props.pageType == "organization") {
  await organizationStore.fetchById(orgId);
  organization = organizationStore.organization;
  socialLinksRef.value = organization.socialLinks;
} else if (props.pageType == "group") {
  await groupStore.fetchById(groupId);
  group = groupStore.group;
  socialLinksRef.value = group.socialLinks;
} else if (props.pageType == "event") {
  await eventStore.fetchById(eventId);
  event = eventStore.event;
  socialLinksRef.value = event.socialLinks;
} else {
  socialLinksRef.value = defaultSocialLinks;
}

function mapSocialLinksToFormData() {
  formData.value =
    socialLinksRef.value
      ?.filter(
        (socLink) => socLink.link?.trim() !== "" && socLink.label?.trim() !== ""
      )
      ?.map((socLink) => ({
        link: socLink.link,
        label: socLink.label,
        order: socLink.order,
      })) || [];
}

onMounted(() => {
  mapSocialLinksToFormData();
});

async function handleSubmit() {
  // Sync formData with socialLinksRef.
  mapSocialLinksToFormData();

  let updateResponse = false;
  if (props.pageType === "organization") {
    updateResponse = await organizationStore.updateSocialLinks(
      organization,
      formData.value
    );
  } else if (props.pageType === "group") {
    updateResponse = await groupStore.updateSocialLinks(group, formData.value);
  } else if (props.pageType === "event") {
    updateResponse = await eventStore.updateSocialLinks(event, formData.value);
  }

  if (updateResponse) {
    handleCloseModal();
  }
}

async function addNewLink() {
  socialLinksRef.value?.push({
    link: "",
    label: "",
    order: socialLinksRef.value.length,
  } as OrganizationSocialLink & GroupSocialLink & EventSocialLink & SocialLink);
}

async function removeLink(order: number): Promise<void> {
  const indexToRemove = socialLinksRef.value?.findIndex(
    (link) => link.order === order
  );

  if (indexToRemove !== undefined && indexToRemove >= 0) {
    // Remove the item directly from the array.
    // This will mutate the original array and signal a reactivity update.
    socialLinksRef.value?.splice(indexToRemove, 1);

    // Re-index the remaining items to ensure the 'order' field is correct.
    socialLinksRef.value?.forEach((link, index) => {
      link.order = index;
    });

    // After removing, we can trigger the map update to sync formData.
    mapSocialLinksToFormData();
  }
}
</script>
