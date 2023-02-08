<template>
  <div
    class="flex items-center justify-center px-1 py-1 mx-3 space-x-2 border rounded-md select-none bg-light-header dark:bg-dark-header border-light-special-text dark:border-dark-special-text text-light-special-text dark:text-dark-special-text"
  >
    <Icon name="bi:search" size="1.25em" />
    <input
      class="w-16 bg-transparent outline-none"
      type="text"
      placeholder="Search"
    />
    <div class="flex space-x-1">
      <div
        class="w-6 h-6 text-center border rounded-md border-light-special-text dark:border-dark-special-text"
      >
        /
      </div>
      <div
        class="w-6 h-6 text-center border rounded-md border-light-special-text dark:border-dark-special-text"
      >
        k
      </div>
    </div>
  </div>
</template>
