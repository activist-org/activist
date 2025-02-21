<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <component
    v-if="type == 'vueSocials'"
    @popup-close="nativeBehaviorOptions.onClose"
    @popup-open="nativeBehaviorOptions.onOpen"
    @popup-block="nativeBehaviorOptions.onBlock"
    @popup-focus="nativeBehaviorOptions.onFocus"
    :is="vueSocials[socialComponent]"
    class="focus-brand"
    :window-features="windowFeatures"
    :share-options="shareOptions"
    :use-native-behavior="useNativeBehavior"
    :native-behavior-options="nativeBehaviorOptions"
  >
    <MetaTagSocialMedia
      class="dark:hover:distinct-text text-primary-text hover:text-distinct-text"
      :iconName="iconName"
      :text="text"
      :iconSize="iconSize"
    />
  </component>
  <div
    v-else-if="type == 'redirect'"
    @click="copyToClipboardThenOpenUrl(name, urlLink, redirectLink)"
    @keypress.space="copyToClipboardThenOpenUrl(name, urlLink, redirectLink)"
    @keypress.enter="copyToClipboardThenOpenUrl(name, urlLink, redirectLink)"
    class="focus-brand"
    tabindex="0"
    role="button"
  >
    <MetaTagSocialMedia
      v-if="!contentCopied"
      class="dark:hover:distinct-text text-primary-text hover:text-distinct-text"
      :iconName="iconName"
      :text="text"
      :iconSize="iconSize"
    />
    <MetaTagSocialMedia
      v-if="contentCopied"
      class="text-accepted-green hover:text-accepted-green dark:text-accepted-green dark:hover:text-accepted-green"
      :iconName="IconMap.SQUARE_CHECK"
      :text="$t('i18n.components.btn_share_icon.url_copied')"
      :iconSize="iconSize"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, type Component } from "vue";
import { useI18n } from "vue-i18n";
import {
  SEmail,
  SFacebook,
  SFacebookMessenger,
  SMastodon,
  STelegram,
  STwitter,
} from "vue-socials";
import { toast } from "vue-sonner";
import { IconMap } from "~/types/icon-map";

const vueSocials: { [key: string]: Component } = {
  SEmail,
  SFacebook,
  SMastodon,
  STelegram,
  STwitter,
  SFacebookMessenger,
};

const props = defineProps({
  type: String,
  socialComponent: {
    type: String,
    default: "",
  },
  iconName: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  iconSize: String,
  shareOptions: Object,
  windowFeatures: Object,
  useNativeBehavior: Boolean,
  nativeBehaviorOptions: {
    type: Object,
    default: () => ({}),
  },
  name: {
    type: String,
    default: "",
  },
  urlLink: {
    type: String,
    default: "",
  },
  redirectLink: {
    type: String,
    default: null,
  },
});

const { t } = useI18n();
const contentCopied = ref(false);

const getCurrentI18n: { [key: string]: string } = {
  signal: "i18n.components.btn_share_icon.opening_signal",
  matrix: "i18n.components.btn_share_icon.opening_matrix",
  instagram: "i18n.components.btn_share_icon.opening_instagram",
};

const copyToClipboardThenOpenUrl = async (
  name: string,
  url: string,
  redirectUrl?: string
) => {
  try {
    await navigator.clipboard.writeText(url);
    contentCopied.value = true;
    if (redirectUrl) {
      toast(t(getCurrentI18n[props.text.toLowerCase()]));
      setTimeout(() => {
        contentCopied.value = false;
        window.open(redirectUrl, "_blank");
      }, 2000);
    } else {
      setTimeout(() => {
        contentCopied.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error(`Could not copy text: ${error}`);
    contentCopied.value = false;
  }
};
</script>
