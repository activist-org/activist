<template>
  <div>
    <button
      class="px-3 py-2 font-medium border rounded-md peer text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content border-light-text dark:border-dark-text focus:border-light-cta-orange dark:focus:border-dark-cta-orange hover:bg-light-highlight dark:hover:bg-dark-highlight focus:hover:bg-light-content dark:focus:hover:bg-dark-content"
    >
      <div class="flex items-center text-sm">
        <Icon name="bi:globe"/>
        <p class="px-2 uppercase">{{ $i18n.locale }}</p>
        <Icon name="bi:chevron-down"/>
      </div>
    </button>
    <div class="invisible duration-200 -translate-y-1 peer-focus:visible">
      <div
        class="absolute right-0 mt-3 overflow-hidden border rounded-md text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content border-light-text dark:border-dark-text"
      >
        <ul>
          <NuxtLink
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
          >
            <li
              class="w-32 p-2 pl-4 border-l-4 border-transparent hover:border-light-cta-orange dark:hover:border-dark-cta-orange hover:bg-light-distinct dark:hover:bg-dark-distinct"
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
