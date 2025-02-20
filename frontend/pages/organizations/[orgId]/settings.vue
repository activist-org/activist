<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("i18n.pages._global.settings.settings_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="
        organization.name +
        ' ' +
        $t('i18n.pages._global.settings.settings_lower')
      "
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="i18n.pages._global.settings.save_settings"
          fontSize="sm"
          ariaLabel="i18n.pages._global.settings.save_settings_aria_label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div class="space-y-6 pb-6">
      <CardDangerZone
        :description="
          $t('i18n.pages.organizations.settings.danger_zone_delete_organization_text')
        "
        :ctaBtnText="$t('i18n.pages.organizations.settings.danger_zone_delete_organization_cta')"
        :ctaBtnAriaLabel="
          $t('i18n.pages.organizations.settings.danger_zone_delete_organization_cta_aria_label')
        "
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;
</script>
