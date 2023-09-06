<template>
  <div class="px-5 py-5 card-style">
    <div class="relative flex flex-col lg:flex-row">
      <div class="flex items-center gap-5">
        <h3 class="text-left responsive-h3 font-display">
          {{ $t("components.card-get-involved.header") }}
        </h3>
        <Icon name="bi:pencil-square" size="1.2em" />
      </div>
      <div class="flex pt-2 lg:absolute lg:right-0 space-x-2 lg:pt-0">
        <BtnLabeled
          v-if="organization && organization.workingGroups"
          :cta="true"
          :label="$t('components.btn-labeled.view-all-groups')"
          linkTo="/"
          fontSize="sm"
          :alternateText="
            $t('components.btn-labeled.view-all-groups-aria-label')
          "
        />
        <BtnLabeled
          v-if="organization"
          :cta="true"
          :label="$t('components.btn-labeled.join-organization')"
          linkTo="/"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.25em"
          :alternateText="
            $t('components.btn-labeled.join-organization-aria-label')
          "
        />
      </div>
    </div>
    <div v-if="organization" class="mt-4">
      <div v-if="organization.workingGroups">
        <p>
          {{ $t("components.card-get-involved.working-groups-subtext") }}
          {{ organization.name }}:
        </p>
        <Feed :feedItemURLs="organization.workingGroups" />
      </div>
      <div v-else>
        <p>
          {{ $t("components.card-get-involved.join-subtext") }}
          {{ organization.name }}.
        </p>
      </div>
    </div>
    <div v-else-if="event" class="pt-3 space-y-3">
      <p>
        {{ event.getInvolvedDescription }}
      </p>
      <p>
        {{ $t("components.card-get-involved.legal-disclaimer-subtext") }}
      </p>
      <CardLegalDisclaimer :disclaimer="disclaimer" />
      <div class="flex pt-2 w-max">
        <BtnLabeled
          class="w-full"
          :cta="true"
          :label="$t('components.btn-labeled.offer-to-help')"
          linkTo="/"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.25em"
          :alternateText="$t('components.btn-labeled.offer-to-help-aria-label')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "../../types/event";
import type { Organization } from "../../types/organization";

defineProps<{
  organization?: Organization;
  event?: Event;
  disclaimer: string;
}>();
</script>
