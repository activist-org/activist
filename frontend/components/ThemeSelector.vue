<template>
  <button
    class="mx-5"
    @click="$colorMode.preference == 'dark' ? 'light' : 'dark'"
  >
    <div class="fill-dark-text dark:fill-light-text">
      <Icon v-if="$colorMode.value == 'dark'" name="bi:sun" size="2em" />
      <Icon v-else name="bi:moon" size="2em" />
    </div>
  </button>
</template>

<script setup>
  const colorMode = useColorMode()
  console.log(colorMode.preference)
  console.log(colorMode.value)
</script>
