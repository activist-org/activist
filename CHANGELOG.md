# Changelog

See the [releases for activist](https://github.com/activist-org/activist/releases) for an up to date list of versions and their release dates.

activist tries to follow [semantic versioning](https://semver.org/), a MAJOR.MINOR.PATCH version where increments are made of the:

- MAJOR version when we make incompatible API changes
- MINOR version when we add functionality in a backwards compatible manner
- PATCH version when we make backwards compatible bug fixes

Emojis for the following are chosen based on [gitmoji](https://gitmoji.dev/).

# activist 0.0.1

### ✨ Features

- Content to describe the goal of activist
- Links to supporter websites
- Links to activist GitHub and socials
- Color mode switching
- Localization switching with routing applied to links
- Landing page elements are reactive to screen sizes

### 🎨 Design

- Light and dark mode colors defined and applied

### Description
- to ensure all icons on `Sidebar` are centered introduced css classes `basis-full justify-center gap-1` to `menuSelector`
- wrapped the `menuSelector` icon in a span and also wrapped both the `menuSelector` icon and text in a div similar to `sidebaFooter` -> `DisclosureButton`
- applied a basis to both the icon and text in `menuSelector`
- applied similar styles to `sidebaFooter` as those in `menuSelector` list 

### Related issue

<!--- activist prefers that pull requests be related to already open issues. -->
<!--- If applicable, please link to the issue by replacing ISSUE_NUMBER with the appropriate number below. -->
<!--- Feel free to delete this section if this does not apply. -->

- #107
