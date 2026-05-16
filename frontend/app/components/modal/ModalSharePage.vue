<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
      <DialogTitle class="font-display">
        <h2 class="font-bold">
          {{ $t("i18n.components.modal_share_page.header") }}
        </h2>
      </DialogTitle>
      <div class="pt-6">
        <h4 class="font-bold">
          {{ $t("i18n.components.modal_share_page.suggested") }}
        </h4>
        <div
          class="grid w-full grid-cols-3 grid-rows-2 content-start gap-4 pt-4 lg:gap-8"
        >
          <BtnShareIcon
            :iconName="IconMap.SIGNAL"
            iconSize="1.5em"
            :name="getCurrentName()"
            :native-behavior-options="nativeBehaviorOptions"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_signal')
            "
            redirect-link="https://signal.me/#p"
            :share-options="shareOptions"
            :text="$t('i18n.components.modal_share_page.signal')"
            type="redirect"
            :urlLink="getCurrentUrl()"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <BtnShareIcon
            :iconName="IconMap.MASTODON"
            iconSize="1.5em"
            :native-behavior-options="nativeBehaviorOptions"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_mastodon')
            "
            :share-options="shareOptions"
            social-component="SMastodon"
            :text="$t('i18n.components.modal_share_page.mastodon')"
            type="vueSocials"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <BtnShareIcon
            :iconName="IconMap.MATRIX"
            iconSize="1.5em"
            :name="getCurrentName()"
            :native-behavior-options="nativeBehaviorOptions"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_matrix')
            "
            redirect-link="https://matrix.to/#/#activist_community:matrix.org"
            :share-options="shareOptions"
            :text="$t('i18n.components._global.matrix')"
            type="redirect"
            :urlLink="getCurrentUrl()"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <ModalQRCodeBtn
            v-if="organization"
            :firstParagraph="`${$t('i18n.components._global.section_1_paragraph_1_organization')} ${$t('i18n.components._global.section_1_paragraph_1_2')}`"
            :linkUrl="getCurrentUrl()"
            :name="organization.name"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_qr_code')
            "
            type="meta-tag"
          />
          <ModalQRCodeBtn
            v-if="group"
            :firstParagraph="`${$t('i18n.components._global.section_1_paragraph_1_group')} ${$t('i18n.components._global.section_1_paragraph_1_2')}`"
            :linkUrl="getCurrentUrl()"
            :name="group.name"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_qr_code')
            "
            type="meta-tag"
          />
          <ModalQRCodeBtn
            v-if="event"
            :firstParagraph="`${$t('i18n.components._global.section_1_paragraph_1_event')} ${$t('i18n.components._global.section_1_paragraph_1_2')}`"
            :linkUrl="getCurrentUrl()"
            :name="event.name"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_qr_code')
            "
            type="meta-tag"
          />
          <ModalQRCodeBtn
            v-if="resource"
            :firstParagraph="`${$t('i18n.components.modal_share_page.section_1_paragraph_1_resource')} ${$t('i18n.components._global.section_1_paragraph_1_2')}`"
            :linkUrl="getCurrentUrl()"
            :name="resource.name"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_qr_code')
            "
            type="meta-tag"
          />
          <ModalQRCodeBtn
            v-if="user"
            :firstParagraph="`${$t('i18n.components.modal_share_page.section_1_paragraph_1_user')} ${$t('i18n.components._global.section_1_paragraph_1_2')}`"
            :linkUrl="getCurrentUrl()"
            :name="user.name"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_qr_code')
            "
            type="meta-tag"
          />

          <BtnShareIcon
            :iconName="IconMap.ENVELOPE"
            iconSize="1.5em"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_email')
            "
            :share-options="shareOptions"
            social-component="SEmail"
            text="Email"
            type="vueSocials"
          />

          <BtnShareIcon
            :iconName="IconMap.LINK"
            iconSize="1.5em"
            :name="getCurrentName()"
            :native-behavior-options="nativeBehaviorOptions"
            :reason-for-suggesting="
              $t('i18n.components.modal_share_page.suggested_link')
            "
            :share-options="shareOptions"
            :text="$t('i18n.components.modal_share_page.copy_link')"
            type="redirect"
            :urlLink="getCurrentUrl()"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />
        </div>
      </div>
      <div class="pt-12">
        <h4 class="font-bold">
          {{ $t("i18n.components.modal_share_page.other") }}
        </h4>
        <div
          class="grid w-full grid-cols-3 grid-rows-1 content-start gap-4 pt-4 lg:gap-8 lg:pt-6"
        >
          <BtnShareIcon
            :iconName="IconMap.TELEGRAM"
            iconSize="1.5em"
            :native-behavior-options="nativeBehaviorOptions"
            reason-for-suggesting=""
            :share-options="shareOptions"
            social-component="STelegram"
            :text="$t('i18n.components.modal_share_page.telegram')"
            type="vueSocials"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <BtnShareIcon
            :iconName="IconMap.INSTAGRAM"
            iconSize="1.5em"
            :name="getCurrentName()"
            :native-behavior-options="nativeBehaviorOptions"
            reason-for-suggesting=""
            redirect-link="https://instagram.com"
            :share-options="shareOptions"
            :text="$t('i18n.components._global.instagram')"
            type="redirect"
            :urlLink="getCurrentUrl()"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <BtnShareIcon
            :iconName="IconMap.MESSENGER"
            iconSize="1.5em"
            :native-behavior-options="nativeBehaviorOptions"
            reason-for-suggesting=""
            :share-options="shareOptions"
            social-component="SFacebookMessenger"
            :text="$t('i18n.components.modal_share_page.messenger')"
            type="vueSocials"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <BtnShareIcon
            :iconName="IconMap.FACEBOOK"
            iconSize="1.5em"
            :native-behavior-options="nativeBehaviorOptions"
            reason-for-suggesting=""
            :share-options="shareOptions"
            social-component="SFacebook"
            :text="$t('i18n.components.modal_share_page.facebook')"
            type="vueSocials"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />

          <BtnShareIcon
            :iconName="IconMap.TWITTER"
            iconSize="1.5em"
            :native-behavior-options="nativeBehaviorOptions"
            reason-for-suggesting=""
            :share-options="shareOptions"
            social-component="STwitter"
            :text="$t('i18n.components.modal_share_page.twitter')"
            type="vueSocials"
            :use-native-behavior="useNativeBehavior"
            :window-features="windowFeatures"
          />
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

