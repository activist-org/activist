<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1 class="p-4 text-light-text dark:text-dark-text">
      This will be the home page of a blog
    </h1>
  </div>
</template>

<script setup>
const title = ref("Blog Home");
</script>
