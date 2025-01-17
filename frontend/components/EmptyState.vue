<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex w-full flex-col items-center bg-layer-0 text-primary-text">
    <PageContent
      :imgUrl="BOOTSTRAP_CLOUD_MOON_URL"
      imgAltText="components.empty_state.img_alt_text"
    >
      <div>
        <!-- Header -->
        <span v-if="pageType == 'organizations'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.organizations_header)
        }}</span>
        <span v-if="pageType == 'groups'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.groups_header)
        }}</span>
        <span v-if="pageType == 'events'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.events_header)
        }}</span>
        <span v-if="pageType == 'resources'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.resources_header)
        }}</span>
        <span v-if="pageType == 'faq'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.faq_header)
        }}</span>
        <span v-if="pageType == 'team'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.team_header)
        }}</span>
        <span v-if="pageType == 'affiliates'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.affiliates_header)
        }}</span>
        <span v-if="pageType == 'tasks'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.tasks_header)
        }}</span>
        <span v-if="pageType == 'discussions'" class="responsive-h2">{{
          $t(i18nMap.components.empty_state.discussions_header)
        }}</span>
        <!-- Message -->
        <div v-if="!permission" class="flex flex-col space-y-6 py-6">
          <span class="responsive-h4">{{
            $t(i18nMap.components.empty_state.message_no_permission)
          }}</span>
          <PageCommunityFooter
            header="components.empty_state.cta_header_no_permission"
            ><BtnRouteInternal
              class="w-full"
              :cta="false"
              label="_global.return_home"
              linkTo="/home"
              fontSize="lg"
              ariaLabel="_global.return_home_aria_label"
          /></PageCommunityFooter>
        </div>
        <div v-else class="flex flex-col space-y-6 py-6">
          <span class="responsive-h4">{{
            $t(i18nMap.components.empty_state.message_with_permission)
          }}</span>
          <div
            class="mx-auto grid max-w-[70%] grid-cols-1 gap-y-4 pb-6 sm:mx-0 sm:max-w-[90%] sm:grid-cols-2 sm:grid-rows-1 sm:gap-x-4 sm:gap-y-0 md:max-w-[70%] md:gap-x-6 lg:max-w-[60%] xl:max-w-[50%] xl:gap-x-8 2xl:max-w-[80%]"
          >
            <BtnRouteInternal
              v-if="pageType == 'organizations'"
              class="w-full"
              :cta="true"
              label="components.empty_state.create_organization"
              linkTo="/organizations/create"
              fontSize="lg"
              ariaLabel="components.empty_state.create_organization_aria_label"
            />
            <BtnRouteInternal
              v-if="pageType == 'groups'"
              class="w-full"
              :cta="true"
              label="_global.create_group"
              linkTo="/groups/create"
              fontSize="lg"
              ariaLabel="components.empty_state.create_group_aria_label"
            />
            <BtnRouteInternal
              v-if="pageType == 'events'"
              class="w-full"
              :cta="true"
              label="components.empty_state.create_event"
              linkTo="/events/create"
              fontSize="lg"
              ariaLabel="components.empty_state.create_event_aria_label"
            />
            <BtnRouteInternal
              v-if="pageType == 'resources'"
              class="w-full"
              :cta="true"
              label="components.btn_route_internal.create_resource"
              linkTo="/resources/create"
              fontSize="lg"
              ariaLabel="components.empty_state.create_resource_aria_label"
            />
          </div>
          <PageCommunityFooter
            header="components.empty_state.cta_header_no_permission"
            :helpNeeded="true"
            ><BtnRouteInternal
              class="w-full"
              :cta="false"
              label="_global.return_home"
              linkTo="/home"
              fontSize="lg"
              ariaLabel="_global.return_home_aria_label"
          /></PageCommunityFooter>
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from '~/types/i18n-map';

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
