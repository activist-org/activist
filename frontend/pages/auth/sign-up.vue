<template>
    <div class="px-4 2xl:px-36 xl:px-24 md:px-8 sm:px-6">
      <form class="space-y-4">
        <div class="col">
          <FormTextField
            :placeholder="$t('pages.auth.sign-up.index.enter-user-name')"
            :model-value="userNameValue"
            @update:model-value="userNameValue = $event"
          />
        </div>
        <div>
          <FormTextField
            :placeholder="$t('pages.auth.sign-up.index.enter-password')"
            :is-icon-visible="true"
            input-type="password"
            :model-value="passwordValue"
            @update:model-value="passwordValue = $event"
            :iconsNames="['bi:info-circle', 'bi:eye-fill']"
          />
        </div>
        <div>
          <FormTextField
            :placeholder="$t('pages.auth.sign-up.index.repeat-password')"
            :is-icon-visible="true"
            input-type="password"
            :model-value="confirmPasswordValue"
            @update:model-value="confirmPasswordValue = $event"
            :iconsNames="isPasswordMatch ? ['bi:check-lg', 'bi:eye-fill'] : ['bi:x-lg', 'bi:eye-fill']"
          />
        </div>
        <div class="flex space-x-2">
          <button
            class="flex items-center w-fit justify-center 2xl:space-x-10 xl:space-x-8 lg:space-x-4 md:space-x-4 lg:col-span-5 md:col-span-2 px-3 rounded border light:border-black dark:border-[#857E7B] text-sm h-[48px] md:h-[40px]"
            type="button"
            aria-label="test"
          >
            <span class="flex items-center space-x-4 whitespace-nowrap">
              <Icon name="bi:shield-fill-check" size="28px" />
              <span class="font-bold text-[18px] hidden lg:inline-block">{{
                $t("pages.auth.sign-up.index.i-am-human")
              }}</span>
            </span>
            <span class="text-[12px] hidden lg:inline-block truncate"
              >FriendlyCaptcha</span
            >
          </button>
          <BtnLabeled
            class="flex items-center justify-center truncate max-h-[48px] md:max-h-[40px] w-[116px] md:w-[96px]"
            label="Sign up"
            :cta="true"
            fontSize="lg"
            ariaLabel="SignUp"
            @click="signUp"
          />
        </div>
        <div class="flex flex-col items-center sm:flex-row pt-6 md:pt-8 lg:pt-12">
          <FormCheckbox 
          :label="$t('pages.auth.sign-up.index.read-terms-of-service')"
          :modelValue="hasRed"
          value="yes"
          :error="hasRedError"
          @update:modelValue="hasRed = $event"
        />

        <NuxtLink
          :to="'../legal/privacy-policy'"
          target="_blank"
          class="ml-1 text-[#005CB8E5] sm:block"
          >{{ $t("pages.auth.sign-up.index.terms-of-service") }}
        </NuxtLink>
        </div>
        <div class="flex md:justify-center pt-6 md:pt-8 lg:pt-12">
          <h6>{{ $t("pages.auth.sign-in.index.no-account") }}</h6>
          <NuxtLink
            :to="'sign-up'"
            class="ml-2 text-light-cta-orange-light dark:text-dark-cta-orange-light hover:text-light-cta-orange hover:dark:text-dark-cta-orange font-extrabold"
            >{{ $t("pages.auth.sign-in.index.sign-up") }}</NuxtLink
          >
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: "auth",
  });

const userNameValue = ref("");
const passwordValue = ref("");
const confirmPasswordValue = ref("");
const hasRed = ref(false);

const isPasswordMatch = computed(() => {
  if (passwordValue.value === "" || confirmPasswordValue.value === "") {
    return false;
  }
  return passwordValue.value === confirmPasswordValue.value;
});

const signUp = () => {
};



</script>
  