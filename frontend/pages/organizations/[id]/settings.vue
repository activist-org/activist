<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{
          $t("_global.affiliates_lower")
        }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.affiliates_lower')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.save-settings"
          fontSize="sm"
          ariaLabel="components.btn-action.save-settings-aria-label"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
      <CardDangerZone
        :description="
          $t('components.card-danger-zone.delete-organization-text')
        "
        :ctaBtnText="$t('components.card-danger-zone.delete-organization-cta')"
        :ctaBtnAriaLabel="
          $t('components.card-danger-zone.delete-organization-cta-aria-label')
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { testTechOrg } from "~/utils/testEntities";

const organization = testTechOrg;
</script>
