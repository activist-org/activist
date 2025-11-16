<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>
        {{ organization.name }}&nbsp;{{
          $t("i18n.pages._global.tasks.tasks_lower")
        }}
      </Title>
    </Head>
    <HeaderAppPageOrganization
      :header="
        organization.name + ' ' + $t('i18n.pages._global.tasks.tasks_lower')
      "
      :tagline="$t('i18n.pages._global.tasks.tasks_page_tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          ariaLabel="i18n.pages._global.tasks.new_task_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.35em"
          label="i18n.pages._global.tasks.new_task"
          :leftIcon="IconMap.PLUS"
        />
      </div>
    </HeaderAppPageOrganization>
    <div class="space-y-3 py-4"></div>
    <!-- <div v-if="organization.tasks" class="space-y-3 py-4"></div>
    <EmptyState v-else pageType="tasks" :permission="false" class="py-4" /> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  organization: Organization;
}>();
</script>
