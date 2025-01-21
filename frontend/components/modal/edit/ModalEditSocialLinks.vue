<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-primary-text">
        <label for="textarea" class="responsive-h2">{{
          $t(i18nMap.components.modal_edit_social_links.social_links)
        }}</label>
        <div class="flex flex-col space-y-3">
          <div
            v-for="socLink in socialLinksRef"
            class="flex items-center space-x-3"
          >
            <IconClose @click="removeLink((order = socLink.order))" />
            <input
              class="focus-brand w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              :placeholder="$t(socLink.label)"
            />
            <input
              class="focus-brand w-full rounded-md border border-section-div bg-layer-0 px-4 py-2"
              type="text"
              :placeholder="$t(socLink.link)"
            />
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
        <BtnAction
          @click="addNewLink()"
          :cta="true"
          :label="$t(i18nMap.components.modal_edit_social_links.add_link)"
          fontSize="base"
          :ariaLabel="
            $t(i18nMap.components.modal_edit_social_links.add_link_aria_label)
          "
        />
        <BtnAction
          @click="handleSubmit()"
          :cta="true"
          :label="$t(i18nMap.components.modal_edit_social_links.update_links)"
          fontSize="base"
          :ariaLabel="
            $t(
              i18nMap.components.modal_edit_social_links.update_links_aria_label
            )
          "
        />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import type {
  SocialLink,
  SocialLinkFormData,
} from "~/types/content/social-link";
import { i18nMap } from "~/types/i18n-map";

const props = defineProps<{
  pageType: "organization" | "group" | "event" | "other";
}>();

const i18n = useI18n();

const modalName = "ModalEditSocialLinks";
const { handleCloseModal } = useModalHandlers(modalName);

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

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
  await organizationStore.fetchById(id);
  organization = organizationStore.organization;
  socialLinksRef.value = organization.socialLinks;
} else if (props.pageType == "group") {
  await groupStore.fetchById(id);
  group = groupStore.group;
  socialLinksRef.value = group.socialLinks;
} else if (props.pageType == "event") {
  await eventStore.fetchById(id);
  event = eventStore.event;
  socialLinksRef.value = event.socialLinks;
} else {
  socialLinksRef.value = defaultSocialLinks;
}

function mapSocialLinksToFormData() {
  socialLinksRef.value.map((socLink) => ({
    link: (formData.value.link = socLink.link),
    label: (formData.value.label = socLink.label),
    order: (formData.value.order = socLink.order),
  }));
}

onMounted(() => {
  mapSocialLinksToFormData();
});

async function handleSubmit() {
  let updateResponse = false;
  if (props.pageType == "organization") {
    updateResponse = await organizationStore.updateSocialLinks(
      organization,
      formData.value
    );
  } else if (props.pageType == "group") {
    updateResponse = await organizationStore.updateSocialLinks(
      organization,
      formData.value
    );
  } else if (props.pageType == "event") {
    updateResponse = await organizationStore.updateSocialLinks(
      organization,
      formData.value
    );
  }
  if (updateResponse) {
    handleCloseModal();
  }
}

async function addNewLink() {
  socialLinksRef.value.push({
    link: i18n.t(i18nMap.components.modal_edit_social_links.new_link_url),
    label: i18n.t(i18nMap.components.modal_edit_social_links.new_link_label),
    order: socialLinksRef.value.length,
  });
  mapSocialLinksToFormData();
}

async function removeLink(order: number): Promise<void> {
  const filteredLinks = socialLinksRef.value.filter(
    (link) => link.order !== order
  );
  socialLinksRef.value = filteredLinks;
  mapSocialLinksToFormData();
}
</script>
