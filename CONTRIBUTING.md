# Contributing to activist.org

Thank you for contributing to activist!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, and in accordance with this project's [code of conduct](.github/CODE_OF_CONDUCT.md), other contributors will reciprocate that respect in addressing your issue or assessing patches and features.

If you have questions or would like to communicate with the team, please [join us in our public Matrix chat rooms](https://matrix.to/#/#activist_community:matrix.org). We'd be happy to hear from you!

<a id="contents"></a>

## **Contents**

- [First steps as a contributor](#first-steps-)
- [Tech stack](#tech-stack-)
- [Learning the tech stack](#learning-the-tech-stack-)
- [Development environment](#dev-env-)
- [Style guide](#style-guide-)
- [Linting](#linting-)
- [Testing](#testing-)
- [Issues and projects](#issues-projects-)
- [Bug reports](#bug-reports-)
- [Feature requests](#feature-requests-)
- [Pull requests](#pull-requests-)
- [Localization](#localization-)
- [Documentation](#documentation-)
- [Accessibility](#accessibility-)
- [Internationalization](#internationalization-)
- [Design](#design-)
- [Troubleshooting](#troubleshooting-)

<a id="first-steps-"></a>

## First steps as a contributor [`⇧`](#contents)

Thank you for your interest in contributing to activist.org! We look forward to welcoming you to the community and working with you to build a global platform for political action :) The following are some suggested steps for people interested in joining our community:

- Please join the [public Matrix chat](https://matrix.to/#/#activist_community:matrix.org) to connect with the community
    - [Matrix](https://matrix.org/) is a network for secure, decentralized communication
    - activist would suggest that you use the [Element](https://element.io/) client
    - The [General](https://matrix.to/#/!uIGQUxlCnEzrPiRsRw:matrix.org?via=matrix.org&via=effektio.org&via=acter.global) and [Development](https://matrix.to/#/!CRgLpGeOBNwxYCtqmK:matrix.org?via=matrix.org&via=acter.global&via=chat.0x7cd.xyz) channels would be great places to start!
    - Feel free to introduce yourself and tell us what your interests are if you're comfortable :)
- Read through this contributing guide and the [style guide](STYLEGUIDE.md) for all the information you need to contribute
- Look into issues marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and the [Projects board](https://github.com/orgs/activist-org/projects/1) to get a better understanding of what you can work on
- Check out our [public designs on Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?type=design&node-id=10%3A18&mode=design&t=tdQyOtl5lU1n7oLN-1) to understand activist's goals and direction
- Consider joining our [bi-weekly developer sync](https://etherpad.wikimedia.org/p/activist-dev-sync)!

<a id="tech-stack-"></a>

## Tech Stack [`⇧`](#contents)

The following are the current and planned technologies for [activist.org](https://activist.org):

### Frontend

- [Nuxt.js](https://nuxt.com) • [Vue.js](https://vuejs.org) • [TypeScript](https://www.typescriptlang.org) • [Tailwind CSS](https://tailwindcss.com) • [Headless UI](https://headlessui.com)

### Backend

- [Django](https://www.djangoproject.com) • [PostgreSQL](https://www.postgresql.org)

### Deployment

- [Docker](https://www.docker.com) • [Netlify](https://www.netlify.com) • [Vitest](https://vitest.dev/)

### Localization

- [Nuxt I18n](https://github.com/nuxt-modules/i18n) • [Weblate](https://weblate.org) ([activist on Weblate](https://hosted.weblate.org/projects/activist/activist))

### Analytics

- [Plausible](https://plausible.io/)

> [!NOTE]
> Those new to any frameworks or technologies who want to work on their skills are more than welcome to contribute!

<a id="learning-the-tech-stack-"></a>

## Learning the tech stack [`⇧`](#contents)

activist is very open to contributions from people in the early stages of their coding journey! The following is a select list of documentation pages to help you understand the technologies we use.

<details><summary>Docs for those new to programming</summary>
<p>

- [Mozilla Developer Network Learning Area](https://developer.mozilla.org/en-US/docs/Learn)
    - Doing MDN sections for HTML, CSS and JavaScript is the best ways to get into web development!
- [Open Source Guides](https://opensource.guide/)
    - Guides from GitHub about open-source software including how to start and much more!

</p>
</details>

<details><summary>Frontend tech docs</summary>
<p>

- [Vue.js 3 docs](https://vuejs.org/guide/introduction.html)
- [Vue docs on MDN](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_getting_started)
- [Nuxt.js 3 docs](https://nuxt.com/docs/getting-started/introduction)
- [Nuxt.js and TypeScript docs](https://nuxt.com/docs/guide/concepts/typescript)
- [TypeScript docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS docs](https://tailwindcss.com/docs/installation)
- [Headless UI docs](https://headlessui.com/)

</p>
</details>

<details><summary>Backend tech docs</summary>
<p>

- [Django docs](https://docs.djangoproject.com/)
- [Django docs on MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django)

</p>
</details>

<details><summary>Deployment tech docs</summary>
<p>

- [Docker docs](https://docs.docker.com/get-started/)

</p>
</details>

<a id="dev-env-"></a>

## Development environment [`⇧`](#contents)

> [!NOTE]
> Windows users should be aware that Docker development requires [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/windows/wsl/) version 2 or higher.

1. First and foremost, please see the suggested IDE setup in the dropdown below to make sure that your editor is ready for development.

> [!IMPORTANT]
>
> <details><summary>Suggested IDE setup</summary>
>
> <p>
>
> VS Code
>
> Install the following extensions:
>
> - [batisteo.vscode-django](https://marketplace.visualstudio.com/items?itemName=batisteo.vscode-django)
> - [bradlc.vscode-tailwindcss](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
> - [charliermarsh.ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)
> - [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
> - [ms-playwright.playwright](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
> - [streetsidesoftware.code-spell-checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
> - [Vue.volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
>
> WebStorm
>
> - Check out the [Vue.js development docs](https://www.jetbrains.com/help/webstorm/vue-js.html)
> - Make sure a [local Node.js interpreter](https://www.jetbrains.com/help/webstorm/developing-node-js-applications.html#ws_node_configure_local_node_interpreter) is configured in your project
> - Make sure the [Vue.js plugin](https://github.com/JetBrains/intellij-plugins/tree/master/vuejs) and [JavaScript Debugger](https://www.jetbrains.com/help/webstorm/configuring-javascript-debugger.html) are enabled in the plugins page of the settings
>
> </p>
> </details>

2. To setup your development environment, first install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/).

> [!NOTE]
> If you are new to Docker, activist recommends installing [Docker Desktop](https://docs.docker.com/desktop/). Docker Desktop comes with many Docker tools and a straightforward user interface.

3. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the [activist repo](https://github.com/activist-org/activist), clone your fork, and configure the remotes:

> [!NOTE]
>
> <details><summary>Consider using SSH</summary>
>
> <p>
>
> Alternatively to using HTTPS as in the instructions below, consider SSH to interact with GitHub from the terminal. SSH allows you to connect without a user-pass authentication flow.
>
> To run git commands with SSH, remember then to substitute the HTTPS URL, `https://github.com/...`, with the SSH one, `git@github.com:...`.
>
> - e.g. Cloning now becomes `git clone git@github.com:<your-username>/activist.git`
>
> GitHub also has their documentation on how to [Generate a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) 🔑
>
> </p>
> </details>

```bash
# Clone your fork of the repo into the current directory.
git clone https://github.com/<your-username>/activist.git
# Navigate to the newly cloned directory.
cd activist
# Assign the original repo to a remote called "upstream".
git remote add upstream https://github.com/activist-org/activist.git
```

- Now, if you run `git remote -v` you should see two remote repositories named:
  - `origin` (forked repository)
  - `upstream` (activist repository)

4. Create a virtual environment for the backend, activate it and install dependencies:

    ```bash
    # Unix or MacOS:
    python3 -m venv venv
    source venv/bin/activate

    # Windows:
    python -m venv venv
    venv\Scripts\activate.bat

    # After activating venv:
    pip install --upgrade pip
    pip install -r backend/requirements-dev.txt
    ```

5. Start your docker images with the following:

    ```bash
    # --build only necessary with new dependencies or backend model changes.
    docker compose --env-file .env.dev up --build

    # And to stop the containers when you're done working:
    docker compose --env-file .env.dev down
    ```

6. You can visit <http://localhost:3000/> to see the development frontend once the container is up and running. From there click `View organizations` or `View events` to explore the platform.

7. To view the backend admin UI and Swagger UI, visit <http://localhost:8000/admin> and <http://localhost:8000/v1/schema/swagger-ui/> respectively.

8. If you'd like to sign in to the frontend via <http://localhost:3000/auth/sign-in> or the Django admin panel via <http://localhost:8000/admin>, then you can use the fixtures `admin` user with the password `admin`.

> [!NOTE]
> Feel free to contact the team in the [Development room on Matrix](https://matrix.to/#/!CRgLpGeOBNwxYCtqmK:matrix.org?via=matrix.org&via=acter.global&via=chat.0x7cd.xyz) if you're having problems getting your environment setup!

<a id="using-yarn-or-python-"></a>

### Using Yarn or Python

Dockerized environments are resource intensive - specifically for some Windows users - and may take a very long time to load. If you would like to get just the frontend or backend up and running, please follow the steps below:

<details><summary><strong>Frontend: Yarn</strong></summary>
<p>

The frontend currently uses [Yarn 4.*](https://yarnpkg.com/getting-started/install).

```bash
# In the root activist directory:
cd frontend

# Set the environment variables:
set -a && source ../.env.dev && set +a

# Install and run the project:
corepack enable
yarn install
yarn run dev:local
```

You can then visit http://localhost:3000/ to see the development frontend build once the server is up and running.

You can also build the production version locally:

```bash
# In activist/frontend:
yarn build:local

# Run the production build:
node .output/server/index.mjs
```

</p>
</details>

<details><summary><strong>Backend: Python</strong></summary>
<p>

Our backend depends on a connection to a postgres DB, therefore we need to setup the database first. Here our best option is to still use docker to create a postgres DB with the following command:

```bash
docker compose --env-file .env.dev up db
```

To run locally, set the environment variable `DJANGO_ENV` to `LOCAL_DEV`:

```bash
export DJANGO_ENV=LOCAL_DEV
```

When this is set, django will load environment variables from `env.dev` first, and then from `.env.dev.local` which will overwrite some variables for local development.

From here we need the project's dependencies, with the practice being to create a virtual environment first within your local activist directory and then install the dependencies within it:

On Unix or MacOS, run:

```bash
python3 -m venv venv  # make an environment named venv
source venv/bin/activate # activate the environment
```

On Windows (using Command Prompt), run:

```bash
python -m venv venv
venv\Scripts\activate.bat
```

After activating the virtual environment, install the required dependencies by running:

```bash
pip install --upgrade pip  # make sure that pip is at the latest version
pip install -r backend/requirements-dev.txt  # install dependencies
```

Now you can apply database migrations and start the local server.

```bash
# In the root activist directory:
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

You can then visit <http://localhost:8000/admin> to see the development backend admin UI as well as <http://localhost:8000/v1/schema/swagger-ui/> for the Swagger UI once the server is up and running.

</p>
</details>

<!-- <a id="component-stories"></a>

### Component stories [`⇧`](#contents)

activist uses [histoire](https://histoire.dev/) for stories so that frontend components and their documentation are all written in Vue. To view the stories, enter the following in the command line:

```bash
cd frontend
yarn run story:dev
```

From there you'll be able to visit http://localhost:6006/ to view the documentation. Contributions are very welcome! -->

<a id="style-guide-"></a>

## Style guide [`⇧`](#contents)

Please see the [activist style guide](STYLEGUIDE.md) for details about how to follow the code style for the project. We made these guidelines to assure that we as a community write clean, cohesive code that's easy to write and review. Suggestions for the style guide are welcome.

<a id="linting-"></a>

## Linting [`⇧`](#contents)

For the backend [Ruff](https://github.com/astral-sh/ruff) is installed via the required packages to assure that errors are reported correctly. We'd also suggest that VS Code users install the [Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff).

For the frontend [eslint](https://eslint.org/), [eslint-vue](https://eslint.vuejs.org/) and [vue-a11y](https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/) are added via the dependencies to provide linting support.

<a id="testing-"></a>

## Testing [`⇧`](#contents)

### Backend

Please run the following commands from the project root to test the backend:

```bash
# Format the backend, lint the code and run static type checks:
ruff format ./backend
ruff check ./backend
mypy ./backend --config-file ./backend/pyproject.toml

# Start the Docker container:
docker compose --env-file .env.dev up backend --build -d  # -d to hide logs

# Enter the backend container:
docker exec -it django_backend sh

# Run backend tests:
pytest

# To run a specific test:
pytest path/to/test_file.py::test_function

# To run with a coverage report as is done in PRs:
pytest --cov --cov-report=term-missing --cov-config=pyproject.toml -vv

# Once tests are finished:
exit
```

### Frontend

#### Static Testing

Please check the formatting of your code using Prettier and run the static type check with eslint before pull requests with the following command:

```bash
# Within ./frontend:
yarn install  # necessary for non-Linux users as node_modules are set via Docker
yarn format
yarn lint
```

You can further run the following commands for TypeScript type checks on the frontend:

```bash
# Within ./frontend:
yarn install  # necessary for non-Linux users as node_modules are set via Docker
yarn postinstall  # prepare types in frontend/.nuxt
yarn typecheck
```

> [!NOTE]
> Pre-existing TS errors may be ignored. If you need assistance then feel free to open a PR and we'll support!

#### Automated Testing

We use [Vitest](https://vitest.dev/) for component and unit testing.  You can run them with the following command:

```bash
# Within ./frontend:
yarn test --silent
```
> [!NOTE]
> The `--silent` flag is to suppress a lot of warnings from existing issues between Nuxt and Vitest.  If you need to see the warnings omit the `--silent` flag.

If you would like to run a specific test, please run the following command:

```bash
yarn vitest FILE.spec.ts --run
```

Please see the [frontend testing guide](FRONTEND_TESTING.md) for information on how to write component tests.

> [!NOTE]
> The Vitest test suite is still in a very early stage. There is a lot of work left to do to increase test coverage, and some features still need troubleshooting. If you need assistance then feel free to open a PR and we'll support!

### End to End Testing (E2E)

#### Run Local E2E Tests

activist uses [Playwright](https://playwright.dev/) for end to end testing. You'll first need to install/update the browsers installed for Playwright as described in their [updating Playwright documentation](https://playwright.dev/docs/intro#updating-playwright). Please run the following command in the frontend:

```bash
# This and all following steps need to be ran each time Playwright is updated.
yarn playwright install --with-deps
```

To run the end to end tests locally, please run the following commands:

```bash
docker-compose --env-file .env.dev up backend db # run backend and db in docker
```

In order to test locally, you need to build the production version of the frontend as directed in the [local build directions](#using-yarn-or-python-).

In a second shell:

```bash
cd frontend

# Set the environment variables:
set -a && source ../.env.dev && set +a

# Install and run the project:
corepack enable
yarn install
yarn build  # answer no to all package installation prompts
# Note that there may be an installation prompt high in the build logs. Hit 'n' to say no.

npx serve dist/  # start the frontend
```

In a third shell:

```bash
cd frontend

yarn test:local

# If tests don't pass, then as prompted run the following to see the HTML report:
yarn playwright show-report
```

Or, instead of the third shell, you can also run the whole suite or run individual tests using Playwright's VS Code extension. You can find a link in the [Development environment](#dev-env-) section, under Suggested IDE setup.

Thank you for testing locally! ✨

#### Writing E2E Tests

The [frontend testing guide](FRONTEND_TESTING.md) also has a guide for writing E2E tests.

#### Remote E2E

For testing on your remote forked repository, first create a branch from the remote branch that you want to test against. This can be done with the following command:

```bash
git push upstream <local-branch-name>:<remote-branch-name-of-your-choice>
```

You can then navigate to the remote versions of the [actions of the repository](https://github.com/activist-org/activist/actions) in your fork and trigger [pr_ci_playwright_e2e](https://github.com/activist-org/activist/actions/workflows/pr_ci_playwright_e2e.yaml).

For maintainers of the activist main repo, testing PRs is done via the following to make sure that origin has a copy of the branch that can be tested against:

```bash
# On the branch in question:
git branch  # to find the name of the branch
git push -u origin LOCAL_NAME_OF_BRANCH
```

You can then visit the [actions of the repository](https://github.com/activist-org/activist/actions) to run the the [pr_ci_playwright_e2e](https://github.com/activist-org/activist/actions/workflows/pr_ci_playwright_e2e.yaml) test against the new branch on origin.

Thank you for testing your PRs! 🎉

<a id="issues-projects"></a>

## Issues and projects [`⇧`](#contents)

The [issue tracker for activist](https://github.com/activist-org/activist/issues) is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#pull-requests). activist also organizes related issues into [projects](https://github.com/activist-org/activist/projects).

> [!NOTE]
> Just because an issue is assigned on GitHub doesn't mean the team isn't open to your contribution! Feel free to write [in the issues](https://github.com/activist-org/activist/issues) and we can potentially reassign it to you.

Be sure to check the [`-next release-`](https://github.com/activist-org/activist/labels/-next%20release-) and [`-priority-`](https://github.com/activist-org/activist/labels/-priority-) labels in the [issues](https://github.com/activist-org/activist/issues) for those that are most important, as well as those marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that are tailored for first-time contributors.

<a name="bug-reports"></a>

## Bug reports [`⇧`](#contents)

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful — thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** to check if the issue has already been reported.

2. **Check if the issue has been fixed** by trying to reproduce it using the latest `main` or development branch in the repository.

3. **Isolate the problem** to make sure that the code in the repository is _definitely_ responsible for the issue.

**Great Bug Reports** tend to have:

- A quick summary
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (why this might be happening, things tried that didn't work, etc)

To make the above steps easier, the activist team asks that contributors report bugs using the [bug report template](https://github.com/activist-org/activist/issues/new?assignees=&labels=bug&projects=activist-org%2F1&template=bug_report.yml), with these issues further being marked with the [`Bug`](https://github.com/activist-org/activist/issues?q=is%3Aissue%20state%3Aopen%20type%3ABug) type.

Again, thank you for your time in reporting issues!

<a name="feature-requests-"></a>

## Feature requests [`⇧`](#contents)

Feature requests are more than welcome! Please take a moment to find out whether your idea fits with the scope and aims of the project. When making a suggestion, provide as much detail and context as possible, and further make clear the degree to which you would like to contribute in its development. Feature requests are marked with the [`Feature`](https://github.com/activist-org/activist/issues?q=is%3Aissue%20state%3Aopen%20type%3AFeature) type in the [issues](https://github.com/activist-org/activist/issues).

<a name="pull-requests-"></a>

## Pull requests [`⇧`](#contents)

Good pull requests — patches, improvements and new features — are the foundation of our community making activist. They should remain focused in scope and avoid containing unrelated commits. Note that all contributions to this project will be made under [the specified license](LICENSE.txt) and should follow the coding indentation and style standards (contact us if unsure).

**Please ask first** before embarking on any significant pull request (implementing features, refactoring code, etc), otherwise you risk spending a lot of time working on something that the developers might not want to merge into the project. With that being said, major additions are very appreciated!

When making a contribution, adhering to the [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow) process is the best way to get your work merged:

1. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout <dev-branch>
   git pull upstream <dev-branch>
   ```

2. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

3. Install [pre-commit](https://pre-commit.com/) to ensure that each of your commits is properly checked against our linter and formatters:

    ```bash
    # In the project root:
    pre-commit install

    # Then test the pre-commit hooks to see how it works:
    pre-commit run --all-files
    ```

> [!NOTE]
> pre-commit is Python package that can be installed via pip or any other Python package manager. You can also find it in our [requirements-dev.txt](backend/requirements-dev.txt) file.
>
> ```bash
> pip install pre-commit
> ```

> [!NOTE]
> If you are having issues with pre-commit and want to send along your changes regardless, you can ignore the pre-commit hooks via the following:
>
> ```bash
> git commit --no-verify -m "COMMIT_MESSAGE"
> ```

4. Commit your changes in logical chunks, and please try to adhere to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

> [!NOTE]
> The following are tools and methods to help you write good commit messages ✨
>
> - [commitlint](https://commitlint.io/) helps write [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
> - Git's [interactive rebase](https://docs.github.com/en/github/getting-started-with-github/about-git-rebase) cleans up commits

5. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull --rebase upstream <dev-branch>
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

Thank you in advance for your contributions!

<a id="localization-"></a>

## Localization [`⇧`](#contents)

<a href="https://hosted.weblate.org/projects/activist/activist">
    <img src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/WeblateLogo.png" height="100" alt="Visit Weblate project" align="right">
</a>

Localization for activist happens on our [public localization project on Weblate](https://hosted.weblate.org/projects/activist/activist). Join us there if you'd like to help bring activist to other languages!

To find issues related to localization, please see the [`localization`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Alocalization) label in the [issues](https://github.com/activist-org/activist/issues), and to report a localization issue use the [localization issue form](https://github.com/activist-org/activist/issues/new?assignees=&labels=localization&projects=activist-org%2F1&template=localization.yml). Please also see the [style guide](STYLEGUIDE.md) for more information on how to create new localization keys.

> [!IMPORTANT]
> If you're having issues with the vue/nuxt i18n `$t` local property not being picked up by TypeScript and being reported as invalid/not existing across the codebase, then please add the following file at `frontend/types/vue-i18n.d.ts`:
>
> ```ts
> // frontend/types/vue-i18n.d.ts
> // Attn: Fixes Property '$t' does not exist on type ... errors.
> // Note: This file is git ignored, but can be used as a local fix for excessive TypeScript errors.
> declare module "vue" {
>   interface ComponentCustomProperties {
>     $t: (key: string) => string;
>   }
> }
> ```

<a id="documentation-"></a>

## Documentation [`⇧`](#contents)

Documentation is an invaluable way to contribute to coding projects as it allows others to more easily understand the project structure and contribute. Issues related to documentation are marked with the [`documentation`](https://github.com/activist-org/activist/labels/documentation) label in the [issues](https://github.com/activist-org/activist/issues).

<a id="accessibility-"></a>

## Accessibility [`⇧`](#contents)

Thank you for your interest in improving activist's accessibility. We want our platform to not only be usable for all people, but also to provide a welcoming environment within the development community for all. This section lists a few points to account for when checking accessibility constraints during development:

### Transitions

Users who have motion sickness have the ability to disable transitions and animations on their devices. We use the external dependency [reduced-motion](https://github.com/lucianmurmurache/reduced-motion) to disable transitions and animations in this case.

### Tab focusing

Tab focusing sadly doesn't work out of the box for many browsers. Chrome works great, but the following changes are needed for browsers to function properly with tabs. We'll test activist against browsers with these settings with the assumption that people who need tab for more control of the interface will be able to activate them.

**Firefox**

- Go to `about:config`
- Search for `accessibility.tabfocus` and check that it's set to type `Boolean` with value `true`
- Remove it and select `Number` instead
- Click on the add button and then enter the value `7`

**Safari**

- Go to `Keyboard` in `System Preferences` for your computer (assuming it's a Mac)
- Select `Use keyboard navigation to move focus between controls` on Mac OS Catalina or `All controls` on earlier Mac OS versions
- In Safari go to `Settings`
- Go to the `Advanced` tab
- Select `Press Tab to highlight each item on a webpage`

Once the above steps are finished you should be able to use tab to navigate web pages :)

<a id="internationalization-"></a>

## Internationalization [`⇧`](#contents)

activist uses [i18n-check](https://github.com/activist-org/i18n-check) to validate our internationalization key-value pairs. The basic commands to check the i18n keys and values are:

```bash
# Note: You need to have installed the backend/requirements-dev.txt file in your virtual environment.
i18n-check -a  # run all checks
i18n-check -ki  # run key identifiers check
i18n-check -ik  # run invalid keys check
i18n-check -uk  # run unused keys check
i18n-check -nsk  # run non-source keys check
i18n-check -rk  # run repeat keys check
i18n-check -rv  # run repeat values check
i18n-check -nk  # run nested keys check
```

You can also run individual checks. Please see the [documentation for i18n-check](https://i18n-check.readthedocs.io/en/latest/) to learn more.

If you do need to edit the directories and files skipped by certain checks, then these edits can be made in the [.i18n-check.yaml](./.i18n-check.yaml) file. If you're having issues using `i18n-check`, please feel free to contact the team for support!

<a id="design-"></a>

## Design [`⇧`](#contents)

<a href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231">
    <img src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/FigmaLogo.png" width="100" alt="Public Figma Designs" align="right">
</a>

Designs for activist are done in the [public design file in Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in helping with activist's design are also welcome to share their ideas using the [design improvement](https://github.com/activist-org/activist/issues/new?assignees=&labels=design&template=design_improvement.yml) template that makes an issue marked with the [`design`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Adesign) label.

Note that the linked Figma file above is the [public facing designs](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in improving them or contributing designs for new features are invited to contact the team on GitHub or [Matrix](https://matrix.to/#/!uIGQUxlCnEzrPiRsRw:matrix.org?via=matrix.org&via=effektio.org&via=acter.global). We'd love to see a sample of your work, and if everything looks good we'll schedule a time to get connected!

All branding elements such as logos, icons, colors and fonts should follow those that are set out in [activist-org/Organization](https://github.com/activist-org/Organization). As the project is fully open source, these elements are also open for discussion. Your efforts in making activist products professional with a distinct and cohesive identity are much appreciated.

<a id="troubleshooting-"></a>

## Troubleshooting [`⇧`](#contents)

### Nuxt Auto Import Errors

Nuxt uses auto imports to make frontend development more seamless, but at times these imports malfunction. For the `Property 'PROPERTY_NAME' does not exist on type...` errors, this is caused both by having an out of sync `yarn.lock` file and having Nuxt improperly installed.

Please run [frontend/reset_local_env.sh](frontend/reset_local_env.sh) to reset the local frontend environment to allow for local testing. This can be done via the following commands in the `frontend` directory:

    ```bash
    # Linux:
    sh reset_local_env.sh

    # MacOS:
    sh reset_local_env.sh

    # Windows:
    # Run the commands below found in frontend/reset_local_env.sh.
    ```
