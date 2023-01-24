<template>
  <div>
    <button
      class="px-4 py-2 font-medium border rounded-md peer text-light-text dark:text-dark-text bg-light-content-bg dark:bg-dark-content-bg border-light-text dark:border-dark-text focus:border-light-cta-orange dark:focus:border-dark-cta-orange hover:bg-light-highlight dark:hover:bg-dark-highlight focus:hover:bg-light-content-bg dark:focus:hover:bg-dark-content-bg"
    >
      <div class="flex items-center">
        <Icon name="bi:globe" size="1em" />
        <p class="pl-2 pr-4 uppercase">{{ $i18n.locale }}</p>
        <Icon name="bi:chevron-down" size="1em" />
      </div>
    </button>
    <div class="invisible duration-200 -translate-y-1 peer-focus:visible">
      <div
        class="absolute right-0 mt-3 overflow-hidden border rounded-md text-light-text dark:text-dark-text bg-light-content-bg dark:bg-dark-content-bg border-light-text dark:border-dark-text"
      >
        <ul>
          <NuxtLink
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
          >
            <li
              class="w-32 p-2 pl-4 border-l-4 border-transparent hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct-bg dark:hover:bg-dark-distinct-bg"
            >
              {{ locale.name }}
            </li>
          </NuxtLink>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});
</script>
