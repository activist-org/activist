<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <Icon :name="IconMap.WARN_OCTAGON" size="1.4em" />
        <p>{{ $t(message) }}</p>
      </div>
      <div class="flex gap-2">
        <BtnAction
          @click="onConfirm"
          ariaLabel="i18n.components.modal_alert.confirm_action_aria_label"
          :cta="true"
          fontSize="sm"
          :label="confirmBtnLabel || 'i18n.components.modal_alert.confirm'"
        />
        <BtnAction
          @click="handleCloseModal"
          ariaLabel="i18n.components.modal_alert.cancel_action_aria_label"
          :cta="false"
          fontSize="sm"
          label="i18n.components.modal_alert.cancel"
        />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  message: string;
  onConfirmation?: () => Promise<void> | void;
  confirmBtnLabel?: string;
  name?: string;
}>();

const modalName = props.name ?? "ModalAlert";
const { handleCloseModal } = useModalHandlers(modalName);

const onConfirm = () => {
  props.onConfirmation?.();
  handleCloseModal();
};
</script>
