<template>
  <div class="flex justify-center h-min card-style md:justify-start">
    <div class="flex flex-col p-2 md:flex-row md:grow sm:px-5 sm:py-3 h-fit">
      <div v-if="infoType === 'email'" class="w-full">
        <CardChangeAccountInfoEmail />
        <div class="flex w-full pt-4">
          <div class="w-1/3">
            <BtnCaptcha />
          </div>
          <div class="w-1/3">
            <BtnCtaLabel info-type="email" />
          </div>
        </div>
      </div>
      <div v-if="infoType === 'username'" class="w-full">
        <CardChangeAccountInfoUsername />
        <div class="flex w-full pt-4">
          <div class="w-1/3 pr-2=">
            <BtnCaptcha />
          </div>
          <BtnCtaLabel info-type="email" />
          <div class="w-1/3"></div>
        </div>
      </div>
      <div v-if="infoType === 'password'" class="w-full">
        <CardChangeAccountInfoPassword />
        <div class="flex w-full pt-4">
          <div class="w-1/3 pr-2">
            <BtnCaptcha />
          </div>
          <div class="w-1/3">
            <BtnCtaLabel info-type="password" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  header: String;
  description: String;
  infoType: "email" | "username" | "password";
  ctaLabel: String;
}>();
</script>
