# Unit Testing Basics - A Beginner's Guide

This guide explains unit testing concepts and terminology in simple terms, using examples from this codebase.

## What is Unit Testing?

**Unit testing** is like quality control for code. You write small programs (tests) that automatically check if your code works correctly.

**Real-world analogy:** Imagine you're building a car. Before selling it, you test each part:
- Does the engine start? ✅
- Do the brakes work? ✅
- Do the headlights turn on? ✅

Unit tests do the same for code - they test individual "units" (functions, components) to make sure they work.

## Basic Terminology

### Test File Structure

```typescript
describe("ComponentName", () => {
  it("should do something specific", () => {
    // Test code here
  });
});
```

**`describe()`** - Groups related tests together. Like a chapter in a book.
- Example: `describe("ModalBase", () => { ... })` - all tests about the ModalBase component

**`it()`** - A single test case. Describes what should happen.
- Example: `it("renders correctly", () => { ... })` - tests that the component renders

**`expect()`** - Makes an assertion (claim) about what should be true.
- Example: `expect(button).toBeVisible()` - claims the button should be visible
- If the expectation fails, the test fails

### Test Lifecycle

**`beforeEach()`** - Runs before each test. Used for setup.
```typescript
beforeEach(() => {
  // Reset mocks, clear state, etc.
  mockFunction.mockClear();
});
```

**`afterEach()`** - Runs after each test. Used for cleanup.

## What are Composables?

**Composables** are reusable functions in Vue.js that provide functionality to components.

**Examples from this codebase:**
- `useRoute()` - Gets current route information (URL, params, etc.)
- `useRouter()` - Navigates to different pages
- `useAuth()` - Handles user authentication
- `useColorMode()` - Gets/sets dark/light mode

**Why they matter:** Components use these composables, but in tests, we can't use the real ones (they need a browser/server). So we create **mocks** (fake versions).

## What is Mocking?

**Mocking** = Creating fake versions of things your code depends on.

**Why mock?**
1. **Speed** - Real network requests are slow. Mock them = fast tests.
2. **Reliability** - Real APIs might be down. Mocks always work.
3. **Isolation** - Test only YOUR code, not external dependencies.
4. **Control** - Make mocks return exactly what you need for testing.

**Real-world analogy:** 
- Testing a car's radio without actually playing music = you mock the radio
- Testing a payment system without charging real money = you mock the payment API

## Mocking Patterns Explained

### Pattern 1: Auto-Mock (Default Behavior)

**What it means:** Let the test framework automatically create a simple fake version.

**When to use:** The composable is used by your component, but your test doesn't care about its value.

**Example:**
```typescript
// Component uses useRoute() internally, but test doesn't check route
describe("MyComponent", () => {
  it("renders correctly", async () => {
    await render(MyComponent);
    // Test just checks if component renders
    // Doesn't care what useRoute() returns
  });
});
```

**Analogy:** You're testing if a car starts. You don't care if the radio works, so you use a fake radio that does nothing.

---

### Pattern 2: Factory Function (Specific Values)

**What it means:** Use a helper function to create a mock with specific values you need.

**When to use:** Your test needs specific data from the composable.

**Example:**
```typescript
import { createUseRouteMock } from "../../mocks/composableMocks";

// Create a mock that returns specific route data
globalThis.useRoute = createUseRouteMock(
  { id: "123" },        // Route params (like /events/123)
  { filter: "active" }, // Query params (like ?filter=active)
  "/events/123"         // Full path
);

describe("EventPage", () => {
  it("displays event ID from route", async () => {
    await render(EventPage);
    // Component reads useRoute().params.id
    // Our mock returns { id: "123" }
    expect(screen.getByText("123")).toBeTruthy();
  });
});
```

**Analogy:** You're testing a GPS. You need it to show a specific address, so you give it fake GPS coordinates that return that address.

**Key terms:**
- **Factory function** - A function that creates things (like `createUseRouteMock`)
- **`globalThis`** - A way to make something available everywhere in tests

---

### Pattern 3: Spy Function (Track Calls)

**What it means:** Create a fake function that remembers how it was called, so you can verify it was called correctly.

**When to use:** You need to check that a function was called with the right arguments.

**Example:**
```typescript
import { vi } from "vitest";

// Create a spy - a function that remembers its calls
const mockLocalePath = vi.fn((path: string) => `/en${path}`);

beforeEach(() => {
  // Replace the real useLocalePath with our spy
  vi.stubGlobal("useLocalePath", () => mockLocalePath);
  mockLocalePath.mockClear(); // Clear previous calls
});

it("calls useLocalePath with correct path", async () => {
  await render(BtnRouteInternal, { props: { linkTo: "/test" } });
  
  // Verify the spy was called with "/test"
  expect(mockLocalePath).toHaveBeenCalledWith("/test");
});
```

**Analogy:** You're testing if someone dialed the right phone number. You use a spy phone that records all calls, then check the call log.

**Key terms:**
- **Spy** - A function that tracks how it was called
- **`vi.fn()`** - Vitest function to create a spy
- **`vi.stubGlobal()`** - Replace a global function with your spy
- **`mockClear()`** - Clear the call history
- **`toHaveBeenCalledWith()`** - Check if spy was called with specific arguments

---

### Pattern 4: mockImplementation() (Change Behavior Per Test)

