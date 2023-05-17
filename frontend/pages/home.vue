<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <h1
      class="p-4 pl-56 transition-all duration-500 text-light-text dark:text-dark-text"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      This will be a home page
    </h1>
    <div
      class="pr-2 sm:pr-8"
      :class="{
        'pl-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'pl-24': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <CardsSearchResult
        name="Search result"
        description="Description of the search result"
        searchResultType="organization"
        :private="false"
      ></CardsSearchResult>
      <CardsFeed
      title="Group Name"
      description="Lorem ipsum dolor sit, amet consectetur adipisicing elit."
      iconName="bi:globe"
      >
      </CardsFeed>
      <CardsGetInvolved/>
    </div>
  </div>
</template>

<script setup lang="ts">
const title = ref("Home");
definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();
</script>
