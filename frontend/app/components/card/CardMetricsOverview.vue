<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="card-style flex flex-col space-y-3 px-5 py-4">
    <div class="flex w-full items-center">
      <h3 class="grow text-left font-display">
        {{ $t("i18n.components.card_metrics_overview.header") }}
      </h3>
      <DropdownDateFilter />
    </div>
    <div class="grid h-full grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <CardMetric
        backgroundColor="bg-layer-1 hover:bg-highlight active:bg-layer-1 active:dark:bg-layer-1"
        borderColor="border-primary-text"
        :number="metrics['total events']"
        :text="$t('i18n._global.events')"
        textColor="text-primary-text"
      />
      <CardMetric
        backgroundColor="bg-action-red/60 dark:bg-action-red/20 hover:bg-action-red/50 dark:hover:bg-action-red/30 active:bg-action-red/60 active:dark:bg-action-red/20"
        borderColor="border-primary-text dark:border-action-red"
        :number="metrics['action events']"
        :text="$t('i18n.components._global.action')"
        textColor="text-primary-text dark:text-action-red"
      />
      <CardMetric
        backgroundColor="bg-learn-blue/60 dark:bg-learn-blue/20 hover:bg-learn-blue/50 dark:hover:bg-learn-blue/30 active:bg-learn-blue/60 active:dark:bg-learn-blue/20"
        borderColor="border-primary-text dark:border-learn-blue"
        :number="metrics['learn events']"
        :text="$t('i18n.components._global.learn')"
        textColor="text-primary-text dark:text-learn-blue"
      />
      <CardMetric
        backgroundColor="bg-accepted-green/60 dark:bg-accepted-green/20 hover:bg-accepted-green/50 dark:hover:bg-accepted-green/30 active:bg-accepted-green/60 active:dark:bg-accepted-green/20"
        borderColor="border-primary-text dark:border-accepted-green"
        :number="metrics['new orgs']"
        :text="$t('i18n.components.card_metrics_overview.new_organizations')"
        textColor="text-primary-text dark:text-accepted-green"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type MetricKeys =
  | "total events"
  | "action events"
  | "learn events"
  | "new orgs";

type Metrics = Record<MetricKeys, number>;

defineProps<{
  metrics: Metrics;
}>();
</script>
