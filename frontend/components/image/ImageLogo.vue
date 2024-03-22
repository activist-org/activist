<template>
  <a class="focus-brand group rounded-xl" :href="imageLink" target="_blank">
    <div
      class="bg-light-layer-1 dark:bg-dark-layer-1 group-hover:bg-light-highlight dark:group-hover:bg-dark-highlight relative z-0 h-[200px] w-[200px] rounded-xl group-hover:fill-black lg:h-[250px] lg:w-[250px] dark:group-hover:fill-white"
    >
      <div
        class="z-1 absolute inset-0 flex items-center justify-center overflow-clip"
      >
        <div v-if="imageName == 'WikimediaDE'">
          <LogoWikimediaDE
            class="group-hover:fill-light-text dark:group-hover:fill-dark-text h-[200px] w-[200px] lg:h-[250px] lg:w-[250px]"
          />
          <span class="sr-only">Wikimedia Germany</span>
        </div>
        <div v-if="imageName == 'WikimediaRS'">
          <LogoWikimediaRS
            class="group-hover:fill-light-text dark:group-hover:fill-dark-text h-[200px] w-[200px] scale-[0.7] lg:h-[250px] lg:w-[250px]"
          />
          <span class="sr-only">Wikimedia Serbia</span>
        </div>
        <div v-if="imageName == 'ImpactHub'">
          <LogoImpactHub
            class="group-hover:fill-light-text dark:group-hover:fill-dark-text h-[200px] w-[200px] scale-[0.7] rounded-md lg:h-[250px] lg:w-[250px] lg:rounded-lg"
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
