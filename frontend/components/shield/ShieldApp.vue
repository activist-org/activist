<template>
  <a
    class="flex items-center px-3 py-2 space-x-2 card-style focus-brand text-light-text dark:text-dark-text border-light-text dark:border-dark-text bg-light-content dark:bg-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight"
    :href="href"
    target="_blank"
  >
    <slot></slot>
  </a>
</template>
