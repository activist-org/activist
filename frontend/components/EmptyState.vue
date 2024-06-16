<template>
  <div
    class="flex w-full flex-col items-center bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <PageContent
      :imgURL="BOOTSTRAP_CLOUD_MOON_URL"
      imgAltText="components.empty-state.img-alt-text"
    >
      <div>
        <!-- Header -->
        <span v-if="pageType == 'organizations'" class="responsive-h2">{{
          $t("components.empty-state.organizations-header")
        }}</span>
        <span v-if="pageType == 'groups'" class="responsive-h2">{{
          $t("components.empty-state.groups-header")
        }}</span>
        <span v-if="pageType == 'events'" class="responsive-h2">{{
          $t("components.empty-state.events-header")
        }}</span>
        <span v-if="pageType == 'resources'" class="responsive-h2">{{
          $t("components.empty-state.resources-header")
        }}</span>
        <span v-if="pageType == 'faq'" class="responsive-h2">{{
          $t("components.empty-state.faq-header")
        }}</span>
        <span v-if="pageType == 'team'" class="responsive-h2">{{
          $t("components.empty-state.team-header")
        }}</span>
        <span v-if="pageType == 'affiliates'" class="responsive-h2">{{
          $t("components.empty-state.affiliates-header")
        }}</span>
        <span v-if="pageType == 'tasks'" class="responsive-h2">{{
          $t("components.empty-state.tasks-header")
        }}</span>
        <span v-if="pageType == 'discussions'" class="responsive-h2">{{
          $t("components.empty-state.discussions-header")
        }}</span>
        <!-- Message -->
        <div v-if="!permission" class="flex flex-col space-y-6 py-6">
          <span class="responsive-h4">{{
            $t("components.empty-state.message-no-permission")
          }}</span>
          <PageCommunityFooter
            header="components.empty-state.cta-header-no-permission"
            ><BtnRouteInternal
              class="w-full"
              :cta="false"
              label="components.btn-route-internal.return-home"
              linkTo="/home"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.return-home-aria-label"
          /></PageCommunityFooter>
        </div>
        <div v-else class="flex flex-col space-y-6 py-6">
          <span class="responsive-h4">{{
            $t("components.empty-state.message-with-permission")
          }}</span>
          <div
            class="mx-auto grid max-w-[70%] grid-cols-1 gap-y-4 pb-6 sm:mx-0 sm:max-w-[90%] sm:grid-cols-2 sm:grid-rows-1 sm:gap-x-4 sm:gap-y-0 md:max-w-[70%] md:gap-x-6 lg:max-w-[60%] xl:max-w-[50%] xl:gap-x-8 2xl:max-w-[80%]"
          >
            <BtnRouteInternal
              v-if="pageType == 'organizations'"
              class="w-full"
              :cta="true"
              label="_global.create-organization"
              linkTo="/organizations/create"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.create-organization-aria-label"
            />
            <BtnRouteInternal
              v-if="pageType == 'groups'"
              class="w-full"
              :cta="true"
              label="_global.create-group"
              linkTo="/groups/create"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.create-group-aria-label"
            />
            <BtnRouteInternal
              v-if="pageType == 'events'"
              class="w-full"
              :cta="true"
              label="components.btn-route-internal.create-event"
              linkTo="/events/create"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.create-event-aria-label"
            />
            <BtnRouteInternal
              v-if="pageType == 'resources'"
              class="w-full"
              :cta="true"
              label="components.btn-route-internal.create-resource"
              linkTo="/resources/create"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.create-resource-aria-label"
            />
          </div>
          <PageCommunityFooter
            header="components.empty-state.cta-header-no-permission"
            :helpNeeded="true"
            ><BtnRouteInternal
              class="w-full"
              :cta="false"
              label="components.btn-route-internal.return-home"
              linkTo="/home"
              fontSize="lg"
              ariaLabel="components.btn-route-internal.return-home-aria-label"
          /></PageCommunityFooter>
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
