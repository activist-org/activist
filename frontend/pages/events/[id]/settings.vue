<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
  <CardDangerZone
      description="Here's where you can delete this event. Please note that this is not a reversible action - all event data, support and resources will be permanently lost. If you have questions on this event please contact us on our contact page. We'd be happy to help!"
      ctaBtnText="Permanently delete event"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;
</script>
