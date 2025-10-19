<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="text-left font-display">
        {{ $t("i18n.components._global.get_involved") }}
      </h3>
      <IconEdit
        v-if="userIsSignedIn"
        @click="openModalTextGroup"
        @keydown.enter="openModalTextGroup"
        data-testid="edit-icon"
      />
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="group?.getInvolvedUrl"
          ariaLabel="i18n._global.join_group_aria_label"
          :cta="true"
          data-testid="get-involved-join-button"
          fontSize="sm"
          iconSize="1.45em"
          label="i18n._global.join_group"
          :linkTo="group.getInvolvedUrl"
          :rightIcon="IconMap.ARROW_RIGHT"
        />
      </div>
    </div>
    <div class="space-y-3 pt-3">
      <p v-if="group?.texts?.getInvolved">
        {{ group.texts.getInvolved }}
      </p>
      <p v-else>
        {{
          $t("i18n.components.card_get_involved_group.join_group_subtext", {
            entity_name: group?.name,
          })
        }}.
      </p>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import { useGetGroup } from "~/composables/queries/useGetGroup";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalTextGroup } = useModalHandlers("ModalTextGroup");

const { userIsSignedIn } = useUser();

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);
</script>
