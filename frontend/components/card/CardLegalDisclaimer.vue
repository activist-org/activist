<template>
  <div
    class="flex items-center px-4 py-2 border select-none space-x-3 rounded-md border-light-section-div dark:border-dark-section-div bg-light-header dark:bg-dark-header active:bg-light-highlight dark:active:bg-dark-highlight"
  >
    <Icon name="IconLegal" class="fill-light-text dark:fill-dark-text" />
    <p>{{ $t("components.card.card-legal-disclaimer.title") }}</p>
    <Icon name="bi:chevron-up" />
  </div>
</template>
