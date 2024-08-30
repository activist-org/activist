# Changelog

See the [releases for activist](https://github.com/activist-org/activist/releases) for an up to date list of versions and their release dates.

activist tries to follow [semantic versioning](https://semver.org/), a MAJOR.MINOR.PATCH version where increments are made of the:

- MAJOR version when we make incompatible API changes
- MINOR version when we add functionality in a backwards compatible manner
- PATCH version when we make backwards compatible bug fixes

Emojis for the following are chosen based on [gitmoji](https://gitmoji.dev/).

## [Upcoming] activist 0.1.0

### 🚀 Deployment

- The Django backend is deployed via Docker and Docker Compose.
- The Nuxt frontend is deployed via Netlify.
- All data is saved on [FlokiNET](https://flokinet.is/) Iceland virtual private servers to assure maximum security.

### ✨ Features

- Content to describe the goals of activist.org.
- Data transfer between the Django backend and Nuxt frontend.
- Links to activist GitHub and socials as well as supporter websites.
- All page elements are reactive to screen sizes for desktop and mobile usage.
- Page media elements include an image carousel and a location map.
  - Modal expand and full screen modes are available for media components.
  - Image uploads are available through the image component with drag and drop and file selection being possible.
  - Directions can be used on the media map to find ones way.
  - Location services can be applied in browser so the user can find themselves on the map.
- A left sidebar component has been made to house all the navigation for the platform.
  - The sidebar has collapsed and expanded states to provide more room to work.
  - The collapsed state transitions directly to expanded upon hovering or focussing.
- A right sidebar component has been made to house select menu options given the page the user is on.
- Header and tab bar components have been made for navigation on the frontend.

### 🎨 Design

- The [open designs on Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?type=design&node-id=805%3A231&mode=design&t=CCEaR5guqffxm3mW-1) have been created with current and long term designs.
- Light and dark mode with color mode preferences.
- Brand colors have been defined for light and dark mode.
- Card components to compartmentalize platform functionality.
- Custom icons have been implemented for the platform to better describe certain features.
- Layouts for organization, group, event and many other pages have been defined.

### ♿️ Accessibility

- All buttons are given aria labels for screen readers.
- All images are given alternate texts for screen readers.
- Transitions are removed for users with motion sickness.
- Colors have been chosen to make sure that their contrast is enough for easy readability.
- Accessibility checks are integrated with the pull request workflow.

### 🌐 Localization

- Localization switching is achieved via a dropdown with routing applied to links.
- All platform texts are written in JSON files for easy localization.
- A localization process has been set up with [Weblate](https://weblate.org).
- Aria labels are written using translatable strings for localized accessibility.

### ♻️ Code Quality

- TypeScript is applied throughout the frontend.
- Pull request workflows have been created to lint new code for style and errors.

### ⚖️ Legal

- Baseline trademark policy for the activist brand has been created.
- A privacy policy has been compiled that details a focus on user data protection and keeping users safe.

### 📝 Documentation

- Contributing guidelines detail resources to learn the tech stack, Git processes and where to ask for help.
- The development environment setup has been documented in the project readme and contributing guidelines.
- A style guide was made to direct development using agreed to practices.
- Documentation of the activist community and its practices was included to help new people join.
