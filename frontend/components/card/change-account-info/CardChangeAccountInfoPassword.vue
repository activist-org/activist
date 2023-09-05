<template>
  <div class="pb-1 space-y-4 md:grow">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <h2 class="font-bold responsive-h3">Change password</h2>
    </div>

    <!-- Labels & input -->
    <div class="flex gap-4">
      <div class="flex flex-col w-1/3">
        <label for="current-password" class="font-bold responsive-h3 pb-2"
          >Current password *</label
        >
        <input
          class="mb-0 peer appearance-none w-11/12 h-[1.375rem] border border-black rounded-sm bg-transparent dark:bg-transparent py-4 px-3 dark:border-dark-text"
          id="current-password"
          placeholder="Enter current password"
        />
      </div>
      <div class="flex flex-col w-1/3">
        <label for="new-password" class="font-bold responsive-h3 pb-2"
          >New password *</label
        >
        <input
          class="mb-0 peer appearance-none w-11/12 h-[1.375rem] border border-black rounded-sm bg-transparent dark:bg-transparent py-4 px-3 dark:border-dark-text"
          id="password"
          placeholder="Enter new password"
        />
      </div>
      <div class="flex flex-col w-1/3">
        <label for="repeat-password" class="font-bold responsive-h3 pb-2"
          >Repeat password *</label
        >
        <input
          class="mb-0 peer appearance-none w-11/12 h-[1.375rem] border border-black rounded-sm bg-transparent dark:bg-transparent py-4 px-3 dark:border-dark-text"
          id="confirm-password"
          placeholder="Repeat new password"
        />
      </div>
    </div>
  </div>
</template>
