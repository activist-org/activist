<template>
  <div class="flex w-full flex-col items-center bg-brand text-brand">
    <PageContent :imgUrl="BOOTSTRAP_CLOUD_MOON_URL" imgAltText="components.empty_state.img_alt_text">
      <div>
        <span v-if="headers[pageType]" class="responsive-h2">
          {{ $t(headers[pageType]) }}
        </span>
        <div v-if="!permission" class="flex flex-col space-y-6 py-6">
          <span class="responsive-h4">{{ $t("components.empty_state.message_no_permission") }}</span>
          <PageCommunityFooter header="components.empty_state.cta_header_no_permission">
            <BtnRouteInternal class="w-full" :cta="false" label="_global.return_home" linkTo="/home" fontSize="lg" ariaLabel="_global.return_home_aria_label" />
          </PageCommunityFooter>
        </div>
        <div v-else class="flex flex-col space-y-6 py-6">
          <span class="responsive-h4">{{ $t("components.empty_state.message_with_permission") }}</span>
          <div class="grid max-w-[70%] grid-cols-1 gap-y-4 pb-6 sm:grid-cols-2">
            <BtnRouteInternal
              v-for="(btn, index) in actionButtons"
              :key="index"
              class="w-full"
              :cta="true"
              :label="btn.label"
              :linkTo="btn.linkTo"
              fontSize="lg"
              :ariaLabel="btn.ariaLabel"
            />
          </div>
          <PageCommunityFooter header="components.empty_state.cta_header_no_permission" :helpNeeded="true">
            <BtnRouteInternal class="w-full" :cta="false" label="_global.return_home" linkTo="/home" fontSize="lg" ariaLabel="_global.return_home_aria_label" />
          </PageCommunityFooter>
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pageType: "organizations" | "groups" | "events" | "resources" | "faq" | "team" | "affiliates" | "tasks" | "discussions";
  permission: boolean;
}>();

const headers = {
  organizations: "components.empty_state.organizations_header",
  groups: "components.empty_state.groups_header",
  events: "components.empty_state.events_header",
  resources: "components.empty_state.resources_header",
  faq: "components.empty_state.faq_header",
  team: "components.empty_state.team_header",
  affiliates: "components.empty_state.affiliates_header",
  tasks: "components.empty_state.tasks_header",
  discussions: "components.empty_state.discussions_header",
};

const actionButtons = computed(() => {
  const buttonMap = {
    organizations: { label: "components.empty_state.create_organization", linkTo: "/organizations/create", ariaLabel: "components.empty_state.create_organization_aria_label" },
    groups: { label: "_global.create_group", linkTo: "/groups/create", ariaLabel: "components.empty_state.create_group_aria_label" },
    events: { label: "components.empty_state.create_event", linkTo: "/events/create", ariaLabel: "components.empty_state.create_event_aria_label" },
    resources: { label: "components.btn_route_internal.create_resource", linkTo: "/resources/create", ariaLabel: "components.empty_state.create_resource_aria_label" },
  };
  return buttonMap[pageType] ? [buttonMap[pageType]] : [];
});
</script>
