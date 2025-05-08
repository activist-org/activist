# Style Guidelines for activist.org

Thank you for following our style guide! The team asks that you familiarize yourself with this guide and follow it for any contributions. Doing so makes PRs and general code collaboration much more effective :)

We'll also link to this document in cases where these guidelines have not been followed. If that's what brought you here, no stress! Thanks for your interest and your drive to contribute to open-source and activist in particular! ❤️

If you have questions or would like to communicate with the team, please [join us in our public Matrix chat rooms](https://matrix.to/#/#activist_community:matrix.org). We'd be happy to hear from you!

<a id="contents"></a>

## **Contents**

- [Vue and Nuxt](#vue-and-nuxt)
- [TypeScript](#typescript)
- [Tailwind](#tailwind)
- [Common styles](#common-styles)
- [Formatting](#formatting)
- [Colors](#colors)
- [Font](#font)
- [Text size](#text-size)
- [Localization](#localization)
- [Images and Icons](#images-icons)
- [Tab size](#tab-size)
- [Padding](#padding)

<a id="vue-and-nuxt"></a>

## Vue and Nuxt [`⇧`](#contents)

The frontend for activist is written in the framework [Vue.js](https://vuejs.org/) and specifically the meta-framework [Nuxt.js](https://nuxt.com/). The team chose Vue because of its broad usage across the development industry as well as relative ease of use and adoption for new contributors. Most of all we appreciate the structure that Vue adds to a project by leveraging the order of HTML and adding scripting and styling on top. Nuxt expands on Vue seamlessly and includes many [modules](https://nuxt.com/modules) to make development much easier.

Vue files (`.vue`) are Single-File Components that have `<template>`, `<script>` and `<style>` blocks. Conventions for writing Vue for activist include:

- `<template>` blocks should come first, `<script>` second and `<style>` last
- The Vue [Composition API](https://vuejs.org/guide/introduction.html#composition-api) should be used in all cases
- [TypeScript](https://www.typescriptlang.org/) should be used wherever possible within `<script>` blocks with `defineProps`
- Self-closing components (`<Component />`) should be used for any component that doesn't have content
  - Generally if a component has a `<slot>` then this would imply that it would normally have content and thus require a closing tag
- Use `camelCase` for prop names for both declaration and within single file components
- For element attribute order please use the following:

```html
<element
  v-attributes=""
  @attributes=""
  ref=""
  key=""
  id=""
  class=""
  :class="{}"
  props=""
  other-attributes=""
  aria-label=""
></element>
```

> [!NOTE]
> Put the aria label as the last attribute on any given element so it's easy to see if it's missing (`aria-label` for as an HTML attribute and `ariaLabel` as a component prop)

Please see the [Vue.js style guide](https://vuejs.org/style-guide) for general suggestions on how to write Vue files.

### Page Routing

Page routing should use the `<NuxtLink />` component wherever possible to assure that the platform maintains the localization path of the user. If an external link via an `<a>` tag should be set, then please include `target="_blank"` to open a new tab (unless it's an email href).

### Breakpoints

activist uses Tailwind for CSS, and some parts of components will be conditionally rendered based on Tailwind breakpoints, but we want to avoid using it to show and hide whole components. The reason for this is that using CSS in this way means that unneeded TypeScript for the hidden components will still run on page load. Please use `useBreakpoint` for all conditional rendering of full components.

- ✅ No TS ran:

   ```vue
    <template>
      <MyComponent v-if="aboveMediumBP" />
    </template>

   <script setup lang="ts">
      const aboveMediumBP = useBreakpoint("md");
   </script>
   ```
- ❌ TS still ran:

    ```vue
    <template>
      <MyComponent class="hidden md:block" />
    </template>
    ```

<a id="typescript"></a>

## TypeScript [`⇧`](#contents)

PRs are always welcome to improve the developer experience and project infrastructure!

> [!NOTE]
> For VS Code users: it is recommended to install Vue extensions to enable in-editor type-checking:
>
> - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Vue Single File Component (.vue file) Guidelines

- Create general frontend types in the [frontend/types](frontend/types) directory
- When typing Arrays, use `arrayElementType[]` rather than the generic type `Array<T>` unless [extending](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays):

```ts
const strArray: string[] = ["Thank", "you", "for", "contributing!"];
```

- activist uses the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html), so please implement `<script setup lang="ts">` and use `defineProps` with the generic type argument.

```typescript
// No need to define `props` if we won't be accessing them in the `<script>` block.
const props = defineProps<{
  foo: string;
  bar?: number; // optionalProp?
}>();
```

- Type assignments should be lower case, so `string` instead of `String`
- Use `withDefaults` when types require [default values](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props) as in the following example:

```typescript
export interface Props {
  foo: string;
}

const props = withDefaults(defineProps<Props>(), {
  foo: "default",
});
```

See [Vue and TypeScript docs](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props) for more information about typing component props.

There is a limited set of package types that are available in the global scope. The current list can be found in `frontend/tsconfig.json` under `"compilerOptions.types"`, with this list being modified as the project matures.

Before opening a new PR, it is recommended to first generate the current types, then manually check those types:

1. cd into `frontend`
2. run `yarn postinstall` to generate types in `frontend/.nuxt`
3. run `yarn typecheck`

Within VS Code TS errors are visible, however, running these commands will help to ensure the new code does not introduce unintended TS errors at build time. Existing TS errors may be ignored. PRs are always welcome to address these errors!

<a id="tailwind"></a>

## Tailwind [`⇧`](#contents)

activist uses [Tailwind CSS](https://tailwindcss.com/) for CSS styling and [Headless UI](https://headlessui.com/) unstyled, accessible components for more complex page elements like dropdowns and popups. Tailwind styles are applied via space-separated `class="STYLE"` attributes on HTML elements in Vue `<template>` blocks. Generally these class attributes should be the first applied to an element and thus proceed all Vue component props so differences from shared styling are apparent:

- ✅ `<MyComponent class="STYLE" propName="value"/>`
- ❌ `<MyComponent propName="value" class="STYLE"/>`

Please note that as activist uses Tailwind, this means that `<style>` blocks are often times not used within Vue Single-File Components. `<style>` blocks should only be used in cases where including the styles within the `<template>` block would be overly complex or if Tailwind does not support a certain style parameter. The team understands that Tailwind at times can lead to very long style classes, but because of this we make use of the custom classes [below](#common-styles) to combine commonly used elements into consistent, responsive drop-in attributes.

<a id="common-styles"></a>

## Common styles [`⇧`](#contents)

The following are custom Tailwind classes from [frontend/assets/css/tailwind.css](frontend/assets/css/tailwind.css) that are consistently used within the activist frontend codes:

- `focus-brand`

  - Creates a custom brand styled orange ring around an element when it is focussed for both light and dark mode
  - Should be used on all elements that the user can focus (buttons, links, dropdowns, menu items, etc)

- `link-text`

  - Color and hover color are defined for links for both light and dark mode

- `card-style`

  - Applies styles for consistent cards across activist's pages
  - Colors are defined for light and dark mode with border width and radius also being applied
  - Used in cases like about page sections, search results, etc

> [!NOTE]
> There's also custom styles available to make development easier such as `bg-breakpoint-test` that changes the background of the element it's applied to based on the current breakpoint.

<a id="formatting"></a>

## Formatting [`⇧`](#contents)

The activist frontend uses [Prettier](https://prettier.io/) to format the code and [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to sort Tailwind CSS classes. Backend code that's written in Python should be formatted using [black](https://github.com/psf/black). The team suggests that you set up your environment to autoformat using te these formatters on save. We have workflows to check formatting for pull requests and will notify you if something's wrong :)

<a id="colors"></a>

## Colors [`⇧`](#contents)

The files [frontend/tailwind.config.ts](frontend/tailwind.config.ts) and [frontend/assets/css/tailwind.ts](frontend/assets/css/tailwind.ts) define all colors for the platform. Light and dark mode versions of each color are defined and loaded in via variables such that we only need to use a singular identifier throughout the codebase. There are however cases where you still need to specify `dark:` for colors - specifically when the color identifier for light mode is different than dark mode like in cases of CTA buttons where the text and border are `primary-text` in light mode and `cta-orange` in dark mode.

```html
<!-- This div has a reactive background color as layer-2 is defined variably based on the color mode. -->
<div class="bg-layer-2"></div>
```

Note further that Tailwind allows for alpha components for opacity to be applied to colors directly within the class declaration. We thus do not need to save versions of colors with transparency unless they are inherently used with an alpha less than one. An example of a color that has an inherent non-one alpha is `primary-text` (`rgba(var(--primary-text), 0.85)`). To apply an alpha component to a color in Tailwind you follow it with a slash and the alpha that should be used as in the following example:

```html
<!-- The background of this div has 40% opacity. -->
<div class="bg-cta-orange/40"></div>
```

<a id="font"></a>

## Font [`⇧`](#contents)

The fonts for activist are [Red Hat Text and Red Hat Display](https://www.redhat.com/en/about/brand/standards/typography) as defined in [frontend/tailwind.config.ts](frontend/tailwind.config.ts). `Red Hat Text` is applied throughout the website and `Red Hat Display` is used for all headers by applying `font-display`. As headers are generally defined by `responsive-h#` custom classes that include `font-display`, it will be rare that you'll need to apply it directly. See the next section for more details.

<a id="text-size"></a>

## Text size [`⇧`](#contents)

[frontend/assets/css/tailwind.css](frontend/assets/css/tailwind.css) defines custom combinations of default and activist defined Tailwind header sizes. Responsive header classes all have `font-display` applied to them. The naming criteria of these headers follows that of HTML headers so that the team remembers that when a `responsive-h#` tag is used that it should be applied to a coinciding `<h#>` tag for accessibility. Note that headers should generally have a `bold` style applied to them as well, with for example page headers being defined as follows:

```html
<!-- The size and weight styles for page headers. -->
<h1 class="font-bold responsive-h1">Page Header</h1>
```

<a id="localization"></a>

## Localization [`⇧`](#contents)

activist is a global platform and must function in countless different regions around the world. To achieve this, all strings on the platform must be defined using keys found in the [i18n directory of the frontend](frontend/i18n). We further leverage [i18n-check](https://github.com/activist-org/i18n-check) to make sure that our i18n keys are valid.

> [!NOTE]
> All keys should be defined within the [en-US.json file](frontend/i18n/en-US.json)
>
> - This is the source from which all the other languages are translated from
> - Edits to the other files should be made on activist's [public localization project on Weblate](https://hosted.weblate.org/projects/activist/activist)
> - Do not convert the JSON dictionaries into nested sub-objects!
> - The purpose of the flat dictionaries is so that we can search for the key in the codebase and easily find its uses and where it's defined
> - Do not include periods in aria-labels (screen reader user will configure their own preferences for a hard stop)

Localization keys should be defined based on the file in which they're used within the platform and the content that they refer to (`CONTENT_REFERENCE` below). Please use the following rules as a guide if you find yourself needing to create new localization keys:

- In following [i18n-check](https://github.com/activist-org/i18n-check) standards, please prepend all i18n keys with `i18n`
  - ✅ `i18n._global.foo`
  - ❌ `"_global.foo"`
  - This allows us to check all keys that are in use against those found in the `en-US.json` file
- Separate directories and references by `.` and PascalCase/camelCase file name components by `_` in keys
  - Ex: `i18n.components.landing_splash.CONTENT_REFERENCE` for the `LandingSplash` component
- Even though Nuxt allows for us to nest components in directories, avoid repetition in the directory path used to define the localization key
  - Ex: If you're defining a key within `CardAbout`:
    - ✅ `i18n.components.footer_flex.CONTENT_REFERENCE`
    - ❌ `i18n.components.footer.footer_flex.CONTENT_REFERENCE`
- Define keys based on the lowest level file in which they're used
- Use `_global` to indicate that a key is used in multiple places in a given directory
  - Ex: You're creating a key that's used by multiple landing page components:
    - ✅ `i18n.components.landing._global.CONTENT_REFERENCE`
    - ❌ `i18n.components.landing.INDIVIDUAL_COMPONENT.CONTENT_REFERENCE`
- Please end all aria-label keys with `_alt_text` so the localization team knows that they're for screen readers
- If you need a capitalized and lower case version of a word, signify the lower case version with `_lower` at the end of the key
- For pages with long texts please follow the below naming criteria:
  - `"header"`: The main header (h1) of the given page
  - `"section_#"`: A section that iterates by one with every header and subheader
  - `"section_#_#"`: A subsection, with other `#_#` patterns also being possible (see below)
  - `"section_#_subheader"`: Marks the start of a new section (h2 and beyond)
  - `"section_#_paragraph_#"`: A paragraph with one or more sentences
  - `"section_#_paragraph_#_#"`: A paragraph with separate parts to insert things like links
  - `"section_#_list_#_item_#"`: An item in a list
  - `"section_#_list_#_item_#_#"`: A subitem of the given item
- If there are different uses of the same value in one file, then alphabetically combine the final keys with dashes (ex: `header_title`)
- Please alphabetize the keys, with your code editor likely having built in functionality for this
- Please always assign the full key as a string to assure that i18n content checks can pick up if the key has been used
  - Eg: `section_1_2` and not `section_{var_number}_2`
  - This makes sure that content writers and the i18n team are only working with language that's actively in use

> [!NOTE]
> The activist community maintains the [i18n-check project](https://github.com/activist-org/i18n-check) that enforces all of the above in pull requests. Do your best and we'll help you out during the PR process! You can also join us in the [localization room on Matrix](https://matrix.to/#/!DzbdYyfhjinQBWXgQe:matrix.org?via=matrix.org) if you have questions :)

<a id="images-icons"></a>

## Images and Icons [`⇧`](#contents)

Please define all routes for images and icons in the respective [url registry utils file](frontend/utils/imageURLRegistry.s.ts) and [icon map enum](frontend/types/icon-map.ts).

activist uses [nuxt-icon](https://github.com/nuxt-modules/icon) for all icons. Icons are defined via `<Icon :name="IconMap.ICON_REF"/>` components, with [Icônes](https://icones.js.org/) being a good place to look for [Iconify](https://iconify.design/) based files to import. The `<Icon/>` component also has a `size` argument that `em` based arguments can be passed to. There's also a `color` argument, but colors are handled with Tailwind CSS via the `text-COLOR` class argument.

Custom icons for activist can further be found in the [Icon directory of the frontend components](frontend/components/icon). These icons can also be referenced via the `<Icon>` component via their file name (ex: `<Icon name="IconSupport">` for the grasped hands we use). For Tailwind coloration note that we need to use `fill-COLOR` for the custom activist icons rather than `text-COLOR`.

<a id="tab-size"></a>

## Tab size [`⇧`](#contents)

Code in the frontend for Vue (`<template>`, `<script>` and `<style>` blocks), TypeScript, CSS and other related files should use two spaces for tabs. For the backend four spaces should be used for Python files.

<a id="padding"></a>

## Padding [`⇧`](#contents)

There are a few custom padding classes that can be used for `px` and `py` styling as defined in [frontend/assets/css/tailwind.css](frontend/assets/css/tailwind.css). Please use consistent custom padding classes to assure that elements move together at different breakpoints.
