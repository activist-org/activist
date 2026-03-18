<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Note: This file doesn't use ModalBase, so we handle modal events in the script block below. -->
<template>
  <button
    v-if="type == 'icon'"
    @click="openModal()"
    @keydown.enter="openModal()"
    :aria-label="$t('i18n.components.modal_qr_code_btn.open_modal_aria_label')"
    class="elem-on-card-style absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-primary-text focus-brand sm:h-16 sm:w-16"
  >
    <div class="sm:hidden">
      <Icon
        :alt="$t('i18n.components.modal_qr_code_btn.img_alt_text')"
        class="-mb-1"
        :name="IconMap.QR_CODE"
        size="2em"
      />
    </div>
    <div class="hidden sm:block">
      <Icon
        :alt="$t('i18n.components.modal_qr_code_btn.img_alt_text')"
        class="-mb-1"
        :name="IconMap.QR_CODE"
        size="3em"
      />
    </div>
  </button>
  <div v-else>
    <MetaTagSocialMedia
      @click="openModal()"
      @keydown.enter="openModal()"
      class="dark:hover:distinct-text text-primary-text focus-brand hover:text-distinct-text"
      :iconName="IconMap.QR_CODE"
      iconSize="1.5em"
      tabindex="0"
      :text="$t('i18n.components.modal_qr_code_btn.qr_code')"
    />
    <p
      v-if="reasonForSuggesting"
      class="mt-0.5 text-xs italic text-distinct-text"
      role="note"
    >
      {{ reasonForSuggesting }}
    </p>
  </div>
  <ModalQRCode
    v-if="hasEntity"
    @closeModal="handleCloseModal"
    :firstParagraph="computedFirstParagraph"
    :secondParagraph="computedSecondParagraph"
    :linkUrl="computedLinkUrl"
    :fileName="computedFileName"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  organization?: Organization;
  group?: Group;
  event?: CommunityEvent;
  resource?: Resource;
  user?: UserActivist;
  type: "icon" | "meta-tag";
  reasonForSuggesting: string;
  // optional direct overrides
  firstParagraph?: string;
  secondParagraph?: string;
  linkUrl?: string;
  fileName?: string;
}>();

const { t } = useI18n();
const { linkUrl: entityLinkUrl } = useLinkURL(props);
const modals = useModals();
const modalName = "ModalsQRCode";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName]?.isOpen ?? false;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName]?.isOpen ?? false;
};

const hasEntity = computed(
  () =>
    !!(
      props.organization ||
      props.group ||
      props.event ||
      props.resource ||
      props.user
    )
);

const computedFirstParagraph = computed(() => {
  if (props.firstParagraph) return props.firstParagraph;
  const suffix = t("i18n.components.modal_qr_code_btn.section_1_paragraph_1_2");
  if (props.organization)
    return (
      t(
        "i18n.components.modal_qr_code_btn.section_1_paragraph_1_organization"
      ) +
      " " +
      suffix
    );
  if (props.group)
    return (
      t("i18n.components.modal_qr_code_btn.section_1_paragraph_1_group") +
      " " +
      suffix
    );
  if (props.event)
    return (
      t("i18n.components.modal_qr_code_btn.section_1_paragraph_1_event") +
      " " +
      suffix
    );
  if (props.resource)
    return (
      t("i18n.components.modal_qr_code_btn.section_1_paragraph_1_resource") +
      " " +
      suffix
    );
  if (props.user)
    return (
      t("i18n.components.modal_qr_code_btn.section_1_paragraph_1_user") +
      " " +
      suffix
    );
  return "";
});

const computedSecondParagraph = computed(() => props.secondParagraph || "");

const computedLinkUrl = computed(() => props.linkUrl || entityLinkUrl.value);

const computedFileName = computed(() => {
  if (props.fileName) return props.fileName;
  const name =
    props.organization?.name ??
    props.group?.name ??
    props.event?.name ??
    props.resource?.name ??
    props.user?.name ??
    "";
  return "qr_code_" + name.toLowerCase().replaceAll(" ", "_");
});
</script>
