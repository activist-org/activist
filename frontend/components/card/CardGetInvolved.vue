<template>
  <div class="card-style px-5 py-5">
    <div class="relative flex flex-col lg:flex-row">
      <div class="flex items-center gap-5">
        <h3
          v-if="organization || group"
          class="responsive-h3 text-left font-display"
        >
          {{ $t("components.card-get-involved.get-involved") }}
        </h3>
        <h3 v-else class="responsive-h3 text-left font-display">
          {{ $t("components.card-get-involved.participate") }}
        </h3>
        <IconEdit />
      </div>
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="organization && organization.workingGroups"
          :cta="true"
          :linkTo="'/organizations/' + id + '/groups'"
          label="components.btn-route-internal.view-all-groups"
          fontSize="sm"
          ariaLabel="components.btn-route-internal.view-all-groups-aria-label"
        />
        <BtnRouteInternal
          v-if="organization"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.join-organization"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-organization-aria-label"
        />
        <BtnRouteInternal
          v-else-if="group"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.join-group"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-group-aria-label"
        />
      </div>
    </div>
    <div v-if="organization" class="mt-4">
      <div v-if="organization.workingGroups">
        <p>
          {{ $t("components.card-get-involved.working-groups-subtext") }}
          {{ organization.name }}:
        </p>
        <Feed
          :feedItemNames="organization.workingGroups"
          :feedItemURLs="organization.workingGroups"
        />
      </div>
      <div v-else>
        <p>
          {{ $t("components.card-get-involved.join-organization-subtext") }}
          {{ organization.name }}.
        </p>
      </div>
    </div>
    <div v-else-if="group" class="space-y-3 pt-3">
      <p>
        {{ $t("components.card-get-involved.join-group-subtext") }}
        {{ group.name }}.
      </p>
    </div>
    <div v-else-if="event" class="space-y-3 pt-3">
      <p>
        {{ event.getInvolvedDescription }}
      </p>
      <p>
        {{ $t("components.card-get-involved.legal-disclaimer-subtext") }}
      </p>
      <CardLegalDisclaimer v-if="disclaimer" :disclaimer="disclaimer" />
      <div class="flex w-max pt-2">
        <BtnRouteInternal
          class="w-full"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.offer-to-help"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";

defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  disclaimer?: string;
}>();

const { id } = useRoute().params;
</script>
