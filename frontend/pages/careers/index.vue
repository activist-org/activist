<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.careers.title") }}</Title>
    </Head>
    <h1 class="p-4">{{ $t("pages.careers.description") }}</h1>
  </div>
</template>

<script setup lang="ts">
const title = ref("Careers");
</script>
