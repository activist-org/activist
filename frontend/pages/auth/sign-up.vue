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
          :placeholder="$t('components._global.enter-password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          :icons="['bi:eye-fill']"
          :error="!isAllRulesValid && isBlurred"
        />
      </div>
      <TooltipPasswordRequirements
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
          :placeholder="$t('_global.repeat-password')"
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
      <div class="flex items-center flex-row">
        <FormCheckbox
          @update:modelValue="hasRed = $event"
          :modelValue="hasRed"
          value="yes"
        />
        <p class="flex flex-wrap pl-2">
          {{ $t("pages._global.terms-of-service-pt-1") }}
          <NuxtLink
            :to="'../legal/privacy-policy'"
            target="_blank"
            class="ml-1 text-[#005CB8E5] sm:block"
            >{{ $t("pages._global.terms-of-service-pt-2") }}
          </NuxtLink>
        </p>
      </div>
      <div class="flex space-x-2">
        <FriendlyCaptcha />
        <BtnLabeled
          @click="signUp"
          class="flex items-center justify-center truncate max-h-[48px] md:max-h-[40px] w-[116px] md:w-[96px]"
          :label="'_global.sign-up'"
          :cta="true"
          fontSize="lg"
          :ariaLabel="'components.btn-labeled.sign-up-aria-label'"
        />
      </div>
      <div class="flex justify-center pt-4 md:pt-6 lg:pt-8">
        <h6>{{ $t("pages.auth.sign-up.index.have-account") }}</h6>
        <NuxtLink :to="'sign-in'" class="ml-2 font-extrabold link-text">{{
          $t("_global.sign-in")
        }}</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
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
