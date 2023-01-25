<template>
  <a :href="imageLink" class="group">
    <div
      class="w-[250px] h-[250px] rounded-xl bg-light-distinct dark:bg-dark-distinct group-hover:bg-light-highlight dark:group-hover:bg-dark-highlight relative z-0 group-hover:fill-black dark:group-hover:fill-white"
    >
      <div class="absolute inset-0 flex items-center justify-center z-1">
        <div v-if="imageName == 'WikimediaDE'">
          <LogosWikimediaDE
            class="scale-105 fill-black/20 group-hover:fill-black/90 dark:group-hover:fill-white/90"
          />
        </div>
        <div v-if="imageName == 'WikimediaRS'">
          <LogosWikimediaRS
            class="scale-50 group-hover:fill-black/90 dark:group-hover:fill-white/90"
          />
        </div>
        <div v-if="imageName == 'ImpactHub'">
          <LogosImpactHub
            class="rounded-xl scale-[0.65] group-hover:fill-black/90 dark:group-hover:fill-white/90"
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
</script>
