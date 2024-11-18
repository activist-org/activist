<template>
  <a class="focus-brand group rounded-xl" :href="imageLink" target="_blank">
    <div
      class="relative z-0 h-[200px] w-[200px] rounded-xl bg-layer-1 group-hover:bg-highlight group-hover:fill-primary-text lg:h-[250px] lg:w-[250px]"
    >
      <div
        class="z-1 absolute inset-0 flex items-center justify-center overflow-clip"
      >
        <div v-if="imageName == 'WikimediaDE'">
          <LogoWikimediaDE
            class="h-[200px] w-[200px] group-hover:fill-primary-text lg:h-[250px] lg:w-[250px]"
          />
          <span class="sr-only">Wikimedia Germany</span>
        </div>
        <div v-if="imageName == 'WikimediaRS'">
          <LogoWikimediaRS
            class="h-[200px] w-[200px] scale-[0.7] group-hover:fill-primary-text lg:h-[250px] lg:w-[250px]"
          />
          <span class="sr-only">Wikimedia Serbia</span>
        </div>
        <div v-if="imageName == 'ImpactHub'">
          <LogoImpactHub
            class="h-[200px] w-[200px] scale-[0.7] rounded-md group-hover:fill-primary-text lg:h-[250px] lg:w-[250px] lg:rounded-lg"
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
