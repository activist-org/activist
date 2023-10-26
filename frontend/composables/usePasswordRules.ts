export default function usePasswordRules() {
  const ruleFunctions: { [key: string]: (value: string) => boolean } = {
    "number-of-chars": (value: string) => value.length >= 12,
    "capital-letters": (value: string) => /[A-Z]/.test(value),
    "lower-case-letters": (value: string) => /[a-z]/.test(value),
    "contains-numbers": (value: string) => /[0-9]/.test(value),
    "contains-special-chars": (value: string) => /[^a-zA-Z0-9]/.test(value),
  };
  return { ruleFunctions };
}
