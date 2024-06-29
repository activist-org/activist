import type { PasswordRules } from "~/types/password-rules";

export default function usePasswordRules() {
  const rules = ref<PasswordRules[]>(passwordRules);

  const ruleFunctions: { [key: string]: (value: string) => boolean } = {
    "number-of-chars": (value: string) => value.length >= 12,
    "capital-letters": (value: string) => /[A-Z]/.test(value),
    "lower-case-letters": (value: string) => /[a-z]/.test(value),
    "contains-numbers": (value: string) => /[0-9]/.test(value),
    "contains-special-chars": (value: string) => /[^a-zA-Z0-9]/.test(value),
  };

  const checkRules = (event: { target: { value: string } }): void => {
    const actualValue = event.target.value;
    rules.value.forEach((rule) => {
      if (ruleFunctions[rule.message]) {
        rule.isValid = ruleFunctions[rule.message](actualValue);
      }
    });
  };

  const isPasswordMatch = (
    passwordValue: string,
    confirmPasswordValue: string
  ) => {
    if (passwordValue === "" || confirmPasswordValue === "") {
      return false;
    }
    return passwordValue === confirmPasswordValue;
  };

  const isAllRulesValid = computed(() => {
    return rules.value.every((rule) => rule.isValid);
  });

  return { checkRules, isAllRulesValid, isPasswordMatch, rules };
}
