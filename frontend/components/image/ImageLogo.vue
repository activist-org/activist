<template>
  <a class="group rounded-xl focus-brand" :href="imageLink" target="_blank">
    <div
      class="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] rounded-xl bg-light-layer-1 dark:bg-dark-layer-1 group-hover:bg-light-highlight dark:group-hover:bg-dark-highlight relative z-0 group-hover:fill-black dark:group-hover:fill-white"
    >
      <div
        class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
      >
        <div v-if="imageName == 'WikimediaDE'">
          <LogoWikimediaDE
            class="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
          <span class="sr-only">Wikimedia Germany</span>
        </div>
        <div v-if="imageName == 'WikimediaRS'">
          <LogoWikimediaRS
            class="w-[200px] h-[200px] scale-[0.7] lg:w-[250px] lg:h-[250px] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
          <span class="sr-only">Wikimedia Serbia</span>
        </div>
        <div v-if="imageName == 'ImpactHub'">
          <LogoImpactHub
            class="w-[200px] h-[200px] scale-[0.7] lg:w-[250px] lg:h-[250px] rounded-md lg:rounded-lg group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
          <span class="sr-only">ImpactHub</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  imageName?: string;
  imageLink?: string;
}>();
</script>
