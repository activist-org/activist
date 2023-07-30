<template></template>

<script setup lang="ts">
const { id } = useRoute().params;

navigateTo(`${id}/about`);
</script>
