<template>
  <vue-friendly-captcha @done="verifyCaptcha" sitekey="<sitekey>" />
</template>

<script setup>
import VueFriendlyCaptcha from "@somushq/vue3-friendly-captcha";

</script>