**What it means:** A composable is already set up as a spy. Change what it returns for different tests.

**When to use:** You need different return values in different tests, and the composable is already a spy.

**Example:**
```typescript
describe("useColor", () => {
  it("handles light mode", () => {
    // Change what useColorMode returns for this test
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const { getColorModeImages } = useColor();
    // Now it will use light mode
    expect(getColorModeImages("/path/to/image")).toEqual("/path/to/image_light.png");
  });

  it("handles dark mode", () => {
    // Change it again for this test
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "dark",
      value: "dark",
    }));

    const { getColorModeImages } = useColor();
    // Now it will use dark mode
    expect(getColorModeImages("/path/to/image")).toEqual("/path/to/image_dark.png");
  });
});
```

**Analogy:** You have a light switch that's already connected to a test system. You can flip it to "on" or "off" for different tests.

**Key terms:**
- **`mockImplementation()`** - Change what a spy function returns

---

### Pattern 5: beforeEach + Override (Default with Exceptions)

**What it means:** Set up a default mock for all tests, but override it for specific tests that need different values.

**When to use:** Most tests need the same mock, but a few need different values.

**Example:**
```typescript
import { createUseRouteMock } from "../../mocks/composableMocks";

describe("MyComponent", () => {
  beforeEach(() => {
    // Default: all tests get this mock
    globalThis.useRoute = createUseRouteMock({}, {}, "/default");
  });

  it("handles default route", async () => {
    await render(MyComponent);
    // Uses the default mock from beforeEach
  });

  it("handles specific route params", async () => {
    // Override the default for just this test
    globalThis.useRoute = createUseRouteMock({ id: "456" }, {}, "/specific");
    await render(MyComponent);
    // Uses the specific mock
  });
});
```

**Analogy:** Most tests use a default car, but one test needs a sports car. You set the default in `beforeEach`, then swap it for that one test.

---

## Real Examples from This Codebase

### Example 1: Simple Component Test (Pattern 1)

**File:** `test/components/modal/ModalBase.spec.ts`

```typescript
// Set up a simple mock - Pattern 1
globalThis.useRoute = createUseRouteMock();

describe("ModalBase component", () => {
  it("renders modal with correct data-testid", () => {
    const wrapper = mount(ModalBase);
    expect(wrapper.find('[data-testid="modal-testModal"]').exists()).toBe(true);
  });
});
```

**What's happening:**
- Component uses `useRoute()` internally
- Test doesn't care what route data is returned
- Simple mock is enough

### Example 2: Testing Function Calls (Pattern 3)

**File:** `test/components/btn/route/BtnRouteInternal.spec.ts`

```typescript
// Create a spy to track calls
const mockLocalePath = vi.fn((path: string) => `/en${path}`);

beforeEach(() => {
  vi.stubGlobal("useLocalePath", () => mockLocalePath);
  mockLocalePath.mockClear();
});

it("renders NuxtLink with localized path", async () => {
  await renderButton(BtnRouteInternal, { linkTo: "/test-page" });
  
  // Verify the function was called correctly
  expect(mockLocalePath).toHaveBeenCalledWith("/test-page");
});
```

**What's happening:**
- Component calls `useLocalePath("/test-page")`
- We spy on it to verify it was called with the right argument
- Test passes if the call was made correctly

## Decision Guide - Which Pattern Should I Use?

Ask yourself:

1. **Does my test care about the composable's value?**
   - No → **Pattern 1** (Auto-mock)
   - Yes → Continue...

2. **Do I need to verify the composable was called?**
   - Yes → **Pattern 3** (Spy)
   - No → Continue...

3. **Is the composable already a spy in setup.ts?**
   - Yes → **Pattern 4** (mockImplementation)
   - No → Continue...

4. **Do most tests need the same mock?**
   - Yes → **Pattern 5** (beforeEach + override)
   - No → **Pattern 2** (Factory)

## Common Terms Cheat Sheet

| Term | Meaning |
|------|---------|
| **Test** | A program that checks if code works |
| **Mock** | A fake version of something |
| **Spy** | A function that tracks how it was called |
| **Factory** | A function that creates mocks |
| **Composable** | A reusable Vue.js function |
| **Stub** | A simple mock that returns fixed values |
| **`describe()`** | Groups related tests |
| **`it()`** | A single test case |
| **`expect()`** | Makes an assertion |
| **`beforeEach()`** | Runs before each test |
| **`vi.fn()`** | Creates a spy function |
| **`mockClear()`** | Clears spy call history |
| **`mockImplementation()`** | Changes what a spy returns |

## Next Steps

1. Read the actual test files mentioned in this guide
2. Try writing a simple test yourself
3. When in doubt, start with Pattern 1 (auto-mock) - it's the simplest!

## Questions?

- **Q: Why not just use the real composables?**
  - A: They need a browser/server environment. Tests run in Node.js, so we need mocks.

- **Q: What's the difference between a mock and a spy?**
  - A: A mock is a fake version. A spy is a mock that also tracks how it was called.

- **Q: When should I use each pattern?**
  - A: Start simple (Pattern 1). Only add complexity when you need it (Pattern 2-5).

- **Q: What if I'm not sure which pattern to use?**
  - A: Use Pattern 1 (auto-mock) first. If your test fails or needs specific data, move to Pattern 2.
