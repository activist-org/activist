<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1 class="p-4">
      This will be legal support page with information for people who need help.
    </h1>
  </div>
</template>

<script setup>
const title = ref("Legal Support");
</script>
