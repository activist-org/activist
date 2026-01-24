# Test Issues Analysis - Tests That May Work Around Bugs

This document identifies tests that may be working around bugs instead of failing correctly.

## Critical Issues

### 1. Commented Out Tests with Dummy Placeholders

**Files:**
- `frontend/test/pages/auth/sign-in.spec.ts`
- `frontend/test/pages/auth/set-password.spec.ts`

**Problem:**
- All real tests are commented out
- Only dummy tests remain: `it("true is true", () => { expect(true).toBe(true); })`
- Tests note says: "disabled because authentication is handled by @sidebase/nuxt-auth"

**Impact:** 
- These test files provide no real test coverage
- Bugs in sign-in/set-password functionality won't be caught
- Tests should either be fixed to work with new auth system or removed

**Recommendation:**
- Either fix the tests to work with @sidebase/nuxt-auth
- Or remove the files if functionality is tested elsewhere (e.g., Playwright)
- Remove dummy placeholder tests

---

### 2. Console Warning/Error Suppression

**File:** `frontend/test/setup.ts` (lines 163-204)

**Problem:**
- Suppresses Vue warnings/errors for:
  - `FriendlyCaptcha` missing `modelValue` prop
  - `Draggable` missing `itemKey` prop
  - Generic "Invalid prop" warnings
  - Generic "Missing required prop" warnings

**Code:**
```typescript
console.warn = (...args: unknown[]) => {
  const message = String(args[0] || "");
  if (
    message.includes("FriendlyCaptcha") ||
    message.includes("Draggable") ||
    message.includes("Invalid prop") ||
    message.includes("Missing required prop")
  ) {
    return; // Suppresses the warning
  }
  originalWarn(...args);
};
```

**Impact:**
- Could hide real bugs in components
- Generic "Invalid prop" and "Missing required prop" suppression is too broad
- New bugs with similar error messages would be hidden

**Assessment:**
- `FriendlyCaptcha` and `Draggable` suppressions might be legitimate (test environment issues)
- Generic prop suppressions are risky - could hide real bugs

**Recommendation:**
- Make suppressions more specific (exact component names, not generic patterns)
- Document why each suppression is needed
- Consider fixing the root cause instead of suppressing

---

### 3. Incomplete Test Assertions

**File:** `frontend/test/components/form/Form.spec.ts` (line 52)

**Problem:**
```typescript
it("submits when fields are valid", async () => {
  // ... test code ...
  await fireEvent.click(submitBtn);
  
  // Could check for successful event if the form has a message or emitted handler.
});
```

**Impact:**
- Test doesn't verify that form submission actually works
- Only verifies that clicking submit doesn't crash
- Could pass even if form submission is broken

**Recommendation:**
- Add assertion to verify form submission (check for success message, emitted event, or navigation)
- Or document why verification isn't possible

---

## Potentially Problematic (Needs Review)

### 4. TypeScript Error Suppression

**Files:**
- `frontend/test/components/card/search-result-entity/CardSearchResultEntityOrganization.spec.ts`
- `frontend/test/components/card/search-result-entity/CardSearchResultEntityGroup.spec.ts`

**Code:**
```typescript
// @ts-expect-error - TypeScript has issues resolving .vue files in test environment, but import works at runtime
import CardSearchResultEntityOrganization from "../../../app/components/card/search-result-entity/CardSearchResultEntityOrganization.vue";
```

**Assessment:**
- This is a legitimate TypeScript limitation with .vue file resolution
- Not hiding bugs, just suppressing a false positive
- **Status:** Acceptable

---

### 5. Error Handling Tests with Empty Catch Blocks

**Files:** Multiple integration test files

**Code:**
```typescript
it("store is not updated when API fails", async () => {
  mockGetEventService.mockRejectedValue(new Error("Failed"));
  
  try {
    const event = await mockGetEventService("event-123");
    mockSetEvent(event);
  } catch {
    // Don't call setEvent on error.
  }
  
  expect(mockSetEvent).not.toHaveBeenCalled();
});
```

**Assessment:**
- These are testing error handling logic correctly
- Empty catch is intentional - testing that errors are caught and handled
- Assertion verifies the correct behavior (store not updated)
- **Status:** Correct - not hiding bugs

---

## Summary

### Issues That Definitely Work Around Bugs:

1. ✅ **Commented out tests** - `sign-in.spec.ts` and `set-password.spec.ts` need fixing or removal
2. ⚠️ **Broad warning suppression** - Generic prop warnings could hide real bugs
3. ⚠️ **Incomplete assertions** - Form submission test doesn't verify success

### Issues That Are Acceptable:

- TypeScript error suppressions for .vue files (legitimate limitation)
- Error handling tests with empty catch blocks (testing error handling correctly)

### Recommendations:

1. **High Priority:** Fix or remove commented-out tests in `sign-in.spec.ts` and `set-password.spec.ts`
2. **Medium Priority:** Make warning suppressions more specific (exact component names, not generic patterns)
3. **Low Priority:** Add assertion to form submission test to verify success
