<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Toaster :theme="$colorMode.value === 'dark' ? 'dark' : 'light'" />
  <ModalBase :modalName="modalName">
    <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <p class="responsive-h2 font-bold">
          {{ $t("components.modal_share_page.header") }}
        </p>
      </DialogTitle>
      <!-- Added suggestion note -->
      <p v-if="showSuggestions" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {{ $t("components.modal_share_page.suggested_note") }} <span class="text-xs align-super">'</span>
      </p>
      <div class="pt-6">
        <p class="responsive-h4 font-bold">
          {{ $t("components.modal_share_page.online") }}
        </p>
        <div
          class="grid w-full grid-cols-3 grid-rows-2 content-start gap-4 pt-4 lg:gap-8 lg:pt-6"
        >
          <BtnShareIcon
            type="vueSocials"
            social-component="STelegram"
            :iconName="IconMap.TELEGRAM"
            :text="$t('components.modal_share_page.telegram')"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
          >
            <span 
              v-if="showSuggestions && suggestedOptions.includes('STelegram')" 
              class="absolute -top-1 -right-1 text-xs text-blue-600 dark:text-blue-400"
            >
              '
            </span>
          </BtnShareIcon>
          <BtnShareIcon
            type="vueSocials"
            social-component="SMastodon"
            :iconName="IconMap.MASTODON"
            :text="$t('components.modal_share_page.mastodon')"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
          >
            <span 
              v-if="showSuggestions && suggestedOptions.includes('SMastodon')" 
              class="absolute -top-1 -right-1 text-xs text-blue-600 dark:text-blue-400"
            >
              '
            </span>
          </BtnShareIcon>
          <BtnShareIcon
            type="vueSocials"
            social-component="STwitter"
            :iconName="IconMap.TWITTER"
            text="@activist_org"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
          />
          <BtnShareIcon
            type="vueSocials"
            social-component="SEmail"
            :iconName="IconMap.ENVELOPE"
            text="Email"
            iconSize="1.5em"
            :share-options="shareOptions"
          >
            <span 
              v-if="showSuggestions && suggestedOptions.includes('SEmail')" 
              class="absolute -top-1 -right-1 text-xs text-blue-600 dark:text-blue-400"
            >
              '
            </span>
          </BtnShareIcon>
          <BtnShareIcon
            type="vueSocials"
            social-component="SFacebook"
            :iconName="IconMap.FACEBOOK"
            :text="$t('components.modal_share_page.facebook')"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
          />
          <BtnShareIcon
            type="redirect"
            :iconName="IconMap.SIGNAL"
            :text="$t('components.modal_share_page.signal')"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
            :urlLink="getCurrentUrl()"
            :name="getCurrentName()"
            redirect-link="https://signal.me/#p"
          >
            <span 
              v-if="showSuggestions && suggestedOptions.includes('signal')" 
              class="absolute -top-1 -right-1 text-xs text-blue-600 dark:text-blue-400"
            >
              '
            </span>
          </BtnShareIcon>
          <BtnShareIcon
            type="vueSocials"
            social-component="SFacebookMessenger"
            :iconName="IconMap.MESSENGER"
            :text="$t('components.modal_share_page.messenger')"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
          />
          <BtnShareIcon
            type="redirect"
            :iconName="IconMap.LINK"
            :text="$t('components.modal_share_page.copy_link')"
            iconSize="1.5em"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
            :urlLink="getCurrentUrl()"
            :name="getCurrentName()"
          />
        </div>
      </div>
      <div class="pt-6">
        <p class="responsive-h4 font-bold">
          {{ $t("components.modal_share_page.offline") }}
        </p>
        <div
          class="grid w-full grid-cols-3 grid-rows-1 content-start gap-4 pt-4 lg:gap-8 lg:pt-6"
        >
          <ModalQRCodeBtn
            v-if="organization"
            :organization="organization"
            type="meta-tag"
          />
          <ModalQRCodeBtn v-if="group" :group="group" type="meta-tag" />
          <ModalQRCodeBtn v-if="event" :event="event" type="meta-tag" />
          <ModalQRCodeBtn
            v-if="resource"
            :resource="resource"
            type="meta-tag"
          />
          <ModalQRCodeBtn v-if="user" :user="user" type="meta-tag" />
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "~/components/modal/ModalBase.vue";
import type { User } from "~/types/auth/user";
import type { BtnAction } from "~/types/btn-props";
import type { Resource } from "~/types/content/resource";
import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { Event } from "~/types/events/event";
import { IconMap } from "~/types/icon-map";
import { DialogTitle } from "@headlessui/vue";
import { Toaster } from "vue-sonner";

const props = defineProps<{
  cta: BtnAction["cta"];
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
  showSuggestions?: boolean; // New prop
}>();

const modalName = "ModalSharePage";

// Added array of suggested options
const suggestedOptions = ['STelegram', 'SMastodon', 'SEmail', 'signal'];

const getEntityType = () => {
  if (props.organization) {
    return setEntityInfo(props.organization);
  } else if (props.group) {
    return setEntityInfo(props.group);
  } else if (props.event) {
    return setEntityInfo(props.event);
  }
};

const setEntityInfo = (
  data: typeof props.organization | typeof props.group | typeof props.event
) => {
  if (!data) return;
  return {
    subject: `Share ${data.name}!`,
    body: `Check out ${data.name}!`,
    url: getCurrentUrl(),
    text: `Check out ${data.name}!`,
  };
};

const getCurrentName = () => {
  return props?.event?.name
    ? props?.event?.name
    : props?.organization?.name
      ? props?.organization?.name
      : "";
};

const getCurrentUrl = () => {
  if (props.organization) {
    return `${BASE_FRONTEND_URL}/organizations/${props.organization.id}`;
  } else if (props.group) {
    return `${BASE_FRONTEND_URL}/organizations/${props.group.orgId}/groups/${props.group.id}`;
  } else if (props.event) {
    return `${BASE_FRONTEND_URL}/events/${props.event.id}`;
  } else if (props.resource) {
    return props.resource.resourceUrl;
  } else if (props.user) {
    return `${BASE_FRONTEND_URL}/users/${props.user.id}`;
  }
  const url = window.location.href;
  return url.substring(0, url.lastIndexOf("/"));
};

const shareOptions = {
  url: getCurrentUrl() || `${BASE_FRONTEND_URL}`,
  text: getEntityType()?.text || "Check this out!",
  quote: getEntityType()?.text || "Check this out!",
  hashtags: ["activism", "organizing"],
  hashtag: "#activism, #organizing",
  via: "activist_org",
  mail: "",
  cc: [""],
  bcc: [""],
  subject: getEntityType()?.subject || "Share this!",
  body:
    `${getEntityType()?.body}   ${getEntityType()?.url}` || "Check this out!",
  redirectUri: "https://www.domain.com/",
  domain: "https://mas.to",
  appId: 842766727626496,
};

const useNativeBehavior = false;

const nativeBehaviorOptions = {
  onClose: () => {},
  onOpen: () => {},
  onBlock: () => {},
  onFocus: () => {},
};

const windowFeatures = {};
</script>