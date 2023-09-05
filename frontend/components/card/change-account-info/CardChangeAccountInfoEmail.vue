<template>
  <div class="pb-1 space-y-4 md:grow">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <h2 class="font-bold responsive-h3">Change email</h2>
    </div>

    <!-- Labels & input -->
    <div class="flex gap-4">
      <div class="flex flex-col w-1/3">
        <label for="old-email" class="font-bold responsive-h3"
          >Old email *</label
        >
        <input
          class="mb-0 peer appearance-none w-11/12 h-[1.375rem] border border-black rounded-sm bg-transparent dark:bg-transparent py-4 px-3 dark:border-dark-text"
          id="old-email"
          placeholder="Enter desired username"
        />
      </div>
      <div class="flex flex-col w-1/3">
        <label for="new-email" class="font-bold responsive-h3"
          >Enter new email *</label
        >
        <input
          class="mb-0 peer appearance-none w-11/12 h-[1.375rem] border border-black rounded-sm bg-transparent dark:bg-transparent py-4 px-3 dark:border-dark-text"
          id="new-email"
          placeholder="Enter your password"
        />
      </div>
      <div class="flex flex-col w-1/3">
        <label for="password" class="font-bold responsive-h3"
          >Enter password *</label
        >
        <input
          class="mb-0 peer appearance-none w-11/12 h-[1.375rem] border border-black rounded-sm bg-transparent dark:bg-transparent py-4 px-3 dark:border-dark-text"
          id="password"
          placeholder="Enter your password"
        />
      </div>
    </div>
  </div>
</template>
