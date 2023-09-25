<template>
  <div class="grid grid-cols-2 gap-3 lg:gap-4 lg:grid-cols-4">
    <CardMetric
      :text="$t('components.grid-home-metrics.events')"
      number="123"
      textColor="text-light-text dark:text-dark-text"
      borderColor="border-light-text dark:border-dark-text"
      backgroundColor="bg-light-distinct dark:bg-dark-distinct hover:bg-light-highlight dark:hover:bg-dark-highlight active:bg-light-distinct active:dark:bg-dark-distinct"
    />
    <CardMetric
      :text="$t('components.grid-home-metrics.act-events')"
      number="100"
      textColor="text-light-text dark:text-dark-act-red"
      borderColor="border-light-text dark:border-dark-act-red"
      backgroundColor="bg-light-act-red/60 dark:bg-dark-act-red/20 hover:bg-light-act-red/50 hover:dark:bg-dark-act-red/30 active:bg-light-act-red/60 active:dark:bg-dark-act-red/20"
    />
    <CardMetric
      :text="$t('components.grid-home-metrics.learn-events')"
      number="23"
      textColor="text-light-text dark:text-dark-learn-blue"
      borderColor="border-light-text dark:border-dark-learn-blue"
      backgroundColor="bg-light-learn-blue/60 dark:bg-dark-learn-blue/20 hover:bg-light-learn-blue/50 hover:dark:bg-dark-learn-blue/30 active:bg-light-learn-blue/60 active:dark:bg-dark-learn-blue/20"
    />
    <CardMetric
      :text="$t('components.grid-home-metrics.new-organizations')"
      number="10"
      textColor="text-light-text dark:text-dark-accepted-green"
      borderColor="border-light-text dark:border-dark-accepted-green"
      backgroundColor="bg-light-accepted-green/60 dark:bg-dark-accepted-green/20 hover:bg-light-accepted-green/50 dark:hover:bg-dark-accepted-green/30 active:bg-light-accepted-green/60 active:dark:bg-dark-accepted-green/20"
    />
  </div>
</template>
