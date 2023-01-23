<template>
  <div>

    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1 class="p-4 text-light-text dark:text-dark-text">
      This will be a page with answers to frequently asked questions
    </h1>
  </div>
</template>

<script setup>
const title = ref("FAQ");
</script>
