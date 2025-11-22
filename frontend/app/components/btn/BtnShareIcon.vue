<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <component
    :is="vueSocials[socialComponent]"
    v-if="type == 'vueSocials'"
    @popup-block="nativeBehaviorOptions.onBlock"
    @popup-close="nativeBehaviorOptions.onClose"
    @popup-focus="nativeBehaviorOptions.onFocus"
    @popup-open="nativeBehaviorOptions.onOpen"
    class="focus-brand"
    :native-behavior-options="nativeBehaviorOptions"
    :share-options="shareOptions"
    :use-native-behavior="useNativeBehavior"
    :window-features="windowFeatures"
  >
    <MetaTagSocialMedia
      :iconName="iconName"
      :iconSize="iconSize"
      :text="text"
    />
    <p
      v-if="reasonForSuggesting"
      class="mt-0.5 text-xs italic text-distinct-text"
      role="note"
    >
      {{ reasonForSuggesting }}
    </p>
  </component>
  <div
    v-else-if="type == 'redirect'"
    @click="copyToClipboardThenOpenUrl(name, urlLink, redirectLink)"
    @keypress.enter="copyToClipboardThenOpenUrl(name, urlLink, redirectLink)"
    @keypress.space="copyToClipboardThenOpenUrl(name, urlLink, redirectLink)"
    class="focus-brand"
    role="button"
    tabindex="0"
  >
    <MetaTagSocialMedia
      v-if="!contentCopied"
      class="dark:hover:distinct-text text-primary-text hover:text-distinct-text"
      :iconName="iconName"
      :iconSize="iconSize"
      :text="text"
    />
    <MetaTagSocialMedia
      v-if="contentCopied"
      class="text-accepted-green hover:text-accepted-green dark:text-accepted-green dark:hover:text-accepted-green"
      :iconName="IconMap.SQUARE_CHECK"
      :iconSize="iconSize"
      :text="$t('i18n.components.btn_share_icon.url_copied')"
    />
    <p
      v-if="reasonForSuggesting"
      class="mt-0.5 text-xs italic text-distinct-text"
      role="note"
    >
      {{ reasonForSuggesting }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

import { useI18n } from "vue-i18n";
import {
  SEmail,
  SFacebook,
  SFacebookMessenger,
  SMastodon,
  STelegram,
  STwitter,
} from "vue-socials";

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
  reasonForSuggesting: String,
});

const { t } = useI18n();
const contentCopied = ref(false);
const { showToastInfo } = useToaster();
type ShareKeys = "signal" | "matrix" | "instagram";

const getCurrentI18n: Record<ShareKeys, string> = {
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
      showToastInfo(
        t(
          getCurrentI18n[
            props.text.toLowerCase() as keyof typeof getCurrentI18n
          ]
        )
      );
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
    contentCopied.value = false;
    void error;
  }
};
</script>
