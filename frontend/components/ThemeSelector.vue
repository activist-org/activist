<template>
  <div>
    <button
      class="px-3 py-2 font-medium border rounded-md peer text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content border-light-text dark:border-dark-text focus:border-light-cta-orange dark:focus:border-dark-cta-orange hover:bg-light-highlight dark:hover:bg-dark-highlight focus:hover:bg-light-content dark:focus:hover:bg-dark-content"
    >
      <div class="flex items-center text-sm space-x-2">
        <Icon v-if="$colorMode.preference == 'system'" name="bi:circle-half" />
        <Icon v-if="$colorMode.preference == 'light'" name="bi:sun" />
        <Icon v-else-if="$colorMode.preference == 'dark'" name="bi:moon" />
        <p class="hidden lg:block">Theme</p>
        <p></p>
        <Icon name="bi:chevron-down" />
      </div>
    </button>
    <div class="invisible duration-200 -translate-y-1 peer-focus:visible">
      <div
        class="absolute right-0 mt-3 overflow-hidden text-sm border rounded-md xl:text-base text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content border-light-text dark:border-dark-text"
      >
        <div class="flex-col">
            <button
              class="flex items-center w-full p-1 pl-2 border-l-4 border-transparent xl:p-2 xl:pl-4 hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct dark:hover:bg-dark-distinct"
              @click="$colorMode.preference = 'system'"
            >
              <Icon name="bi:circle-half" size="1em" />
              <p class="pl-2 pr-4">System</p>
            </button>
            <button
              class="flex items-center w-full p-1 pl-2 border-l-4 border-transparent xl:p-2 xl:pl-4 hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct dark:hover:bg-dark-distinct"
              @click="$colorMode.preference = 'light'"
            >
              <Icon name="bi:sun" size="1.1em" />
              <p class="pl-2 pr-4">Light</p>
            </button>
            <button
              class="flex items-center w-full p-1 pl-2 border-l-4 border-transparent xl:p-2 xl:pl-4 hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct dark:hover:bg-dark-distinct"
              @click="$colorMode.preference = 'dark'"
            >
              <Icon name="bi:moon" size="1em" />
              <p class="pl-2 pr-4">Dark</p>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
</script>
