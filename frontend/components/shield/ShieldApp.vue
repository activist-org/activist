<template>
  <a
    class="card-style focus-brand text-light-text dark:text-dark-text border-light-text dark:border-dark-text bg-light-layer-0 dark:bg-dark-layer-0 hover:bg-light-highlight dark:hover:bg-dark-highlight flex items-center space-x-2 px-3 py-2"
    :href="href"
    target="_blank"
  >
    <slot></slot>
  </a>
</template>
