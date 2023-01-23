<template>
  <div>
    <button
      class="px-4 py-2 font-medium border rounded-md peer text-light-text dark:text-dark-text bg-light-content-bg dark:bg-dark-content-bg border-light-text dark:border-dark-text focus:border-light-cta-orange dark:focus:border-dark-cta-orange hover:bg-light-highlight dark:hover:bg-dark-highlight focus:hover:bg-light-content-bg dark:focus:hover:bg-dark-content-bg"
    >
      <div class="flex items-center">
        <Icon v-if="$colorMode.value == 'system'" name="bi:circle-half" size="1em" />
        <Icon v-else-if="$colorMode.value == 'light'" name="bi:sun" size="1em" />
        <Icon v-else-if="$colorMode.value == 'dark'" name="bi:moon" size="1em" />
        <p class="pl-2">Theme</p>
      </div>
    </button>
    <div class="invisible duration-200 -translate-y-1 peer-focus:visible">
      <div
        class="absolute right-0 mt-3 overflow-hidden border rounded-md text-light-text dark:text-dark-text bg-light-content-bg dark:bg-dark-content-bg border-light-text dark:border-dark-text"
      >
        <ul>
          <li
            class="w-32 p-2 pl-4 border-l-4 border-transparent hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct-bg dark:hover:bg-dark-distinct-bg"
          >
            <button class="flex items-center" @click="$colorMode.value = 'system'">
              <Icon name="bi:circle-half" size="1em" />
              <p class="pl-2 pr-4">System</p>
            </button>
          </li>
          <li
            class="w-32 p-2 pl-4 border-l-4 border-transparent hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct-bg dark:hover:bg-dark-distinct-bg"
          >
            <button class="flex items-center" @click="$colorMode.value = 'light'">
              <Icon name="bi:sun" size="1em" />
              <p class="pl-2 pr-4">Light</p>
            </button>
          </li>
          <li
            class="w-32 p-2 pl-4 border-l-4 border-transparent hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct-bg dark:hover:bg-dark-distinct-bg"
          >
            <button class="flex items-center" @click="$colorMode.value = 'dark'">
              <Icon name="bi:moon" size="1em" />
              <p class="pl-2 pr-4">Dark</p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
</script>
