<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="p-4 pl-56 text-light-text dark:text-dark-text transition-all duration-500"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      This will be a home page
    </h1>
  </div>
</template>

<script setup lang="ts">
const title = ref("Home");
definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();
</script>
