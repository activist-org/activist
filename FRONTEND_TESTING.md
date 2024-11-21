# Frontend Testing

## Component / Unit Tests

For component and unit tests we are using vitest.  For a general overview on how to write these tests, see the [Nuxt testing guide](https://nuxt.com/docs/getting-started/testing#%EF%B8%8F-helpers)

### Activist Recommendations

There are some differences between our approach to testing and the official Nuxt recommendations:

#### 1. Write tests in the `frontend/test` directory:

This directory's structure should mirror the frontend directory structure as a whole.  If the corresponding directory for the component you are testing does not exist in `frontend/test` yet, please create one and add your new test there.

#### 2. Use the render method in `frontend/test/render.ts` instead of `renderSuspended`:
This render method has been customized to allow our major Nuxt plugins to work in the vitest environment.  If you are curious you can check [render.ts](frontend/test/render.ts) and [setup.ts](frontend/test/render.ts) in the `frontend/test` directory to see how this works.

#### 3. Avoid using mocking when possible:
The Nuxt guide recommends a classic approach to testing where you mock every dependency in the component / function you are testing.  This approach has some serious drawbacks: it can make it harder to refactor code and maintain tests over time.

We recommend using mocking for dependencies that are unreliable and/or slow, like network requests.  You can find a more in-depth explanation on the pros and cons of mocking on [Martin Fowler's blog](https://martinfowler.com/articles/mocksArentStubs.html).

**Mocks we do recommend:**
* We provide a global mock for `useColorMode`.  This is necessary because `useColorMode` currently does not work in vitest.  See example use in [useColorModeImages.spec.ts](frontend/test/composables/useColorModeImages.spec.ts).
* Nuxt provides a `registerEndpoint` function to mock network requests.  See example use in [sign-in.spec.ts](frontend/test/pages/auth/sign-in.spec.ts).

> [!NOTE]
> The `registerEndpoint` function does not allow changing status codes on the response yet.  You may need to mock `$fetch` to get around this until we find a better workaround.
