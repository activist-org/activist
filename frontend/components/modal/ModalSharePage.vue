<template>
  <ModalBase>
    <template #normalDisplay>
      <BtnAction
        class="hidden w-max md:block"
        :cta="props.cta"
        :label="props.label"
        :aria-label="props.ariaLabel"
        fontSize="sm"
        leftIcon="bi:box-arrow-up"
        iconSize="1.25em"
      />
    </template>
    <template #modalDisplay>
      <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
        <DialogTitle class="font-display">
          <p class="responsive-h2 font-bold">
            {{ $t("components.modal-share-page.header") }}
          </p>
        </DialogTitle>
        <div
          class="grid w-4/5 grid-cols-4 grid-rows-2 content-start gap-4 pt-4 lg:gap-8 lg:pt-6"
        >
          <s-telegram
            @popup-close="onClose"
            @popup-open="onOpen"
            @popup-block="onBlock"
            @popup-focus="onFocus"
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
            @popup-close="onClose"
            @popup-open="onOpen"
            @popup-block="onBlock"
            @popup-focus="onFocus"
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
            @popup-close="onClose"
            @popup-open="onOpen"
            @popup-block="onBlock"
            @popup-focus="onFocus"
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
          <ModalBase>
            <template #normalDisplay>
              <MetaTagSocialMedia
                class="dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
                iconName="bi:qr-code-scan"
                :text="$t('components.meta-social-media-tag.qr-code')"
                iconSize="1.5em"
              />
            </template>
            <template #modalDisplay>
              <ModalQRCode
                v-if="props.organization"
                :entityName="props?.organization?.name"
              />
              <ModalQRCode
                v-if="props.event"
                :entityName="props?.event?.name"
              />
            </template>
          </ModalBase>
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
                class="text-light-text dark:text-dark-text hover:text-light-distinct-text dark:hover:dark-distinct-text"
                iconName="simple-icons:messenger"
                :text="$t('components.meta-social-media-tag.messenger')"
                iconSize="1.5em"
              />
            </s-facebook-messenger>
            <s-facebook
              @popup-close="onClose"
              @popup-open="onOpen"
              @popup-block="onBlock"
              @popup-focus="onFocus"
              :href="getCurrentUrl()"
              :window-features="windowFeatures"
              :share-options="shareOptions"
              :use-native-behavior="useNativeBehavior"
              :native-behavior-options="nativeBehaviorOptions"
            >
              <MetaTagSocialMedia
                class="text-light-text dark:text-dark-text hover:text-light-distinct-text dark:hover:dark-distinct-text"
                iconName="simple-icons:facebook"
                :text="$t('components.meta-social-media-tag.facebook')"
                iconSize="1.5em"
              />
            </s-facebook> -->
          <div
            @click="
              copyToClipboard(
                props?.event?.name
                  ? props?.event?.name
                  : props?.organization?.name
                    ? props?.organization?.name
                    : '',
                getCurrentUrl(),
              )
            "
            @keypress.space="
              copyToClipboard(
                props?.event?.name
                  ? props?.event?.name
                  : props?.organization?.name
                    ? props?.organization?.name
                    : '',
                getCurrentUrl(),
              )
            "
            @keypress.enter="
              copyToClipboard(
                props?.event?.name
                  ? props?.event?.name
                  : props?.organization?.name
                    ? props?.organization?.name
                    : '',
                getCurrentUrl(),
              )
            "
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
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { SEmail, SMastodon, STelegram, STwitter } from "vue-socials";
import ModalBase from "~/components/modal/ModalBase.vue";
import type { BtnAction } from "~/types/btn-props";
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

const props = defineProps<{
  cta: BtnAction["cta"];
  label: BtnAction["label"];
  ariaLabel: BtnAction["ariaLabel"];
  event?: Event;
  organization?: Organization;
  // group?: Group; // add group when we have it
}>();

const getEntityType = () => {
  if (props.event) {
    return setEntityInfo(props.event);
  } else if (props.organization) {
    return setEntityInfo(props.organization);
  }
};

const setEntityInfo = (
  data: typeof props.event | typeof props.organization,
) => {
  if (!data) return;
  return {
    subject: `Share ${data.name}!`,
    body: `Check out ${data.name}!`,
    url: getCurrentUrl(),
    text: `Check out ${data.name}!`,
  };
};

// Function to grab the url to the base id of the event/org/group.
const getCurrentUrl = () => {
  const url = window.location.href;
  return url.substring(0, url.lastIndexOf("/"));
};

const shareOptions = {
  url: getCurrentUrl() || "https://activist.org/en",
  text: getEntityType()?.text || "Check this out!",
  hashtags: ["activism", "organizing"],
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
    await navigator.clipboard.writeText(`${name} ${url}`);
    contentCopied.value = true;
    setTimeout(() => {
      contentCopied.value = false;
    }, 3000);
  } catch (error) {
    console.error(`Could not copy text: ${error}`);
    contentCopied.value = false;
  }
};
</script>
