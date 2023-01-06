<script setup>
const title = ref("Home");
</script>

<template>
  <div class="p-4">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1>This is a home page</h1>
    <button
      class="px-5 py-2 border rounded-md hover:bg-gray-200 active:bg-white"
    >
      Button
    </button>
  </div>
</template>