const modalName = "ModalSharePage";
const props = defineProps<{
  cta: BtnAction["cta"];
  organization?: Organization;
  group?: Group;
  event?: CommunityEvent;
  resource?: Resource;
  user?: UserActivist;
}>();

const organization = computed(() => {
  return props.organization || null;
});

const group = computed(() => {
  return props.group || null;
});

const event = computed(() => {
  return props.event || null;
});

const resource = computed(() => {
  return props.resource || null;
});

const user = computed(() => {
  return props.user || null;
});

const getEntityType = () => {
  if (organization.value) {
    return setEntityInfo(organization.value);
  } else if (group.value) {
    return setEntityInfo(group.value);
  } else if (event.value) {
    return setEntityInfo(event.value);
  }
};

const setEntityInfo = (data: Entity) => {
  if (!data) return;
  return {
    subject: `Share ${data.name}!`,
    body: `Check out ${data.name}!`,
    url: getCurrentUrl(),
    text: `Check out ${data.name}!`,
  };
};

const getCurrentName = () => {
  const e = unref(event);
  const org = unref(organization);

  return e?.name || org?.name || "";
};

// Function to grab the url to the base id of the entity to share.
const getCurrentUrl = () => {
  if (organization.value) {
    return `${BASE_FRONTEND_URL}/organizations/${organization.value.id}`;
  } else if (group.value) {
    return `${BASE_FRONTEND_URL}/organizations/${group.value.org.id}/groups/${group.value.id}`;
  } else if (event.value) {
    return `${BASE_FRONTEND_URL}/events/${event.value.id}`;
  } else if (resource.value) {
    return resource.value.url;
  } else if (user.value) {
    return `${BASE_FRONTEND_URL}/users/${user.value.id}`;
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
    // eslint-disable-next-line no-constant-binary-expression
    `${getEntityType()?.body}   ${getEntityType()?.url}` || "Check this out!",
  redirectUri: "https://www.domain.com/",
  domain: "https://mas.to",
  appId: 842766727626496,
};

const useNativeBehavior = false;

// No specific actions should be taken on these events, but we can customize the behavior if needed.
const nativeBehaviorOptions = {
  onClose: () => {},
  onOpen: () => {},
  onBlock: () => {},
  onFocus: () => {},
};

const windowFeatures = {};
</script>
