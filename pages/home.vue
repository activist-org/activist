<template>
  <div class="p-4">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1>This is a home page</h1>
    <LabeledBtn cta label="CTA Button" />
    <LabeledBtn label="Button" />
  </div>
</template>

<script setup>
const title = ref("Home");
definePageMeta({
  colorMode: "light",
});
</script>
