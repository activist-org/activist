# Changelog

See the [releases for activist](https://github.com/activist-org/activist/releases) for an up to date list of versions and their release dates.

activist tries to follow [semantic versioning](https://semver.org/), a MAJOR.MINOR.PATCH version where increments are made of the:

- MAJOR version when we make incompatible API changes
- MINOR version when we add functionality in a backwards compatible manner
- PATCH version when we make backwards compatible bug fixes

Emojis for the following are chosen based on [gitmoji](https://gitmoji.dev/).

<!--
### ✨ New Features
### 🎨 Design Changes
### 🐞 Bug Fixes
### ♻️ Code Refactoring
-->

# [Upcoming] activist 0.1.0

### ✨ Features

- Content to describe the goal of activist.
- Search results for events, organizations, and resources.
- Metric cards display new organizations and events to the user.
- Links to activist GitHub and socials as well as supporter websites.
- Landing page elements are reactive to screen sizes.
- Image popup to get a better view of the images.
- A left sidebar component has been made to house all the navigation for the platform.
  - The sidebar has collapsed and expanded states to provide more room to work.
  - The collapsed state transitions directly to expanded upon hovering.
- A right sidebar component has been made to house select menu options given the page the user is on.
- Header and tab bar components have been made for navigation on the frontend.
- Sidebar filters for search results allow people to easily find events and organizations.
- Data transfer between the Django backend and Nuxt frontend.
<!-- - A calendar component has been made to show when events are occurring and to select when they will occur. -->

### 🎨 Design

- Light and dark mode with color mode preferences.
- Brand colors have been defined for light and dark mode.
- Card components to compartmentalize platform functionality.
- Custom icons have been implemented for the platform to better describe certain interactions.
- Layouts for event and organization pages as well as sub pages have been defined.

### ♿️ Accessibility

- Buttons are given aria labels to make sure they're accessible.

### 🌐 Localization

- Localization switching with routing applied to links.
- Aria labels are written using translatable strings for localized accessibility.

### ⚖️ Legal

- Baseline trademark policy for the activist brand.
- A privacy policy that details a focus on user data protection and keeping users safe.

### 📝 Documentation

- Contributing guidelines detail resources to learn the tech stack, Git processes and where to ask for help.
- Development environment setup documented in the project readme and contributing guidelines.
- A style guide was made to direct development using agreed to methods.
