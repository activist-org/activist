<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardGetInvolved>
    <div class="flex flex-col md:flex-row">
      <div class="flex items-center gap-5">
        <h3 class="responsive-h3 text-left font-display">
          {{ $t("i18n.components._global.get_involved") }}
        </h3>
        <IconEdit
          v-if="userIsSignedIn"
          @click="openModalEditTextOrganization()"
          @keydown.enter="openModalEditTextOrganization()"
        />
      </div>
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="organization.groups && organization.groups.length > 0"
          :cta="true"
          :linkTo="'/organizations/' + orgId + '/groups'"
          label="i18n.components.card_get_involved_organization.view_all_groups"
          fontSize="sm"
          ariaLabel="i18n.components.card_get_involved_organization.view_all_groups_aria_label"
        />
        <BtnRouteInternal
          v-if="organization && organization.getInvolvedUrl"
          :cta="true"
          :linkTo="organization.getInvolvedUrl"
          label="i18n._global.join_organization"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="i18n._global.join_organization_aria_label"
        />
      </div>
    </div>
    <div class="mt-4">
      <div v-if="organization.groups && organization.groups.length > 0">
        <p>
          {{
            $t("i18n.components._global.working_groups_subtext", {
              entity_name: organization.name,
            })
          }}:
        </p>
        <Feed :organization="organization" />
      </div>
      <div v-else-if="organization.getInvolvedUrl">
        <p v-if="organization.texts.getInvolved">
          {{ organization.texts.getInvolved }}
        </p>
        <p v-else>
          {{
            $t("i18n.components._global.join_organization_subtext", {
              entity_name: organization.name,
            })
          }}
        </p>
      </div>
      <div v-else>
        <p>
          {{
            $t(
              "i18n.components.card_get_involved_organization.join_organization_no_info",
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
import { IconMap } from "~/types/icon-map";

const { openModal: openModalEditTextOrganization } = useModalHandlers(
  "ModalEditTextOrganization"
);

const { userIsSignedIn } = useUser();

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;
</script>
