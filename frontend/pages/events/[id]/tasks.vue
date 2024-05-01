<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}&nbsp;{{ $t("_global.tasks_lower") }}</Title>
    </Head>
    <HeaderAppPage
      :event="event"
      :header="event.name + ' ' + $t('_global.tasks_lower')"
      :tagline="$t('pages._global.tasks-page-tagline')"
      :underDevelopment="true"
    >
      <div class="flex space-x-2 lg:space-x-3">
        <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.new-task"
          fontSize="sm"
          leftIcon="bi:plus-lg"
          iconSize="1.35em"
          ariaLabel="components.btn-action.new-task-aria-label"
        />
      </div>
    </HeaderAppPage>
    <!-- <div v-if="event.tasks" class="space-y-3 py-4"></div>
    <EmptyState v-else pageType="tasks" :permission="false" /> -->
  </div>
</template>

<script setup lang="ts">
import { testClimateEvent } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const event = testClimateEvent;
</script>
