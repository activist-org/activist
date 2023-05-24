<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="p-4 pl-56 transition-all duration-500 responsive-h1 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      Demo at Brandenburg Gate
    </h1>
    <div
      class="pr-2 space-y-2 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardsAbout
        description="Let's gather at Brandenburg Gate..."
        aboutType="event"
      ></CardsAbout>
      <MediaMap :addresses="['Brandenburg Gate, Berlin']" />
    </div>
  </div>
</template>

<script setup lang="ts">
const title = ref("Demo at Brandenburg Gate");

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();
</script>
