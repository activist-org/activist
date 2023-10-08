<template>
  <a class="group rounded-xl focus-brand" :href="imageLink" target="_blank">
    <div
      class="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] rounded-xl bg-light-distinct dark:bg-dark-distinct group-hover:bg-light-highlight dark:group-hover:bg-dark-highlight relative z-0 group-hover:fill-black dark:group-hover:fill-white"
    >
      <div
        class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
      >
        <div v-if="imageName == 'wikimediade'">
          <logowikimediade
            class="w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
        </div>
        <div v-if="imageName == 'wikimediars'">
          <logowikimediars
            class="w-[200px] h-[200px] scale-[0.7] lg:w-[250px] lg:h-[250px] group-hover:fill-light-text dark:group-hover:fill-dark-text"
          />
        </div>
        <div v-if="imageName == 'impacthub'">
          <logoimpacthub
            class="w-[200px] h-[200px] scale-[0.7] lg:w-[250px] lg:h-[250px] rounded-md lg:rounded-lg group-hover:fill-light-text dark:group-hover:fill-dark-text"
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
