<template>
  <div class="flex flex-col justify-center mx-1 transition-all duration-500">
    <div class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header">
      <MenuSelector
        iconURL="bi:calendar-check"
        btnText="Events"
        btnURL="/"
        :selected="isEvent"
        :active="true"
      ></MenuSelector>
      <MenuSelector
        iconURL="IconOrganization"
        btnText="Organizations"
        btnURL="/"
        :selected="isOrg"
        :active="true"
      ></MenuSelector>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const isEvent = route.path.includes("events") ? true : false;
const isOrg = route.path.includes("organizations") ? true : false;
// isVote = route.path.includes("votes") ? true : false;
</script>
