<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :submitLabel="$t('i18n.components.modal_edit_social_links.update_links')"
      :initialValues="formData"
    >
      <div class="flex flex-col space-y-7">
        <div class="flex flex-col space-y-3">
          <h2 for="textarea">
            {{ $t("i18n.components.modal_edit_social_links.social_links") }}
          </h2>
          <div class="flex flex-col space-y-3">
            <div
              v-for="(socialLink, index) in socialLinksRef"
              :key="index"
              class="flex items-center space-x-5"
            >
              <IconClose @click="removeLink(socialLink.order)" />
              <FormItem
                v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                :name="`socialLinks.${index}.label`"
                :label="
                  $t('i18n.components.modal_edit_social_links.new_link_label')
                "
                :required="true"
              >
                <FormTextInput
                  @blur="handleBlur"
                  @update:modelValue="handleChange"
                  :id="id"
                  :hasError="!!errorMessage.value"
                  :modelValue="value.value as string"
                  :label="
                    $t('i18n.components.modal_edit_social_links.new_link_label')
                  "
                />
              </FormItem>
              <FormItem
                v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
                :name="`socialLinks.${index}.link`"
                :label="
                  $t('i18n.components.modal_edit_social_links.new_link_url')
                "
                :required="true"
              >
                <FormTextInput
                  @blur="handleBlur"
                  @update:modelValue="handleChange"
                  :id="id"
                  :hasError="!!errorMessage.value"
                  :modelValue="value.value as string"
                  :label="
                    $t('i18n.components.modal_edit_social_links.new_link_url')
                  "
                />
              </FormItem>
            </div>
          </div>
        </div>
        <div class="flex space-x-2">
          <BtnAction
            @click="addNewLink()"
            :cta="true"
            label="i18n.components.modal_edit_social_links.add_link"
            fontSize="base"
            ariaLabel="i18n.components.modal_edit_social_links.add_link_aria_label"
          />
        </div>
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { Group, GroupSocialLink } from "~/types/communities/group";
import type {
  Organization,
  OrganizationSocialLink,
} from "~/types/communities/organization";
import type { SocialLink } from "~/types/content/social-link";
import type { Event, EventSocialLink } from "~/types/events/event";

const props = defineProps<{
  pageType: "organization" | "group" | "event" | "other";
}>();

const { t } = useI18n();

const modalName = "ModalEditSocialLinks";
const { handleCloseModal } = useModalHandlers(modalName);

const schema = z.object({
  socialLinks: z.array(
    z.object({
      label: z
        .string()
        .min(1, t("i18n.components.modal_edit_social_links.label_required")),
      link: z
        .string()
        .url(t("i18n.components.modal_edit_social_links.valid_url_required")),
    })
  ),
});

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

const socialLinksRef = ref<
  | OrganizationSocialLink[]
  | GroupSocialLink[]
  | EventSocialLink[]
  | SocialLink[]
>();

const formData = computed(() => ({
  socialLinks: (socialLinksRef.value || []).map((socialLink) => ({
    label: socialLink.label,
    link: socialLink.link,
  })),
}));

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

interface SocialLinksValue {
  socialLinks: { link: string; label: string }[];
}

async function handleSubmit(values: unknown) {
  const socialLinks = socialLinksRef.value?.map((socialLink, index) => ({
    link: (values as SocialLinksValue).socialLinks[index].link,
    label: (values as SocialLinksValue).socialLinks[index].label,
    order: socialLink.order,
  }));

  let updateResponse = false;
  if (props.pageType === "organization") {
    updateResponse = await organizationStore.updateSocialLinks(
      organization,
      socialLinks as SocialLink[]
    );
  } else if (props.pageType === "group") {
    updateResponse = await groupStore.updateSocialLinks(
      group,
      socialLinks as SocialLink[]
    );
  } else if (props.pageType === "event") {
    updateResponse = await eventStore.updateSocialLinks(
      event,
      socialLinks as SocialLink[]
    );
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
  }
}
</script>
