<template>
  <div class="flex flex-col px-5 py-4 space-y-3 card-style">
    <div class="flex items-center w-full">
      <h3 class="text-left responsive-h3 font-display grow">
        {{ $t("components.card-metics-overview.header") }}
      </h3>
      <DropdownDateFilter />
    </div>
    <div class="h-full grid grid-cols-2 gap-3 lg:gap-4 lg:grid-cols-4">
      <CardMetric
        :text="$t('_global.events')"
        :number="metrics['total events']"
        textColor="text-light-text dark:text-dark-text"
        borderColor="border-light-text dark:border-dark-text"
        backgroundColor="bg-light-layer-1 dark:bg-dark-layer-1 hover:bg-light-highlight dark:hover:bg-dark-highlight active:bg-light-layer-1 active:dark:bg-dark-layer-1"
      />
      <CardMetric
        :text="$t('components.card-metrics-overview.action')"
        :number="metrics['action events']"
        textColor="text-light-text dark:text-dark-action-red"
        borderColor="border-light-text dark:border-dark-action-red"
        backgroundColor="bg-light-action-red/60 dark:bg-dark-action-red/20 hover:bg-light-action-red/50 hover:dark:bg-dark-action-red/30 active:bg-light-action-red/60 active:dark:bg-dark-action-red/20"
      />
      <CardMetric
        :text="$t('components.card-metrics-overview.learn')"
        :number="metrics['learn events']"
        textColor="text-light-text dark:text-dark-learn-blue"
        borderColor="border-light-text dark:border-dark-learn-blue"
        backgroundColor="bg-light-learn-blue/60 dark:bg-dark-learn-blue/20 hover:bg-light-learn-blue/50 hover:dark:bg-dark-learn-blue/30 active:bg-light-learn-blue/60 active:dark:bg-dark-learn-blue/20"
      />
      <CardMetric
        :text="$t('components.card-metrics-overview.new-organizations')"
        :number="metrics['new orgs']"
        textColor="text-light-text dark:text-dark-accepted-green"
        borderColor="border-light-text dark:border-dark-accepted-green"
        backgroundColor="bg-light-accepted-green/60 dark:bg-dark-accepted-green/20 hover:bg-light-accepted-green/50 dark:hover:bg-dark-accepted-green/30 active:bg-light-accepted-green/60 active:dark:bg-dark-accepted-green/20"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Metrics {
  [key: string]: number;
}

defineProps<{
  metrics: Metrics;
}>();
</script>
