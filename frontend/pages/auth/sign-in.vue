<template>
  <div class="px-4 2xl:px-36 xl:px-24 md:px-8 sm:px-6">
    <form class="space-y-4">
      <div class="col">
        <FormTextField
          @update:model-value="userNameValue = $event"
          :placeholder="$t('pages.auth.sign-in.index.enter-user-name')"
          :model-value="userNameValue"
        />
      </div>
      <div>
        <FormTextField
          @update:model-value="passwordValue = $event"
          :placeholder="$t('components._global.enter-password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          :icons="['bi:eye-fill']"
        />
      </div>
      <div class="flex space-x-2">
        <FriendlyCaptcha />
        <BtnLabeled
          @click="signIn"
          class="flex items-center justify-center truncate max-h-[48px] md:max-h-[40px] w-[116px] md:w-[96px]"
          :label="$t('_global.sign-in')"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t('components.btn-labeled.sign-in-aria-label')"
        />
      </div>
      <div class="flex pt-4 md:justify-center md:pt-6 lg:pt-8">
        <h6>{{ $t("pages.auth.sign-in.index.no-account") }}</h6>
        <NuxtLink
          :to="localePath('/auth/sign-up')"
          class="ml-2 font-extrabold link-text"
          >{{ $t("_global.sign-up") }}</NuxtLink
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

definePageMeta({
  layout: "auth",
});

const userNameValue = ref("");
const passwordValue = ref("");

const signIn = () => {
  //
};
</script>
