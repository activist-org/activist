<template>
  <p
    class="py-5 text-light-text dark:text-dark-text responsive-px-5 bg-light-content dark:bg-dark-content"
  >
    <CardDangerZone
      description="Here's where you can delete this event. Please note that this is not a reversible action - all event data, support and resources will be permanently lost. If you have questions on this event please contact us on our contact page. We'd be happy to help!"
      ctaBtnText="Permanently delete event"
    />
  </p>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
</script>
