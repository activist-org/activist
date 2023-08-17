<template>
  <p
    class="py-5 text-light-text dark:text-dark-text responsive-px-5 bg-light-content dark:bg-dark-content"
  >
    <CardDangerZone
      description="Here's where you can delete your account. Please note that this is not a reversible action - any permissions and settings that you have saved will be permanently lost. If you questions on your account please contact us on our contact page."
      ctaBtnText="Permanently delete organization"
    />
  </p>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
</script>
