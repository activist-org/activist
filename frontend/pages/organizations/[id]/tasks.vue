<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title
        >{{ organization.name }}&nbsp;{{ $t("_global.tasks_lower") }}</Title
      >
    </Head>
    <HeaderAppPage
      :organization="organization"
      :header="organization.name + ' ' + $t('_global.tasks_lower')"
      :tagline="$t('pages._global.tasks_page_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn_action.new_task"
          fontSize="sm"
          :leftIcon="IconMap.PLUS"
          iconSize="1.35em"
          ariaLabel="components.btn_action.new_task_aria_label"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-3 py-4"></div>
    <PagePreviewTasks />
    <!-- <div v-if="organization.tasks" class="space-y-3 py-4"></div>
    <EmptyState v-else pageType="tasks" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { testTechOrg } from "~/utils/testEntities";

const organization = testTechOrg;
</script>
