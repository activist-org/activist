<template>
  <div
    class="flex items-center justify-center px-1 py-1 mx-3 border select-none space-x-2 bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text rounded-md text-light-special-text dark:text-dark-special-text"
  >
    <Icon name="bi:search" size="1.25em" />
    <input
      class="w-16 bg-transparent outline-none"
      type="text"
      placeholder="Search"
    />
    <div class="flex space-x-1">
      <div
        class="w-6 h-6 text-center border border-light-special-text dark:border-dark-special-text rounded-md"
      >
        /
      </div>
      <div
        class="w-6 h-6 text-center border border-light-special-text dark:border-dark-special-text rounded-md"
      >
        k
      </div>
    </div>
  </div>
</template>
