<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <carddangerzone
      description="here's where you can delete this event. please note that this is not a reversible action - all event data, support and resources will be permanently lost. if you have questions on this event please contact us on our contact page. we'd be happy to help!"
      ctaBtnText="permanently delete event"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;
</script>
