<template>
  <button
    class="mx-5 text-light-text dark:text-dark-text"
    @click="$colorMode.preference == 'dark' ? 'light' : 'dark'"
  >
    <div>
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
