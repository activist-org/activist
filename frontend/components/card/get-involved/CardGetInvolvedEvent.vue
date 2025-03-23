<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("i18n.components._global.participate") }}
      </h3>
      <IconEdit
        v-if="userIsSignedIn"
        @click="openModalEditTextEvent"
        @keydown.enter="openModalEditTextEvent"
      />
    </div>
    <div class="space-y-3 pt-3">
      <p v-if="event.texts.getInvolved">
        {{ event.texts.getInvolved }}
      </p>
      <p v-else>
        {{ $t("i18n.components._global.participate_subtext") }}
      </p>
      <!-- <p>
        {{ $t("i18n.components.card_get_involved_event.legal_disclaimer_subtext") }}
      </p>
      <CardLegalDisclaimer v-if="disclaimer" :disclaimer="disclaimer" /> -->
      <div class="flex w-max pt-2">
        <BtnRouteInternal
          class="w-full"
          :cta="true"
          linkTo="/"
          label="i18n._global.offer_to_help"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="i18n._global.offer_to_help_aria_label"
        />
      </div>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalEditTextEvent } =
  useModalHandlers("ModalEditTextEvent");

const { userIsSignedIn } = useUser();

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;
</script>
