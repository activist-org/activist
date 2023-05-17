<script setup lang="ts">
defineProps<{
  name?: string;
  private?: boolean;
  description: string;
  searchResultType: string;  // what we pass `organization`, `event`, etc to
}>();
</script>

<template>
<div class="card-style flex flex-col sm:flex-row items-center sm:items-start mx-2 my-3">
<div class="w-full sm:w-1/4 bg-light-section-div rounded-md"><img src="" alt="" class="w-full h-32 sm:h-10 rounded-md"></div>
<div class="flex flex-col sm:w-3/4 items-center">
    <h1>Orgarnisation</h1>
    <span>Topic</span>
    <ul class="">
        <li>Location</li>
        <li>123 members</li>
        <li>123 suporters</li>
    </ul>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
</div>

</div>
</template>

<style>
</style>