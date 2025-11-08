<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <BtnAction
    :id="`btn-add-${element.toLowerCase()}`"
    v-if="canAdd"
    @click.stop="onClick"
    @keydown.enter="onClick"
    :ariaLabel="ariaLabel"
    class="w-max"
    :cta="true"
    fontSize="sm"
    iconSize="1.35em"
    :label="$t('i18n.components.btn_action_add.add_element', { element })"
    :leftIcon="IconMap.PLUS"
  />
</template>
<script setup lang="ts">
import type { BtnAction } from "~/types/btn-props";

import { IconMap } from "~/types/icon-map";

const { canCreate } = useUser();
const canAdd = computed(() => canCreate());
type Props = Omit<BtnAction, "label" | "leftIcon" | "cta" | "fontSize"> & {
  element: string;
  onClick?: () => void;
};
defineProps<Props>();
</script>
