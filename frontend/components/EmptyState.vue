<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex w-full flex-col items-center bg-layer-0">
    <PageContent
      :imgUrl="BOOTSTRAP_CLOUD_MOON_URL"
      imgAltText="i18n.components.empty_state.img_alt_text"
    >
      <div>
        <!-- Header -->
        <h2 v-if="pageType == 'organizations'">
          {{ $t("i18n.components.empty_state.organizations_header") }}
        </h2>
        <h2 v-if="pageType == 'groups'">
          {{ $t("i18n.components.empty_state.groups_header") }}
        </h2>
        <h2 v-if="pageType == 'events'">
          {{ $t("i18n.components.empty_state.events_header") }}
        </h2>
        <h2 v-if="pageType == 'resources'">
          {{ $t("i18n.components.empty_state.resources_header") }}
        </h2>
        <h2 v-if="pageType == 'faq'">
          {{ $t("i18n.components.empty_state.faq_header") }}
        </h2>
        <h2 v-if="pageType == 'team'">
          {{ $t("i18n.components.empty_state.team_header") }}
        </h2>
        <h2 v-if="pageType == 'affiliates'">
          {{ $t("i18n.components.empty_state.affiliates_header") }}
        </h2>
        <h2 v-if="pageType == 'tasks'">
          {{ $t("i18n.components.empty_state.tasks_header") }}
        </h2>
        <h2 v-if="pageType == 'discussions'">
          {{ $t("i18n.components.empty_state.discussions_header") }}
        </h2>
        <!-- Message -->
        <div v-if="!permission" class="flex flex-col space-y-6 py-6">
          <h4>
            {{ $t("i18n.components.empty_state.message_no_permission") }}
          </h4>
          <PageCommunityFooter
            header="i18n.components.empty_state.cta_header_no_permission"
          >
            <BtnRouteInternal
              class="w-full"
              :cta="false"
              label="i18n._global.return_home"
              linkTo="/home"
              fontSize="lg"
              ariaLabel="i18n._global.return_home_aria_label"
            />
          </PageCommunityFooter>
        </div>
        <div v-else class="flex flex-col space-y-6 py-6">
          <h4>
            {{ $t("i18n.components.empty_state.message_with_permission") }}
          </h4>
          <div
            class="mx-auto grid max-w-[70%] grid-cols-1 gap-y-4 pb-6 sm:mx-0 sm:max-w-[90%] sm:grid-cols-2 sm:grid-rows-1 sm:gap-x-4 sm:gap-y-0 md:max-w-[70%] md:gap-x-6 lg:max-w-[60%] xl:max-w-[50%] xl:gap-x-8 2xl:max-w-[80%]"
          >
            <BtnRouteInternal
              v-if="pageType == 'organizations'"
              class="w-full"
              :cta="true"
              label="i18n.components.empty_state.create_organization"
              linkTo="/organizations/create"
              fontSize="lg"
              ariaLabel="i18n.components.empty_state.create_organization_aria_label"
            />
            <BtnRouteInternal
              v-if="pageType == 'groups'"
              class="w-full"
              :cta="true"
              label="i18n._global.create_group"
              linkTo="/groups/create"
              fontSize="lg"
              ariaLabel="i18n.components.empty_state.create_group_aria_label"
            />
            <BtnRouteInternal
              v-if="pageType == 'events'"
              class="w-full"
              :cta="true"
              label="i18n.components.empty_state.create_event"
              linkTo="/events/create"
              fontSize="lg"
              ariaLabel="i18n.components.empty_state.create_event_aria_label"
            />
            <BtnRouteInternal
              v-if="pageType == 'resources'"
              class="w-full"
              :cta="true"
              label="i18n._global.create_resource"
              linkTo="/resources/create"
              fontSize="lg"
              ariaLabel="i18n.components.empty_state.create_resource_aria_label"
            />
          </div>
          <PageCommunityFooter
            header="i18n.components.empty_state.cta_header_no_permission"
            :helpNeeded="true"
          >
            <BtnRouteInternal
              class="w-full"
              :cta="false"
              label="i18n._global.return_home"
              linkTo="/home"
              fontSize="lg"
              ariaLabel="i18n._global.return_home_aria_label"
            />
          </PageCommunityFooter>
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pageType:
    | "organizations"
    | "groups"
    | "events"
    | "resources"
    | "faq"
    | "team"
    | "affiliates"
    | "tasks"
    | "discussions";
  permission: boolean;
}>();
</script>
