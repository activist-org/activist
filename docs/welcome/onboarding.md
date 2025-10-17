# Activist Onboarding

Welcome to the Activist community! This document will guide you through the essential information you need to get started as a contributor.

## 1. Project Overview

### What is Activist?

Activist is a platform that enables more people to safely engage in activism by making it easy to discover organizations and events as well as coordinate and collaborate on political action. We want to enable activists to learn proven and novel strategies from each other for social and ecological change. Free, open-source, privacy-focused and governed by our community.

### Architecture

The project follows a classic client-server architecture, containerized with Docker.

*   **Backend:** A Django-based REST API.
*   **Frontend:** A Nuxt.js (Vue.js framework) single-page application.
*   **Database:** PostgreSQL
*   **Containerization:** The project uses Docker for local development, which simplifies setup and ensures consistency.

## 2. Getting Started

### Prerequisites

To get started, you'll need:

*   [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/)
*   Python 3.11+
*   An IDE like VS Code with recommended extensions (see [CONTRIBUTING.md](CONTRIBUTING.md#dev-env-))

### Local Setup

For detailed instructions on setting up your local development environment, including forking the repository, setting up remotes, creating a virtual environment, installing dependencies, and running Docker, please refer to the [Development environment section in CONTRIBUTING.md](CONTRIBUTING.md#dev-env-).

Once set up, you can access:

*   Frontend: http://localhost:3000
*   Backend Admin: http://localhost:8000/admin

## 3. How We Work

### Issue Tracking

We use GitHub Issues to track bugs, feature requests, and other tasks. You can find more details on how we use issues in the [CONTRIBUTING.md](CONTRIBUTING.md#issues-projects) document.

### Pull Requests

We follow the GitHub flow for contributions. Please create a new branch for your feature or fix and open a pull request against the `main` branch. For a detailed guide on our pull request process, see the [Pull requests section in CONTRIBUTING.md](CONTRIBUTING.md#pull-requests-).

### Coding Style

Please refer to our [STYLEGUIDE.md](STYLEGUIDE.md) for coding style guidelines. We use `pre-commit` hooks to enforce these standards, as described in [CONTRIBUTING.md](CONTRIBUTING.md#pull-requests-).

### Commit Messages

We encourage the use of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). More information can be found in the [Pull requests section of CONTRIBUTING.md](CONTRIBUTING.md#pull-requests-).

## 4. Terminology

*   **Organization:** A group of people working together on a cause.
*   **Event:** An action or a meeting organized by an organization.
*   **Community:** The network of organizations and individuals using the Activist platform.
*   **Content:** Resources, articles, and other information shared on the platform.

## 5. Next Steps

Now that you have a better understanding of the project and how we work, here are some suggestions for your next steps:

*   **Join the Community:** Connect with us in our [public Matrix chat rooms](https://matrix.to/#/#activist_community:matrix.org). Please also review our [Code of Conduct](.github/CODE_OF_CONDUCT.md) to understand the community guidelines.
*   **Find an Issue:** Look for issues labeled [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first_issue%22) on GitHub to get started with a manageable task. You can also explore the [Projects board](https://github.com/orgs/activist-org/projects/1) to see what's currently being worked on.
*   **Submit your First PR:** Once you've made changes, follow our [Pull Request guidelines](CONTRIBUTING.md#pull-requests-) to submit your contribution. Remember to adhere to the [STYLEGUIDE.md](STYLEGUIDE.md) for consistent code style.
*   **Attend Developer Syncs:** Consider joining our [bi-weekly developer sync](https://etherpad.wikimedia.org/p/activist-dev-sync) to connect with the team and discuss ongoing development.
*   **Explore Other Contribution Areas:**
    *   **Localization:** Help us translate Activist into other languages on [Weblate](https://hosted.weblate.org/projects/activist/activist).
    *   **Testing:** Contribute to our testing efforts (unit, component, and E2E tests). See [CONTRIBUTING.md#testing-](CONTRIBUTING.md#testing-) for more details.
    *   **Design & Accessibility:** Share your ideas for design improvements or help us enhance accessibility. You can also check out our [public designs on Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?type=design&node-id=10%3A18&mode=design&t=tdQyOtl5lU1n7oLN-1). Refer to [CONTRIBUTING.md#design-](CONTRIBUTING.md#design-) and [CONTRIBUTING.md#accessibility-](CONTRIBUTING.md#accessibility-) for more information.
*   **Ask for Help:** Don't hesitate to ask questions in the Matrix chat or on GitHub if you get stuck or need clarification.
