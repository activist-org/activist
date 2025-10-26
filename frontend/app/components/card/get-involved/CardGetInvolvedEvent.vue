<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="text-left font-display">
        {{ $t("i18n.components._global.participate") }}
      </h3>
      <IconEdit
        v-if="userIsSignedIn"
        @click="openModalTextEvent"
        @keydown.enter="openModalTextEvent"
      />
    </div>
    <div class="space-y-3 pt-3">
      <p v-if="event?.texts[0]?.getInvolved">
        {{ event.texts[0]?.getInvolved }}
      </p>
      <p v-else>
        {{ $t("i18n.components.card_get_involved_event.participate_subtext") }}
      </p>
      <!-- <p>
        {{ $t("i18n.components.card_get_involved_event.legal_disclaimer_subtext") }}
      </p>
      <CardLegalDisclaimer v-if="disclaimer" :disclaimer="disclaimer" /> -->
      <div class="flex w-max pt-2">
        <BtnRouteInternal
          ariaLabel="i18n._global.offer_to_help_aria_label"
          class="w-full"
          :cta="true"
          fontSize="sm"
          iconSize="1.45em"
          label="i18n._global.offer_to_help"
          linkTo="/"
          :rightIcon="IconMap.ARROW_RIGHT"
        />
      </div>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import { useGetEvent } from "~/composables/queries/useGetEvent";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalTextEvent } = useModalHandlers("ModalTextEvent");

const { userIsSignedIn } = useUser();

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);
</script>
