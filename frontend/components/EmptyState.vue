<template>
  <div class="flex w-full flex-col items-center pb-6 md:pb-10">
    <!-- Note: image on top of content. -->
    <img
      class="mb-4 h-40 sm:h-52 md:hidden"
      :src="imgURL + '_' + $colorMode.value + '.png'"
      :alt="$t(imgAltText)"
    />
    <div class="grid w-full grid-cols-1 2xl:grid-cols-2">
      <div class="items-center space-y-4 text-left md:items-start">
        <!-- Note: image floating right of content. -->
        <img
          class="float-right hidden h-52 p-4 md:block lg:h-64 2xl:hidden"
          :src="imgURL + '_' + $colorMode.value + '.png'"
          :alt="$t(imgAltText)"
        />
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
                label="components.btn-route-internal.apply-to-join"
                linkTo="/organizations/create"
                fontSize="lg"
                ariaLabel="components.btn-route-internal.apply-to-join-aria-label"
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
      </div>
      <div class="flex justify-end pr-32">
        <!-- Note: image right of content. -->
        <img
          class="hidden h-72 2xl:block"
          :src="imgURL + '_' + $colorMode.value + '.png'"
          :alt="$t(imgAltText)"
        />
      </div>
    </div>
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

const imgURL = "/images/content_pages/icons/bootstrap_cloud_moon";
const imgAltText = "components.empty-state.img-alt-text";
</script>
