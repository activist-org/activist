# Frontend Testing

<a id="contents"></a>

## **Contents**
- [End to End Tests](#end-to-end-tests-)
- [Component and Unit Tests](#component-and-unit-tests-)
  - [Mocking Composables](#mocking-composables-)

<a id="end-to-end-tests-"></a>

## End to End Tests [`⇧`](#contents)

End to End Tests (E2E) are used to ensure that the whole application (frontend, backend, database, etc.) functions together correctly. E2E tests are very useful, but they have some important drawbacks:

1. They are slow
2. They are more vulnerable to intermittent timeout errors

### What to test

Not every test belongs in the E2E test suite. Tests that should go in the E2E test suite include:

1. Testing full user stories such as:
    - Creating an account
    - Creating or deleting an event, organization, etc
2. Testing UI functions that make network requests such as:
    - UI components that fetch data from our backend when they render
3. Testing features that only work in a full browser such as:
    - Switching the color theme
    - Putting a url in the user's clipboard
4. Browser-specific bugs

### Where to write tests

Write your tests under `frontend/test-e2e/specs`. Inside this folder are more folders based on the environment the tests are meant to run in:

- `desktop` for tests that run in desktop environments
- `mobile` for mobile environments
- `all` for tests that run in both mobile and desktop environments

While the folders are organized this way for convenience, if you are writing a new test suite you will need to use tags to tell playwright which environments to run the suite in. This is done in the describe block:

```typescript
// A test suite in the "all" folder:
test.describe("Home Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Tests in here will run in both desktop and mobile environments.
});

// A test suite in the "desktop" folder:
test.describe("Home Page", { tag: ["@desktop"] }, () => {
  // Tests in here will only run on desktop environments.
});
```

### Best practices

We recommend following [playwright's best practices](https://playwright.dev/docs/best-practices) and locating UI elements by their accessible names when possible.

### Avoid complicated design patterns

We want the E2E test suite to be as easy to read as possible. That means most of the logic of a test should be in the test itself, and not hidden in classes or methods.

#### 1. Use component objects

Instead of building large page objects that do everything, we recommend creating small component objects:

- Most component objects should be simple Javascript objects created with a factory function such as [ThemeMenu.ts](frontend/test-e2e/component-objects/ThemeMenu.ts)
- In rare occasions where a component requires more complicated code, you may use a class such as [SidebarLeft.ts](frontend/test-e2e/component-objects/SidebarLeft.ts)
- Use component objects directly in your tests instead of combining them into larger objects

> [!NOTE]
> You may notice we do have a page-objects directory, but the objects in there are written just like component-objects.

#### 2. Code reuse

Avoiding complicated patterns means there will be more duplicate code in the E2E tests. This is fine and preferable to code that difficult to read. However, if there are sequences of user actions you want to re-use between tests, we recommend using simple functions:

The steps to do this are:

1. Wrap the lines from your test that you want to re-use in a function
2. Move that function into a file in `frontend/test-e2e/actions` and name it based on the action being performed
3. Import the function into the test files where you use it

<a id="component-and-unit-tests-"></a>

## Component and Unit Tests [`⇧`](#contents)

For component and unit tests we are using Vitest and Vue Testing Library. For a general overview on how to write these tests, see the documentation for the [Testing Library Frameworks](https://testing-library.com/docs/).

Nuxt also has [testing guide](https://nuxt.com/docs/getting-started/testing#%EF%B8%8F-helpers) for Nuxt's additional testing tools.

> [!IMPORTANT]
> There are some important differences between how we recommend writing tests and the Nuxt guide. The recommendations for this project are below:

### 1. Write tests in the `frontend/test` directory:

This directory's structure should mirror the frontend directory structure as a whole. If the corresponding directory for the component you are testing does not exist in `frontend/test` yet, please create one and add your new test there.

### 2. Use the render method in `frontend/test/render.ts`.

This render method has been customized to allow our major Nuxt plugins to work in the Vitest environment. If you are curious you can check [render.ts](frontend/test/render.ts) and [setup.ts](frontend/test/render.ts) in the `frontend/test` directory to see how this works.

### 3. Avoid using mocking when possible:

The Nuxt guide recommends a classic approach to testing where you mock every dependency in the component / function you are testing. This approach has some serious drawbacks: it can make it harder to refactor code and maintain tests over time.

We recommend using mocking for dependencies that are unreliable and/or slow, like network requests. You can find a more in-depth explanation on the pros and cons of mocking on [Martin Fowler's blog](https://martinfowler.com/articles/mocksArentStubs.html).

**Mocks we do recommend:**

* We provide a global mock for `useColorMode`. This is necessary because `useColorMode` currently does not work in Vitest. See example use in [useColor.spec.ts](frontend/test/composables/useColor.spec.ts).
* Nuxt provides a `registerEndpoint` function to mock network requests. See example use in [sign-in.spec.ts](frontend/test/pages/auth/sign-in.spec.ts).

<a id="mocking-composables-"></a>

### 4. Mocking Composables [`⇧`](#contents)

When testing components or composables that use Nuxt composables (like `useRoute`, `useRouter`, `useLocalePath`, `useAuth`, etc.), we use a factory-based mocking approach to make test dependencies explicit and maintainable.

#### Factory Functions

All composable mock factories are located in [`frontend/test/mocks/composableMocks.ts`](frontend/test/mocks/composableMocks.ts). These factories allow tests to explicitly define their mock needs using reusable functions.

**Available factories:**
- `createUseRouteMock()` - For mocking `useRoute()`
- `createUseRouterMock()` - For mocking `useRouter()`
- `createUseLocalePathMock()` - For mocking `useLocalePath()`
- `createUseAuthMock()` - For mocking `useAuth()`
- `createUseUserMock()` - For mocking `useUser()`
- `createUseDeviceMock()` - For mocking `useDevice()`
- `createUseColorModeSpy()` - For mocking `useColorMode()` (returns a spy function)
- `createUseSidebarSpy()` - For mocking `useSidebar()` (returns a spy function)
- And more...

#### Mocking Patterns

We use five main patterns for mocking composables:

##### Pattern 1: Use Auto-Mock (Default Behavior)

When a composable doesn't affect your test behavior, you can rely on the automatic `{}` mock provided by `setupAutoImportMocks()`. This is the simplest approach and requires no explicit setup.

**When to use:** The composable is used by the component but doesn't affect test assertions.

**Example:**
```typescript
// No explicit mock needed - auto-mock {} is sufficient.
describe("MyComponent", () => {
  it("renders correctly", async () => {
    await render(MyComponent);
    // Component uses useRoute() internally, but test doesn't check route behavior.
  });
});
```

##### Pattern 2: Import Factory and Use It

When you need specific return values but don't need to track calls, use the factory functions directly.

**When to use:** You need specific mock data (e.g., route params, user data) but don't need to verify calls.

**Example:**
```typescript
import { createUseRouteMock } from "../../mocks/composableMocks";

// Set up useRoute with specific params.
globalThis.useRoute = createUseRouteMock(
  { id: "123" },        // params
  { filter: "active" }, // query
  "/events/123",        // path
  "events-id"           // name (optional)
);

describe("MyComponent", () => {
  it("displays event ID from route", async () => {
    await render(MyComponent);
    expect(screen.getByText("123")).toBeTruthy();
  });
});
```

**Real example:** See [ModalBase.spec.ts](frontend/test/components/modal/ModalBase.spec.ts)

##### Pattern 3: Override with Spy for Call Tracking

When you need to verify that a composable was called with specific arguments, use `vi.stubGlobal()` with a spy function.

**When to use:** You need to assert that a composable was called with specific parameters.

**Example:**
```typescript
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("BtnRouteInternal", () => {
  const mockLocalePath = vi.fn((path: string) => `/en${path}`);

  beforeEach(() => {
    vi.stubGlobal("useLocalePath", () => mockLocalePath);
    mockLocalePath.mockClear();
  });

  it("calls useLocalePath with correct path", async () => {
    await render(BtnRouteInternal, { props: { linkTo: "/test" } });
    expect(mockLocalePath).toHaveBeenCalledWith("/test");
  });
});
```

**Real example:** See [BtnRouteInternal.spec.ts](frontend/test/components/btn/route/BtnRouteInternal.spec.ts)

##### Pattern 4: Use mockImplementation() on Spy Functions

When a composable is set up as a spy function in `setup.ts` (like `useColorMode`), you can use `mockImplementation()` to change return values per test.

**When to use:** You need different return values for different test cases, and the composable is already set up as a spy.

**Example:**
```typescript
describe("useColor", () => {
  it("handles light mode", () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image")).toEqual("/path/to/image_light.png");
  });

  it("handles dark mode", () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "dark",
      value: "dark",
    }));

    const { getColorModeImages } = useColor();
    expect(getColorModeImages("/path/to/image")).toEqual("/path/to/image_dark.png");
  });
});
```

**Real example:** See [useColor.spec.ts](frontend/test/composables/useColor.spec.ts)

##### Pattern 5: Set Defaults in beforeEach, Override Per-Test

Combine factory functions in `beforeEach` with per-test overrides when needed.

**When to use:** Most tests need the same mock, but some tests need different values.

**Example:**
```typescript
import { createUseRouteMock } from "../../mocks/composableMocks";

describe("MyComponent", () => {
  beforeEach(() => {
    // Default setup for most tests.
    globalThis.useRoute = createUseRouteMock({}, {}, "/default");
  });

  it("handles default route", async () => {
    await render(MyComponent);
    // Uses default mock.
  });

  it("handles specific route params", async () => {
    // Override for this specific test.
    globalThis.useRoute = createUseRouteMock({ id: "456" }, {}, "/specific");
    await render(MyComponent);
    // Uses specific mock.
  });
});
```

#### Decision Guide

**Which pattern should I use?**

1. **Pattern 1 (Auto-mock)**: Composable doesn't affect test behavior
2. **Pattern 2 (Factory)**: Need specific mock data, no call tracking needed
3. **Pattern 3 (Spy)**: Need to verify composable was called with specific args
4. **Pattern 4 (mockImplementation)**: Composable is already a spy, need different values per test
5. **Pattern 5 (beforeEach + override)**: Most tests share defaults, some need overrides

#### Best Practices

- **Make dependencies explicit**: If a composable affects your test, explicitly mock it using a factory
- **Use factories for reusability**: Import from `composableMocks.ts` rather than creating inline mocks
- **Keep it simple**: Use Pattern 1 when defaults are sufficient
- **Document your choice**: Add a comment explaining why you chose a specific pattern if it's not obvious

#### Infrastructure-Dependent Mocks

Some composables are set up globally in `setup.ts` because they require infrastructure setup:
- `useI18n` - Requires i18n instance
- `useColorMode` - Set up as spy for per-test overrides
- `useSidebar` - Set up as spy for per-test overrides
- `useAuthState` - Requires global data reference

These don't need explicit setup in individual tests unless you need to override their behavior.
