<template>
  <a :href="imageLink">
    <div class="w-[250px] h-[250px] rounded-xl bg-light-distinct-bg dark:bg-dark-distinct-bg hover:bg-light-highlight dark:hover:bg-dark-highlight relative z-0">
      <div class="absolute inset-0 flex justify-center items-center z-10">
        <div v-if="imageName == 'WikimediaDE'">
          <LogosWikimediaDE />
        </div>
        <div v-if="imageName == 'WikimediaRS'">
          <LogosWikimediaRS class="scale-50" />
        </div>
        <div v-if="imageName == 'ImpactHub'">
          <LogosImpactHub class="rounded-xl scale-75"/>
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
