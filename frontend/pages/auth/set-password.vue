<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form class="space-y-4">
      <FormTextInput
        @update:model-value="userNameValue = $event"
        :placeholder="$t('pages.auth.sign_in.index.enter_user_name')"
        :model-value="userNameValue"
      />
      <FormTextInput
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
        :placeholder="$t('components._global.enter_password')"
        :is-icon-visible="true"
        input-type="password"
        :model-value="passwordValue"
        :icons="[IconMap.VISIBLE]"
        :error="!isAllRulesValid && isBlurred"
      />
      <IndicatorPasswordStrength :password-value="passwordValue" />
      <TooltipPasswordRequirements
        v-if="
          !!passwordValue?.length &&
          !isAllRulesValid &&
          (!isBlurred || isFocused)
        "
        :rules="rules"
      />
      <FormTextInput
        @update:model-value="confirmPasswordValue = $event"
        :placeholder="$t('_global.repeat_password')"
        :is-icon-visible="true"
        input-type="password"
        :model-value="confirmPasswordValue"
        :icons="
          isPasswordMatch(passwordValue, confirmPasswordValue)
            ? [IconMap.CHECK, IconMap.VISIBLE]
            : [IconMap.X_LG, IconMap.VISIBLE]
        "
      />
      <div class="pt-4">
        <BtnAction
          class="flex max-h-[48px] items-center justify-center truncate md:max-h-[40px]"
          :label="$t('_global.set_password')"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t('_global.set_password')"
        />
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const userNameValue = ref("");
const passwordValue = ref("");
const confirmPasswordValue = ref("");

const isBlurred = ref(false);
const isFocused = ref(false);

const { rules, isAllRulesValid, checkRules, isPasswordMatch } =
  usePasswordRules();
</script>
