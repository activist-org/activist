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
- [Icons](#icons)
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

Please see the [Vue.js style guide](https://vuejs.org/style-guide) for general suggestions on how to write Vue files.

<a id="typescript"></a>

## TypeScript [`⇧`](#contents)

PRs are always welcome to improve the developer experience and project infrastructure!

Currently `typescript.strict` and `typescript.typeCheck` in `nuxt.config.ts` are not enabled. This may change in the future. Strict type checks are not enabled to allow building the app outside `Docker`. Local and Netlify builds proceed despite TS errors with strict checks disabled.

> [!NOTE]\
> For VS Code users: it is recommended to install these extensions to enable in-editor type-checking:
>
> - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
> - [Volar TS](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Vue Single File Component (.vue file) Guidelines

- Create general frontend types in the [frontend/types](https://github.com/activist-org/activist/tree/main/frontend/types) directory
- When typing Arrays, use `arrayElementType[]` rather than the generic type `Array<T>` unless [extending](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays):

```ts
const strArray: string[] = ["Thank", "you", "for", "contributing!"];
```

- activist uses the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html), so please implement `<script setup lang="ts">` and use `defineProps` with the generic type argument.

```typescript
// No need to define `props` if we won't be accessing them in the `<script>` block.
const props = defineProps<{
  foo: string;
  bar?: number;
}>();
```

- Please also use `withDefault` when types require [default values](https://vuejs.org/guide/typescript/composition-api.html#props-default-values)

See [Vue and TypeScript docs](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props) for more information about typing component props.

There is a limited set of package types that are available in the global scope. The current list can be found in `frontend/tsconfig.json` under `"compilerOptions.types"`, with this list being modified as the project matures.

Before opening a new PR, it is recommended to first generate the current types, then manually check those types:

1. cd into `frontend`
2. run `yarn run postinstall` to generate types in `frontend/.nuxt`
3. run `yarn nuxi typecheck`

Within VS Code TS errors are visible, however, running these commands will help to ensure the new code does not introduce unintended TS errors at build time. Existing TS errors may be ignored. PRs are always welcome to address these errors!

<a id="tailwind"></a>

## Tailwind [`⇧`](#contents)

activist uses [Tailwind CSS](https://tailwindcss.com/) for CSS styling and [Headless UI](https://headlessui.com/) unstyled, accessible components for more complex page elements like dropdowns and popups. Tailwind styles are applied via space-separated `class="STYLE"` attributes on HTML elements in Vue `<template>` blocks. Generally these class attributes should be the first applied to an element and thus proceed all Vue component props so differences from shared styling are apparent:

- ✅ `<MyComponent class="STYLE" propName="value"/>`
- ❌ `<MyComponent propName="value" class="STYLE"/>`

Please note that as activist uses Tailwind, this means that `<style>` blocks are often times not used within Vue Single-File Components. `<style>` blocks should only be used in cases where including the styles within the `<template>` block would be overly complex or if Tailwind does not support a certain style parameter. The team understands that Tailwind at times can lead to very long style classes, but because of this we make use of the custom classes [below](#common-styles) to combine commonly used elements into consistent, responsive drop-in attributes.

<a id="common-styles"></a>

## Common styles [`⇧`](#contents)

The following are custom Tailwind classes from [frontend/assets/css/tailwind.css](https://github.com/activist-org/activist/blob/main/frontend/assets/css/tailwind.css) that are consistently used within the activist frontend codes:

- `focus-brand`

  - Creates a custom brand styled orange ring around an element when it is focussed for both light and dark mode
  - Should be used on all elements that the user can focus (buttons, links, dropdowns, menu items, etc)

- `link-text`

  - Color and hover color are defined for links for both light and dark mode

- `card-style`

  - Applies styles for consistent cards across activist's pages
  - Colors are defined for light and dark mode with border width and radius also being applied
  - Used in cases like about page sections, search results, etc

> [!NOTE]\
> There's also custom styles available to make development easier such as `bg-breakpoint-test` that changes the background of the element it's applied to based on the current breakpoint.

<a id="formatting"></a>

## Formatting [`⇧`](#contents)

The activist frontend uses [Prettier](https://prettier.io/) to format the code and [Headwind](https://github.com/heybourn/headwind) to sort Tailwind CSS classes. Backend code that's written in Python should be formatted using [black](https://github.com/psf/black). The team suggests that you set up your environment to autoformat using te these formatters on save. We have workflows to check formatting for pull requests and will notify you if something's wrong :)

<a id="colors"></a>

## Colors [`⇧`](#contents)

The file [frontend/tailwind.config.ts](https://github.com/activist-org/activist/blob/main/frontend/tailwind.config.ts) defines all colors within the `colors` section of the `theme` configuration. All brand colors are split first by `light` and `dark` mode in their names and then the general usage of the color followed by qualifiers such as `hover`. The reason for this naming criteria is to avoid repeat styling keywords like `text-text-light` that might lead to confusion or leaving it as just `text-light` rather than applying the usage and then the color. The prior style would correctly be applied via `text-light-text`.

Note that for all colors we need to apply both the light and dark mode variants. In Tailwind this is done by placing the `dark:` prefix before a class. An example of this is the following where we'll set the background of an element to the header color for both light and dark mode:

```html
<!-- This div has a background that reacts to the color mode. -->
<div class="bg-light-header dark:bg-dark-header"></div>
```

Note further that Tailwind allows for alpha components for opacity to be applied to colors directly within the class declaration. We thus do not need to save versions of colors with transparency unless they are inherently used with an alpha less than one. An example of a color that has an inherent non-one alpha is `light-text` (`"rgba(0, 0, 0, 0.85)"`). To apply an alpha component to a color in Tailwind you follow it with a slash and the alpha that should be used as in the following example:

```html
<!-- The background of this div has 40% opacity. -->
<div class="bg-light-cta-orange/40"></div>
```

<a id="font"></a>

## Font [`⇧`](#contents)

The fonts for activist are [Red Hat Text and Red Hat Display](https://www.redhat.com/en/about/brand/standards/typography) as defined in [frontend/tailwind.config.ts](https://github.com/activist-org/activist/blob/main/frontend/tailwind.config.ts). `Red Hat Text` is applied throughout the website and `Red Hat Display` is used for all headers by applying `font-display`. As headers are generally defined by `responsive-h#` custom classes that include `font-display`, it will be rare that you'll need to apply it directly. See the next section for more details.

<a id="text-size"></a>

## Text size [`⇧`](#contents)

[frontend/assets/css/tailwind.css](https://github.com/activist-org/activist/blob/main/frontend/assets/css/tailwind.css) defines custom combinations of default and activist defined Tailwind header sizes. Responsive header classes all have `font-display` applied to them. The naming criteria of these headers follows that of HTML headers so that the team remembers that when a `responsive-h#` tag is used that it should be applied to a coinciding `<h#>` tag for accessibility. Note that headers should generally have a `bold` style applied to them as well, with for example page headers being defined as follows:

```html
<!-- The size and weight styles for page headers. -->
<h1 class="font-bold responsive-h1">Page Header</h1>
```

<a id="localization"></a>

## Localization [`⇧`](#contents)

activist is a global platform and must function in countless different regions around the world. To achieve this, all strings on the platform must be defined using keys found in the [i18n directory of the frontend](https://github.com/activist-org/activist/tree/main/frontend/i18n).

> [!NOTE]\
> All keys should be defined within the [en-US.json file](https://github.com/activist-org/activist/blob/main/frontend/i18n/en-US.json)
>
> - This is the source from which all the other languages are translated from
> - Edits to the other files need to be made on activist's [public localization project on Transifex](https://explore.transifex.com/activist-org/activist)
> - Alphabetize the keys except for indexes within page routes that should come first
> - Do not include periods in aria-labels (screen reader user will configure their own preferences for a hard stop)
> - Put the aria label as the last attribute on any given element so it's easier to see if it's missing

Localization keys should be defined based on their component or page within the platform and the content that they refer to (`CONTENT_REFERENCE` below). Please use the following rules as a guide if you find yourself needing to create new localization keys:

- Separate directories and references by `.` and CamelCase file name words by `-` in keys
  - Ex: `"components.search-bar.CONTENT_REFERENCE"` for the `SearchBar` component
- If the localization key is being passed to a component prop, include it in the content reference
  - Ex: `"components.topic-marker.topic.CONTENT_REFERENCE"` for passing a localized `topic` prop to the `TopicMarker` component
    - `"CONTENT_REFERENCE"` in this case would be a reference to the name of a topic like `"environment"`
- Even though Nuxt allows for us to nest components in directories, avoid repetition in the directory path used to define the localization key
  - Ex: if you're defining a key within `SidebarLeftFooter`:
    - ✅ `"components.sidebar-left-footer.CONTENT_REFERENCE"`
    - ❌ `"components.sidebar.left.sidebar-left-footer.CONTENT_REFERENCE"`
- Define keys based on the lowest level component or other entity in which they're used
  - Ex: you're working on the about page for organizations and there's a `BtnLabeled` that's getting a localization key:
    - ✅ `"components.btn-labeled.CONTENT_REFERENCE"`
    - ❌ `"pages.organizations.id.about.CONTENT_REFERENCE"`
  - The reason for this is we want to make sure that we can reuse keys wherever we can
    - In the above example, if we defined the key based on its location on the organization about page when it's a `BtnLabeled` with a text like `"Support"`, then we'd need to create a different version of this key for each occurrence of the button depending on the location
    - With the system detailed above, we have the `components.btn-labeled.label.support` key that we can use anywhere that we have a support button ✨
- For pages with long texts please follow the below naming criteria:
  - `"header"`: the main header (h1) of the given page
  - `"section-#"`: a section that iterates by one with every header and subheader
  - `"section-#-#"`: a subsection, with other `#-#` patterns also being possible (see below)
  - `"section-#-subheader"`: marks the start of a new section (h2 and beyond)
  - `"section-#-paragraph-#"`: a paragraph with one or more sentences
  - `"section-#-paragraph-#-#"`: a paragraph with separate parts to insert things like links
  - `"section-#-list-#-item-#"`: an item in a list
  - `"section-#-list-#-item-#-#"`: a subitem of the given item

The activist team is happy to help if there's any confusion with the above rules! Feel free to ask in the issue you're working on or even check once a PR is made and we'll make sure that conventions are being followed.

<a id="icons"></a>

## Icons [`⇧`](#contents)

activist uses [nuxt-icon](https://github.com/nuxt-modules/icon) for all icons. Icons are defined via `<Icon name="ICON_NAME"/>` components, with [Icônes](https://icones.js.org/) being a good place to look for [Iconify](https://iconify.design/) based files to import. The `<Icon/>` component also has a `size` argument that `em` based arguments can be passed to. There's also a `color` argument, but colors are handled with Tailwind CSS via the `text-COLOR` class argument.

Custom icons for activist can further be found in the [Icon directory of the frontend components](https://github.com/activist-org/activist/tree/main/frontend/components/Icon). These icons can also be referenced via the `<Icon>` component via their file name (ex: `<Icon name="IconSupport">` for the grasped hands we use). For Tailwind coloration note that we need to use `fill-COLOR` for the custom activist icons rather than `text-COLOR`.

<a id="tab-size"></a>

## Tab size [`⇧`](#contents)

Codes on the frontend for Vue (`<template>`, `<script>` and `<style>` blocks), TypeScript, CSS and other related files should use two spaces for tabs. For the backend four spaces should be used for Python files.

<a id="padding"></a>

## Padding [`⇧`](#contents)

There are a few custom padding classes that can be used for `px` and `py` styling as defined in [frontend/assets/css/tailwind.css](https://github.com/activist-org/activist/blob/main/frontend/assets/css/tailwind.css). Please use consistent custom padding classes to assure that elements move together at different breakpoints.
