<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const userNameValue = ref("");
const passwordValue = ref("");
</script>

<template>
  <div class="px-4 2xl:px-36 xl:px-24 md:px-16 sm:px-6">
    <form class="space-y-8">
      <div class="col">
        <FormTextField
          :placeholder="$t('pages.auth.sign-in.index.enter-user-name')"
          :model-value="userNameValue"
          @update:model-value="userNameValue = $event"
        />
      </div>
      <div>
        <FormTextField
          :placeholder="$t('pages.auth.sign-in.index.enter-password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          @update:model-value="passwordValue = $event"
        />
      </div>
      <div class="grid grid-cols-9 space-x-12 md:space-x-2">
        <button
          class="flex items-center justify-center 2xl:space-x-[4.5vw] xl:space-x-8 lg:space-x-4 md:space-x-4 lg:col-span-5 md:col-span-2 px-3 rounded border border-black text-sm min-w-[68px] h-[48px] md:h-[40px]"
          type="button"
          aria-label="test"
        >
          <span class="flex items-center space-x-4 whitespace-nowrap">
            <Icon name="bi:shield-fill-check" size="28px" />
            <span class="font-bold text-[18px] hidden lg:inline-block">{{
              $t("pages.auth.sign-in.index.i-am-human")
            }}</span>
          </span>
          <span class="text-[12px] hidden lg:inline-block truncate"
            >FriendlyCaptcha</span
          >
        </button>
        <BtnLabeled
          class="flex items-center justify-center truncate max-h-[48px] md:max-h-[40px] w-[116px] md:w-[96px]"
          label="Sign In"
          linkTo="/auth/sign-up"
          :cta="true"
          fontSize="lg"
          ariaLabel="SignIn"
        />
      </div>
      <div class="flex justify-center pt-12">
        <h6>{{ $t("pages.auth.sign-in.index.dont-have-account") }}</h6>
        <NuxtLink
          :to="'sign-up'"
          class="ml-2 text-light-cta-orange font-bold"
          >{{ $t("pages.auth.sign-in.index.sign-up") }}</NuxtLink
        >
      </div>
    </form>
  </div>
</template>

<style scoped></style>
