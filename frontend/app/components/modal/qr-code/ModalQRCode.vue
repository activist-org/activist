<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <DialogTitle class="flex justify-between font-display">
      <h2 class="font-bold">
        {{ $t("i18n.components.modal_qr_code.header") }}
      </h2>
    </DialogTitle>
    <div
      class="flex flex-col items-center space-y-6 pb-6 md:grid md:grid-cols-2 md:grid-rows-1 lg:mr-14 lg:grid-cols-3 lg:grid-rows-1 lg:space-x-6 lg:space-y-0 lg:pr-8"
    >
      <div class="col-span-2 items-center space-y-4 text-left font-medium">
        <p>
          {{ props.firstParagraph }}
        </p>
        <p>
          {{ props.secondParagraph }}
        </p>
        <p>
          {{ $t("i18n.components.modal_qr_code.subheader_2") }}
        </p>
        <ul class="list-disc pl-6 md:pl-8">
          <li>
            {{ $t("i18n.components.modal_qr_code.section_2_list_1_item_1") }}
          </li>
          <li>
            {{ $t("i18n.components.modal_qr_code.section_2_list_1_item_2") }}
          </li>
          <li>
            {{ $t("i18n.components.modal_qr_code.section_2_list_1_item_3") }}
          </li>
        </ul>
        <BtnActionDropdown
          v-if="aboveMediumBP"
          @main-btn-clicked="handleMainBtnClicked"
          ariaLabel="i18n.components.modal_qr_code.download_qr_code_aria_label"
          ariaLabelDropdown="i18n.components.modal_qr_code.qr_code_options_aria_label"
          class="block w-fit"
          :cta="true"
          :dropdownIcon="IconMap.CHEVRON_DOWN"
          :dropdownOptions="availableFormats"
          :dropdownOptionsCallback="downloadQRCode"
          fontSize="lg"
          iconSize="1.25em"
          label="i18n.components.modal_qr_code.download_qr_code"
        />
      </div>
      <div class="flex px-4 md:pb-2 md:pl-8">
        <button
          @blur="showTooltip = false"
          @click="onImageClick"
          @focus="showTooltip = true"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          @pointerdown="showTooltip = true"
          @pointerup="showTooltip = false"
          @touchcancel="showTooltip = false"
          @touchend="showTooltip = false"
          @touchstart="showTooltip = true"
          :ariaLabel="$t('i18n.components.modal_qr_code.aria_label')"
          class="flex cursor-pointer focus-brand"
        >
          <ModalQRCodeImage
            ref="qrcode"
            class="elem-shadow-md select-none rounded-3xl"
            :codeUrl="BASE_FRONTEND_URL + props.linkUrl"
          />
          <TooltipBase
            v-show="showTooltip"
            :text="$t('i18n.components.modal_qr_code.tooltip')"
          />
        </button>
      </div>
      <BtnActionDropdown
        v-if="!aboveMediumBP"
        @main-btn-clicked="handleMainBtnClicked"
        ariaLabel="i18n.components.modal_qr_code.download_qr_code_aria_label"
        ariaLabelDropdown="i18n.components.modal_qr_code.qr_code_options_aria_label"
        class="w-fit"
        :cta="true"
        :dropdownIcon="IconMap.CHEVRON_DOWN"
        :dropdownOptions="availableFormats"
        :dropdownOptionsCallback="downloadQRCode"
        fontSize="lg"
        iconSize="1.25em"
        label="i18n.components.modal_qr_code.download_qr_code"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

const { context } = useModalHandlers("ModalsQRCode");

const props = computed(() => {
  const modalProps = (context.value ?? {}) as {
    firstParagraph?: string;
    secondParagraph?: string;
    reasonForSuggesting?: string;
    linkUrl?: string;
    fileName?: string;
  };
  return {
    firstParagraph: modalProps.firstParagraph || "",
    secondParagraph: modalProps.secondParagraph || "",
    reasonForSuggesting: modalProps.reasonForSuggesting || "",
    linkUrl: modalProps.linkUrl || "",
    fileName: modalProps.fileName || "",
  };
});
const aboveMediumBP = useBreakpoint("md");
const modalName = "ModalsQRCode";

const qrCodeFileName: string = props.value.fileName;

const { qrcode, showTooltip, availableFormats, downloadQRCode, onImageClick } =
  useQRCode(qrCodeFileName);

const handleMainBtnClicked = () => {
  downloadQRCode("PNG");
};
</script>
