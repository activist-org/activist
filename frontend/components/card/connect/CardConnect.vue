<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style px-5 py-5">
    <div class="flex items-center gap-5">
      <h3 class="text-left font-display">
        {{ $t("i18n.components._global.connect") }}
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
      <li v-for="socLink in socialLinks">
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
import type { GroupSocialLink } from "~/types/communities/group";
import type { OrganizationSocialLink } from "~/types/communities/organization";
import type { SocialLink } from "~/types/content/social-link";
import type { EventSocialLink } from "~/types/events/event";

import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  socialLinks:
    | SocialLink[]
    | EventSocialLink[]
    | GroupSocialLink[]
    | OrganizationSocialLink[];
  pageType: "organization" | "group" | "event";
}>();

const { openModal: openModalEditSocialLinks } = useModalHandlers(
  `ModalEditSocialLinks${props.pageType.charAt(0).toUpperCase() + props.pageType.slice(1)}`
);

const { userIsSignedIn } = useUser();
</script>
