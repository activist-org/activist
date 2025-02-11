# Frontend Testing

## End to End Tests (E2E)

E2E tests are used to ensure that the whole application (frontend, backend, database, etc.) functions together correctly.  E2E tests are very useful, but they have some important drawbacks:
1. They are slow.
2. They are more vulnerable to intermittent timeout errors.

### What to test

Not every test belongs in the E2E test suite.  Tests that should go in the E2E test suite include:
1. Testing full user stories:
  Examples:
  - Creating an account.
  - Creating an event, organization, etc.
  - Deleting an event, organization, etc.
2. Testing UI functions that make network requests:
  Examples:
  - UI components that fetch data from our backend when they render.
3. Testing features that only work in a full browser:
  Examples:
  - Switching the color theme.
  - Putting a url in the user's clipboard.
4. Browser-specific bugs.

### Where to write tests
Write your tests under `frontend/test-e2e/specs`.  Inside this folder are more folders based on the environment the tests are meant to run in:
- `desktop` for tests that run in desktop environments.
- `mobile` for mobile environments.
- And `all` for tests that run in both mobile and desktop environments.

While the folders are organized this way for convenience, if you are writing a new test suite you will have to use tags to tell playwright which environments to run the suite in.  This is done in the describe block:
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
We want the E2E test suite to be as easy to read as possible.  That means most of the logic of a test should be in the test itself, and not hidden in classes or methods.

#### 1. Use component objects
Instead of building large page objects that do everything, we recommend creating small component objects:
- Most component objects should be simple javascript objects created with a factory function.  Example: [ThemeMenu.ts](frontend/test-e2e/component-objects/ThemeMenu.ts)
- In rare occasions where a component requires more complicate code, you may use a class.  Example: [SidebarLeft.ts](frontend/test-e2e/component-objects/SidebarLeft.ts)
- Use component objects directly in your tests instead combining them into larger objects.

> [!NOTE]
> You may notice we do have a page-objects directory, but the objects in there are written just like component-objects.

#### 2. Code re-use
Avoiding complicated patterns means there will be more duplicate code in the E2E tests.  This is fine and preferable to code that difficult to read.  However, if there are sequences of user actions you want to re-use between tests, we recommend using simple functions:

The steps to do this are:
1. Wrap the lines from your test that you want to re-use in a function.
2. Move that function into a file in `frontend/test-e2e/actions` and name it based on the action being performed.
3. Import the function into the test files where you use it.

## Component / Unit Tests

For component and unit tests we are using Vitest and Vue Testing Library. For a general overview on how to write these tests, see the documentation for the [Testing Library Frameworks](https://testing-library.com/docs/).

Nuxt also has [testing guide](https://nuxt.com/docs/getting-started/testing#%EF%B8%8F-helpers) for Nuxt's additional testing tools.

> [!IMPORTANT]
> There are some important differences between how we recommend writing tests and the Nuxt guide.  The recommendations for this project are below:

### 1. Write tests in the `frontend/test` directory:

This directory's structure should mirror the frontend directory structure as a whole. If the corresponding directory for the component you are testing does not exist in `frontend/test` yet, please create one and add your new test there.

### 2. Use the render method in `frontend/test/render.ts`.

This render method has been customized to allow our major Nuxt plugins to work in the Vitest environment.  If you are curious you can check [render.ts](frontend/test/render.ts) and [setup.ts](frontend/test/render.ts) in the `frontend/test` directory to see how this works.

### 3. Avoid using mocking when possible:

The Nuxt guide recommends a classic approach to testing where you mock every dependency in the component / function you are testing. This approach has some serious drawbacks: it can make it harder to refactor code and maintain tests over time.

We recommend using mocking for dependencies that are unreliable and/or slow, like network requests. You can find a more in-depth explanation on the pros and cons of mocking on [Martin Fowler's blog](https://martinfowler.com/articles/mocksArentStubs.html).

**Mocks we do recommend:**

* We provide a global mock for `useColorMode`. This is necessary because `useColorMode` currently does not work in Vitest. See example use in [useColorModeImages.spec.ts](frontend/test/composables/useColorModeImages.spec.ts).
* Nuxt provides a `registerEndpoint` function to mock network requests. See example use in [sign-in.spec.ts](frontend/test/pages/auth/sign-in.spec.ts).
