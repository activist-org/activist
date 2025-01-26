<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t(i18nMap.components._global.connect) }}
      </h3>
      <IconEdit
        v-if="userIsSignedIn"
        @click="openModalEditSocialLinks"
        @keydown.enter="openModalEditSocialLinks"
      />
    </div>
    <ul
      class="mt-3 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-6"
    >
      <li v-for="socLink in socialLinksRef">
        <a
          :href="socLink.link"
          class="flex cursor-pointer items-center gap-3 break-all text-primary-text transition-all hover:text-distinct-text"
        >
          <Icon
            v-if="socLink.link.includes('mastodon')"
            :name="IconMap.MASTODON"
            size="1.2em"
          />
          <Icon
            v-else-if="socLink.link.includes('facebook')"
            :name="IconMap.FACEBOOK"
            size="1.2em"
          />
          <Icon
            v-else-if="socLink.link.includes('instagram')"
            :name="IconMap.INSTAGRAM"
            size="1.2em"
          />
          <Icon v-else :name="IconMap.LINK" size="1.2em" />
          <div class="font-semibold">
            {{ socLink.label }}
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import type { Group, GroupSocialLink } from "~/types/communities/group";
import type {
  Organization,
  OrganizationSocialLink,
} from "~/types/communities/organization";
import type { SocialLink } from "~/types/content/social-link";
import type { Event, EventSocialLink } from "~/types/events/event";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  pageType: "organization" | "group" | "event" | "other";
}>();

const { openModal: openModalEditSocialLinks } = useModalHandlers(
  "ModalEditSocialLinks"
);

// TODO: Uncomment useUser() and remove userIsSignedIn = true
// const { userIsSignedIn } = useUser();
const userIsSignedIn = true;
const paramsId = useRoute().params.id;
const paramsGroupId = useRoute().params.groupId;

const id = typeof paramsId === "string" ? paramsId : undefined;
const idGroup = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const organizationStore = useOrganizationStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

let organization: Organization;
let group: Group;
let event: Event;

if (props.pageType == "organization") {
  await organizationStore.fetchById(id);
  organization = organizationStore.organization;
} else if (props.pageType == "group") {
  await groupStore.fetchById(idGroup);
  group = groupStore.group;
} else if (props.pageType == "event") {
  await eventStore.fetchById(id);
  event = eventStore.event;
}

const defaultSocialLinks: SocialLink[] = [
  {
    link: "",
    label: "",
    order: 0,
    creationDate: "",
    lastUpdated: "",
  },
];

const socialLinksRef = computed<
  | OrganizationSocialLink[]
  | GroupSocialLink[]
  | EventSocialLink[]
  | SocialLink[]
>(() => {
  if (props.pageType == "organization") {
    return organization.socialLinks;
  } else if (props.pageType == "group") {
    return group.socialLinks;
  } else if (props.pageType == "event") {
    return event.socialLinks;
  } else {
    return defaultSocialLinks;
  }
});
</script>
