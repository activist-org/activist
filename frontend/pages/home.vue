<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1 class="p-4 text-light-text dark:text-dark-text">This will be a home page</h1>
  </div>
</template>

<script setup>
const title = ref("Home");
definePageMeta({
  colorMode: "light",
});
</script>
