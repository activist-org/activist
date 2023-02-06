<template>
  <header class="sticky top-0 w-48 bg-light-header dark:bg-dark-header">
    <div class="flex pt-4 pb-2 pl-6">
      <div class="relative z-0 w-32 h-8">
        <LogosActivist
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>
      <div class="absolute -right-3">
        <button
          class="items-center justify-center border-2 rounded-full w-7 h-7 bg-light-interactive dark:bg-dark-interactive border-light-content dark:border-dark-content hover:bg-light-distinct dark:hover:bg-dark-distinct active:bg-light-interactive dark:active:bg-dark-interactive text-light-content dark:text-dark-content"
        >
          <div class="pr-[2px] pb-[2px]">
            <Icon name="bi:chevron-left" size="1.25em" />
          </div>
        </button>
      </div>
    </div>
  </header>
</template>
