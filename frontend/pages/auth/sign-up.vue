<template>
  <div class="px-4 2xl:px-36 xl:px-24 md:px-8 sm:px-6">
    <form class="space-y-4">
      <div class="col">
        <FormTextField
          @update:model-value="userNameValue = $event"
          :placeholder="$t('pages.auth.sign-up.index.enter-user-name')"
          :model-value="userNameValue"
        />
      </div>
      <div>
        <FormTextField
          @update:model-value="passwordValue = $event"
          @input="checkRules"
          @blurred="
            isBlurred = true;
            isFocused = false;
          "
          @focused="
            isFocused = true;
            isBlurred = false;
          "
          :placeholder="$t('pages.auth.sign-up.index.enter-password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          :icons="['bi:info-circle', 'bi:eye-fill']"
          :error="!isAllRulesValid && isBlurred"
        />
      </div>
      <TooltipPassword
        v-if="
          !!passwordValue?.length &&
          !isAllRulesValid &&
          (!isBlurred || isFocused)
        "
        :rules="rules"
      />
      <div>
        <FormTextField
          @update:model-value="confirmPasswordValue = $event"
          :placeholder="$t('pages.auth.sign-up.index.repeat-password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="confirmPasswordValue"
          :icons="
            isPasswordMatch
              ? ['bi:check-lg', 'bi:eye-fill']
              : ['bi:x-lg', 'bi:eye-fill']
          "
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
          @click="signUp"
          class="flex items-center justify-center truncate max-h-[48px] md:max-h-[40px] w-[116px] md:w-[96px]"
          :label="$t('components.btn-labeled.sign-up')"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t('components.btn-labeled.sign-up-aria-label')"
        />
      </div>
      <div class="flex flex-col items-center pt-6 sm:flex-row md:pt-8 lg:pt-12">
        <FormCheckbox
          @update:modelValue="hasRed = $event"
          :label="$t('pages.auth.sign-up.index.read-terms-of-service')"
          :modelValue="hasRed"
          value="yes"
        />

        <NuxtLink
          :to="'../legal/privacy-policy'"
          target="_blank"
          class="ml-1 text-[#005CB8E5] sm:block"
          >{{ $t("pages.auth.sign-up.index.terms-of-service") }}
        </NuxtLink>
      </div>
      <div class="flex justify-center pt-4 md:pt-6 lg:pt-8">
        <h6>{{ $t("pages.auth.sign-up.index.have-account") }}</h6>
        <NuxtLink :to="'sign-in'" class="ml-2 font-extrabold link-text">{{
          $t("pages.auth.sign-up.index.sign-in")
        }}</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import usePasswordRules from "~/composables/usePasswordRules";
import { PasswordRules } from "~/types/password-rules";

definePageMeta({
  layout: "auth",
});

const userNameValue = ref("");
const passwordValue = ref("");
const confirmPasswordValue = ref("");
const hasRed = ref(false);
const isBlurred = ref(false);
const isFocused = ref(false);

const isPasswordMatch = computed(() => {
  if (passwordValue.value === "" || confirmPasswordValue.value === "") {
    return false;
  }
  return passwordValue.value === confirmPasswordValue.value;
});

const rules = ref<PasswordRules[]>(passwordRules);
const { ruleFunctions } = usePasswordRules();

const checkRules = (value: { target: { value: string } }): void => {
  const actualValue = value.target.value;
  rules.value.forEach((rule) => {
    if (ruleFunctions[rule.message]) {
      rule.isValid = ruleFunctions[rule.message](actualValue);
    }
  });
};

// Checks the rules to make the tooltip invisible when all rules are valid.
const isAllRulesValid = computed(() => {
  return rules.value.every((rule) => rule.isValid);
});

const signUp = () => {};
</script>
