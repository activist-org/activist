<template>
  <div
    class="flex px-1 py-1 mx-3 space-x-2 bg-light-header dark:bg-dark-header border border-light-special-text dark:border-dark-special-text rounded-md text-light-special-text dark:text-dark-special-text justify-center items-center select-none"
  >
    <Icon name="bi:search" size="1.25em" />
    <input
      class="w-16 outline-none bg-transparent"
      type="text"
      placeholder="Search"
    />
    <div class="flex space-x-1">
      <div
        class="border w-6 h-6 border-light-special-text dark:border-dark-special-text rounded-md text-center"
      >
        /
      </div>
      <div
        class="border w-6 h-6 border-light-special-text dark:border-dark-special-text rounded-md text-center"
      >
        k
      </div>
    </div>
  </div>
</template>
