<template>
  <a
    :href="href"
    class="card-style focus-brand text-black border border-black p-2 flex"
  >
    <slot></slot>
    <div
      v-if="text"
      class="place-self-center font-semibold text-2xl leading-4 ml-2"
    >
      {{ text }}
    </div>
    <div
      v-if="loading"
      class="animate-pulse place-self-center font-semibold text-2xl bg-slate-300 ml-2 rounded-full p-4"
    ></div>
    <div
      v-if="count"
      class="place-self-center font-semibold text-2xl bg-slate-300 ml-2 rounded-full p-1"
    >
      {{ count }}
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  text: String;
  count: String;
  loading: Boolean;
  href: String;
}>();
</script>
