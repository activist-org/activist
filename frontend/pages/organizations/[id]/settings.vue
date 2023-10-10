<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <CardDangerZone
      description="Here's where you can delete your account. Please note that this is not a reversible action - any permissions and settings that you have saved will be permanently lost. If you questions on your account please contact us on our contact page."
      ctaBtnText="Permanently delete organization"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;
</script>
