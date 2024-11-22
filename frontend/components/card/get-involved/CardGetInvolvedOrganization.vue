<template>
  <CardGetInvolved>
    <div class="flex flex-col md:flex-row">
      <div class="flex items-center gap-5">
        <h3 class="responsive-h3 text-left font-display">
          {{ $t("components._global.get_involved") }}
        </h3>
        <IconEdit
          v-if="userIsSignedIn"
          @click="openModalEditAboutOrganization()"
          @keydown.enter="openModalEditAboutOrganization()"
        />
      </div>
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="organization.groups && organization.groups.length > 0"
          :cta="true"
          :linkTo="'/organizations/' + id + '/groups'"
          label="components.card_get_involved_organization.view_all_groups"
          fontSize="sm"
          ariaLabel="components.card_get_involved_organization.view_all_groups_aria_label"
        />
        <BtnRouteInternal
          v-if="organization && organization.getInvolvedUrl"
          :cta="true"
          :linkTo="organization.getInvolvedUrl"
          label="_global.join_organization"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="_global.join_organization_aria_label"
        />
      </div>
      <ModalEditAboutOrganization
        :organization="organization"
        :description="organization.description"
        :getInvolved="organization.getInvolved"
        :getInvolvedUrl="organization.getInvolvedUrl"
      />
    </div>
    <div class="mt-4">
      <div v-if="organization.groups && organization.groups.length > 0">
        <p>
          {{
            $t("components._global.working_groups_subtext", {
              entity_name: organization.name,
            })
          }}:
        </p>
        <Feed :organization="organization" />
      </div>
      <div v-else-if="organization.getInvolvedUrl">
        <p v-if="organization.getInvolved">
          {{ organization.getInvolved }}
        </p>
        <p v-else>
          {{
            $t("components._global.join_organization_subtext", {
              entity_name: organization.name,
            })
          }}
        </p>
      </div>
      <div v-else>
        <p>
          {{
            $t(
              "components.card_get_involved_organization.join_organization_no_info",
              {
                entity_name: organization.name,
              }
            )
          }}
        </p>
      </div>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalEditAboutOrganization } = useModalHandlers(
  "ModalEditAboutOrganization"
);

const { userIsSignedIn } = useUser();

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(id);

const { organization } = organizationStore;
</script>
