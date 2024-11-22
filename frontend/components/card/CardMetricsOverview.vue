<template>
  <div class="card-style flex flex-col space-y-3 px-5 py-4">
    <div class="flex w-full items-center">
      <h3 class="responsive-h3 grow text-left font-display">
        {{ $t("components.card_metrics_overview.header") }}
      </h3>
      <DropdownDateFilter />
    </div>
    <div class="grid h-full grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <CardMetric
        :text="$t('_global.events')"
        :number="metrics['total events']"
        textColor="text-primary-text"
        borderColor="border-primary-text"
        backgroundColor="bg-layer-1 hover:bg-highlight active:bg-layer-1 active:dark:bg-layer-1"
      />
      <CardMetric
        :text="$t('components.card_metrics_overview.action')"
        :number="metrics['action events']"
        textColor="text-primary-text dark:text-action-red"
        borderColor="border-primary-text dark:border-action-red"
        backgroundColor="bg-action-red/60 dark:bg-action-red/20 hover:bg-action-red/50 hover:dark:bg-action-red/30 active:bg-action-red/60 active:dark:bg-action-red/20"
      />
      <CardMetric
        :text="$t('components.card_metrics_overview.learn')"
        :number="metrics['learn events']"
        textColor="text-primary-text dark:text-learn-blue"
        borderColor="border-primary-text dark:border-learn-blue"
        backgroundColor="bg-learn-blue/60 dark:bg-learn-blue/20 hover:bg-learn-blue/50 hover:dark:bg-learn-blue/30 active:bg-learn-blue/60 active:dark:bg-learn-blue/20"
      />
      <CardMetric
        :text="$t('components.card_metrics_overview.new_organizations')"
        :number="metrics['new orgs']"
        textColor="text-primary-text dark:text-accepted-green"
        borderColor="border-primary-text dark:border-accepted-green"
        backgroundColor="bg-accepted-green/60 dark:bg-accepted-green/20 hover:bg-accepted-green/50 dark:hover:bg-accepted-green/30 active:bg-accepted-green/60 active:dark:bg-accepted-green/20"
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
