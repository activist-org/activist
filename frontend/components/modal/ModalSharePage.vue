<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <p class="responsive-h2 font-bold">
          {{ $t("components.modal-share-page.header") }}
        </p>
      </DialogTitle>
      <div class="pt-6">
        <p class="responsive-h4 font-bold">
          {{ $t("components.modal-share-page.online") }}
        </p>
        <div
          class="grid w-full grid-cols-3 grid-rows-2 content-start gap-4 pt-4 lg:gap-8 lg:pt-6"
        >
          <s-telegram
            @popup-close="nativeBehaviorOptions.onClose"
            @popup-open="nativeBehaviorOptions.onOpen"
            @popup-block="nativeBehaviorOptions.onBlock"
            @popup-focus="nativeBehaviorOptions.onFocus"
            class="focus-brand"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
            :native-behavior-options="nativeBehaviorOptions"
          >
            <MetaTagSocialMedia
              class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
              iconName="simple-icons:telegram"
              :text="$t('components.meta-social-media-tag.telegram')"
              iconSize="1.5em"
            />
          </s-telegram>
          <s-mastodon
            @popup-close="nativeBehaviorOptions.onClose"
            @popup-open="nativeBehaviorOptions.onOpen"
            @popup-block="nativeBehaviorOptions.onBlock"
            @popup-focus="nativeBehaviorOptions.onFocus"
            class="focus-brand"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
          >
            <MetaTagSocialMedia
              class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
              iconName="simple-icons:mastodon"
              :text="$t('components.meta-social-media-tag.mastodon')"
              iconSize="1.5em"
            />
          </s-mastodon>
          <s-twitter
            @popup-close="nativeBehaviorOptions.onClose"
            @popup-open="nativeBehaviorOptions.onOpen"
            @popup-block="nativeBehaviorOptions.onBlock"
            @popup-focus="nativeBehaviorOptions.onFocus"
            class="focus-brand"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
          >
            <MetaTagSocialMedia
              class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
              iconName="simple-icons:twitter"
              text="@activist_org"
              iconSize="1.5em"
            />
          </s-twitter>
          <s-email class="focus-brand" :share-options="shareOptions">
            <MetaTagSocialMedia
              class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
              iconName="bi:envelope"
              text="Email"
              iconSize="1.5em"
            />
          </s-email>
          <s-facebook
            @popup-close="nativeBehaviorOptions.onClose"
            @popup-open="nativeBehaviorOptions.onOpen"
            @popup-block="nativeBehaviorOptions.onBlock"
            @popup-focus="nativeBehaviorOptions.onFocus"
            class="focus-brand"
            :window-features="windowFeatures"
            :share-options="shareOptions"
            :use-native-behavior="useNativeBehavior"
          >
            <MetaTagSocialMedia
              class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
              iconName="simple-icons:facebook"
              :text="$t('components.meta-social-media-tag.facebook')"
              iconSize="1.5em"
            />
          </s-facebook>
          <!-- <div class="flex h-full w-full cursor-pointer items-center gap-3">
            <Icon :name="IconMap.SIGNAL" size="1.5em" />
            <p>{{ $t("components._global.signal") }}</p>
          </div> -->
          <div
            @click="
              copyToClipboard(
                props?.event?.name
                  ? props?.event?.name
                  : props?.organization?.name
                    ? props?.organization?.name
                    : '',
                getCurrentUrl()
              )
            "
            @keypress.space="
              copyToClipboard(
                props?.event?.name
                  ? props?.event?.name
                  : props?.organization?.name
                    ? props?.organization?.name
                    : '',
                getCurrentUrl()
              )
            "
            @keypress.enter="
              copyToClipboard(
                props?.event?.name
                  ? props?.event?.name
                  : props?.organization?.name
                    ? props?.organization?.name
                    : '',
                getCurrentUrl()
              )
            "
            class="focus-brand"
            tabindex="0"
            role="button"
          >
            <MetaTagSocialMedia
              v-if="!contentCopied"
              class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
              iconName="bi:link-45deg"
              :text="$t('components.meta-social-media-tag.copy-link')"
              iconSize="1.5em"
            />
            <MetaTagSocialMedia
              v-if="contentCopied"
              class="text-light-accepted-green hover:text-light-accepted-green dark:text-dark-accepted-green dark:hover:text-dark-accepted-green"
              iconName="bi:check2-square"
              :text="$t('components.meta-social-media-tag.copied')"
              iconSize="1.5em"
            />
          </div>
        </div>
      </div>
      <div class="pt-6">
        <p class="responsive-h4 font-bold">
          {{ $t("components.modal-share-page.offline") }}
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
      <!-- <s-facebook-messenger
        @popup-close="onClose"
        @popup-open="onOpen"
        @popup-block="onBlock"
        @popup-focus="onFocus"
        :window-features="windowFeatures"
        :share-options="shareOptions"
        :use-native-behavior="useNativeBehavior"
      >
        <MetaTagSocialMedia
          class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
          iconName="simple-icons:messenger"
          :text="$t('components.meta-social-media-tag.messenger')"
          iconSize="1.5em"
        />
      </s-facebook-messenger> -->
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { SEmail, SFacebook, SMastodon, STelegram, STwitter } from "vue-socials";
import ModalBase from "~/components/modal/ModalBase.vue";
import type { BtnAction } from "~/types/btn-props";
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";
import type { Resource } from "~/types/resource";
import type { User } from "~/types/user";

const props = defineProps<{
  cta: BtnAction["cta"];
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
  isOpen: boolean;
}>();

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};

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

// Function to grab the url to the base id of the entity to share.
const getCurrentUrl = () => {
  if (props.organization) {
    return `/organizations/${props.organization.id}`;
  } else if (props.group) {
    return `/organizations/${props.group.organization.id}/groups/${props.group.id}`;
  } else if (props.event) {
    return `/events/${props.event.id}`;
  } else if (props.resource) {
    return props.resource.resourceURL;
  } else if (props.user) {
    return `/users/${props.user.id}`;
  }
  const url = window.location.href;
  return url.substring(0, url.lastIndexOf("/"));
};

const shareOptions = {
  url: getCurrentUrl() || ``,
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
  // appId: 842766727626496, Facebook Messenger App ID
};

const useNativeBehavior = false;
const contentCopied = ref(false);

// No specific actions should be taken on these events, but we can customize the behavior if needed.
const nativeBehaviorOptions = {
  onClose: () => {},
  onOpen: () => {},
  onBlock: () => {},
  onFocus: () => {},
};

const windowFeatures = {};

const copyToClipboard = async (name: string, url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    contentCopied.value = true;
    setTimeout(() => {
      contentCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error(`Could not copy text: ${error}`);
    contentCopied.value = false;
  }
};
</script>
