<template>
  <vue-friendly-captcha
    @done="verifyCaptcha"
    sitekey="<sitekey>"
    :dark="($colorMode.preference = 'dark')"
    language="en"
  />
</template>

<script setup>
import VueFriendlyCaptcha from "@somushq/vue3-friendly-captcha";
</script>
