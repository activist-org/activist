<template>
  <a :href="imageLink" class="group rounded-xl focus-brand" target="_blank">
    <div
      class="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] rounded-xl bg-light-distinct dark:bg-dark-distinct group-hover:bg-light-highlight dark:group-hover:bg-dark-highlight relative z-0 group-hover:fill-black dark:group-hover:fill-white"
    >
      <div
        class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
      >
        <div v-if="imageName == 'WikimediaDE'">
          <LogoWikimediaDE
            class="scale-[0.24] lg:scale-[0.3] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
        </div>
        <div v-if="imageName == 'WikimediaRS'">
          <LogoWikimediaRS
            class="scale-[0.36] lg:scale-[0.45] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
        </div>
        <div v-if="imageName == 'ImpactHub'">
          <LogoImpactHub
            class="rounded-md lg:rounded-lg scale-[1.68] lg:scale-[2.1] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
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
const localePath = useLocalePath();
</script>
