<template>
  <div class="grid grid-cols-2 gap-3 lg:gap-4 lg:grid-cols-4">
    <CardMetric
      :text="$t('components.grid.grid-home-metrics.new-organizations')"
      number="10"
      textColor="text-light-header dark:text-dark-header"
      borderColor="border-light-header dark:border-dark-header"
      backgroundColor="bg-light-menu-selection dark:bg-dark-menu-selection hover:bg-light-menu-selection/80 dark:hover:bg-dark-menu-selection/80"
    />

    <CardMetric
      :text="$t('components.grid.grid-home-metrics.events')"
      number="123"
      textColor="text-light-text dark:text-dark-text"
      borderColor="border-light-text dark:border-dark-text"
      backgroundColor="bg-light-distinct dark:bg-dark-distinct hover:bg-light-highlight dark:hover:bg-dark-highlight"
    />

    <CardMetric
      :text="$t('components.grid.grid-home-metrics.act-events')"
      number="100"
      textColor="text-light-act-red dark:text-dark-act-red"
      borderColor="border-light-act-red dark:border-dark-act-red"
      backgroundColor="bg-light-act-red/20 dark:bg-dark-act-red/40 hover:bg-light-act-red/30 hover:dark:bg-dark-act-red/50"
    />

    <CardMetric
      :text="$t('components.grid.grid-home-metrics.learn-events')"
      number="23"
      textColor="text-light-learn-blue dark:text-dark-learn-blue"
      borderColor="border-light-learn-blue dark:border-dark-learn-blue"
      backgroundColor="bg-light-learn-blue/20 dark:bg-dark-learn-blue/40 hover:bg-light-learn-blue/30 hover:dark:bg-dark-learn-blue/50"
    />
  </div>
</template>

<script setup lang="ts"></script>
