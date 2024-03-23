# Contributing to activist.org

Thank you for contributing to activist!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, and in accordance with this project's [code of conduct](https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md), other contributors will reciprocate that respect in addressing your issue or assessing patches and features.

If you have questions or would like to communicate with the team, please [join us in our public Matrix chat rooms](https://matrix.to/#/#activist_community:matrix.org). We'd be happy to hear from you!

<a id="contents"></a>

## **Contents**

- [First steps as a contributor](#first-steps)
- [Tech stack](#tech-stack)
- [Learning the tech stack](#learning-the-tech)
- [Development environment](#dev-env)
- [Style guide](#style-guide)
- [Linting](#linting)
- [Issues and projects](#issues-projects)
- [Bug reports](#bug-reports)
- [Feature requests](#feature-requests)
- [Pull requests](#pull-requests)
- [Localization](#localization)
- [Documentation](#documentation)
- [Accessibility](#accessibility)
- [Design](#design)

<a id="first-steps"></a>

## First steps as a contributor [`⇧`](#contents)

Thank you for your interest in contributing to activist.org! We look forward to welcoming you to the community and working with you to build a global platform for political action :) The following are some suggested steps for people interested in joining our community:

- Please join the [public Matrix chat](https://matrix.to/#/#activist_community:matrix.org) to connect with the community
  - [Matrix](https://matrix.org/) is a network for secure, decentralized communication
  - activist would suggest that you use the [Element](https://element.io/) client
  - The [General](https://matrix.to/#/!uIGQUxlCnEzrPiRsRw:matrix.org?via=matrix.org&via=effektio.org&via=acter.global) and [Development](https://matrix.to/#/!CRgLpGeOBNwxYCtqmK:matrix.org?via=matrix.org&via=acter.global&via=chat.0x7cd.xyz) channels would be great places to start!
  - Feel free to introduce yourself and tell us what your interests are if you're comfortable :)
- Read through this contributing guide and the [style guide](https://github.com/activist-org/activist/blob/main/STYLEGUIDE.md) for all the information you need to contribute
- Look into issues marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and the [Projects board](https://github.com/orgs/activist-org/projects/1) to get a better understanding of what you can work on
- Check out our [public designs on Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?type=design&node-id=10%3A18&mode=design&t=tdQyOtl5lU1n7oLN-1) to understand activist's goals and direction
- Consider joining our [bi-weekly developer sync](https://etherpad.wikimedia.org/p/activist-dev-sync)!

<a id="tech-stack"></a>

## Tech Stack [`⇧`](#contents)

The following are the current and planned technologies for [activist.org](https://activist.org):

### Frontend

- [Nuxt.js](https://nuxt.com) • [Vue.js](https://vuejs.org) • [TypeScript](https://www.typescriptlang.org) • [Tailwind CSS](https://tailwindcss.com) • [Headless UI](https://headlessui.com)

### Backend

- [Django](https://www.djangoproject.com) • [PostgreSQL](https://www.postgresql.org) (planned)

### Deployment

- [Docker](https://www.docker.com) • [Netlify](https://www.netlify.com) • [Vitest](https://vitest.dev/) (planned)

### Localization

- [Nuxt I18n](https://github.com/nuxt-modules/i18n) • [Transifex](https://www.transifex.com/) ([activist on Transifex](https://explore.transifex.com/activist-org/activist))

### Analytics

- [Plausible](https://plausible.io/)

> [!NOTE]
> Those new to any frameworks or technologies who want to work on their skills are more than welcome to contribute!

<a id="learning-the-tech"></a>

## Learning the tech stack [`⇧`](#contents)

activist is very open to contributions from people in the early stages of their coding journey! The following is a select list of documentation pages to help you understand the technologies we use.

<details><summary>Docs for those new to programming</summary>
<p>

- [Mozilla Developer Network Learning Area](https://developer.mozilla.org/en-US/docs/Learn)
  - Doing MDN sections for HTML, CSS and JavaScript is the best ways to get into web development!

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

<a id="dev-env"></a>

## Development environment [`⇧`](#contents)

1. First and foremost, please see the suggested IDE extensions in the dropdown below to make sure that your editor is set up properly.

> [!IMPORTANT]
>
> <details><summary>Suggested IDE extensions</summary>
>
> <p>
>
> VS Code
>
> - [batisteo.vscode-django](https://marketplace.visualstudio.com/items?itemName=batisteo.vscode-django)
> - [bradlc.vscode-tailwindcss](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
> - [charliermarsh.ruff](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)
> - [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
> - [streetsidesoftware.code-spell-checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
> - [Vue.volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
>
> </p>
> </details>

2. To setup your development environment, first install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/).

> [!NOTE]
> If you are new to Docker, as an alternative activist recommends installing [Docker Desktop](https://docs.docker.com/desktop/). Docker Desktop comes with many Docker tools and a straightforward user interface.

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

4. Start your docker images with the following:

   ```bash
   docker compose --env-file .env.dev up

   # Or with new dependencies:
   # docker compose --env-file .env.dev up --build

   # And to stop the containers when you're done working:
   # docker compose down
   ```

5. You can visit <http://localhost:3000/> to see the development build once the container is up and running.

> [!NOTE]
> Feel free to contact the team in the [Development room on Matrix](https://matrix.to/#/!CRgLpGeOBNwxYCtqmK:matrix.org?via=matrix.org&via=acter.global&via=chat.0x7cd.xyz) if you're having problems getting your environment setup!

> [!TIP]
> For those using LLM coding assistants, [LLMPROMPT.txt](https://github.com/activist-org/activist/blob/main/LLMPROMPT.txt) contains a good prompt to paste as context or add to your settings.

<a id="using-yarn-or-python"></a>

### Using Yarn or Python

Dockerized environments are resource intensive - specifically for some Windows users - and may take a very long time to load. If you would like to get just the frontend or backend up and running, please follow the steps below:

<details><summary><strong>Frontend: Yarn</strong></summary>
<p>

```bash
# In the root activist directory:
cd frontend
yarn install
yarn run dev
```

You can then visit http://localhost:3000/ to see the development frontend build once the server is up and running.

</p>
</details>

<details><summary><strong>Backend: Python</strong></summary>
<p>

Our backend depends on a connection to a postgres DB, therefore we need to setup the database first. Here our best option is to still use docker to create a postgres DB with the following command:

```bash
docker compose --env-file .env.dev up db
```

In order to connect to the DB, we need to change the `DATABASE_HOST` environment variable inside the `.env.dev` file first.

```bash
# Current
DATABASE_HOST=db
# Changed
DATABASE_HOST=localhost
```

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
pyhton manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

You can then visit http://localhost:8000/ to see the development backend build once the server is up and running.

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

<a id="style-guide"></a>

## Style guide [`⇧`](#contents)

Please see the [activist style guide](https://github.com/activist-org/activist/blob/main/STYLEGUIDE.md) for details about how to follow the code style for the project. We made these guidelines to assure that we as a community write clean, cohesive code that's easy to write and review. Suggestions for the style guide are welcome.

<a id="linting"></a>

## Linting [`⇧`](#contents)

For the backend [Ruff](https://github.com/astral-sh/ruff) is installed via the required packages to assure that errors are reported correctly. We'd also suggest that VS Code users install the [Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff).

For the frontend [eslint](https://eslint.org/), [eslint-vue](https://eslint.vuejs.org/) and [vue-a11y](https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/) are added via the dependencies to provide linting support.

<a id="issues-projects"></a>

## Issues and projects [`⇧`](#contents)

The [issue tracker for activist](https://github.com/activist-org/activist/issues) is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#pull-requests). activist also organizes related issues into [projects](https://github.com/activist-org/activist/projects).

> [!NOTE]
> Just because an issue is assigned on GitHub doesn't mean that the team isn't interested in your contribution! Feel free to write [in the issues](https://github.com/activist-org/activist/issues) and we can potentially reassign it to you.

Be sure to check the [`-next release-`](https://github.com/activist-org/activist/labels/-next%20release-) and [`-priority-`](https://github.com/activist-org/activist/labels/-priority-) labels in the [issues](https://github.com/activist-org/activist/issues) for those that are most important, as well as those marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that are tailored for first time contributors.

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

To make the above steps easier, the activist team asks that contributors report bugs using the [bug report template](https://github.com/activist-org/activist/issues/new?assignees=&labels=bug&projects=activist-org%2F1&template=bug_report.yml), with these issues further being marked with the [`bug`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Abug) label.

Again, thank you for your time in reporting issues!

<a name="feature-requests"></a>

## Feature requests [`⇧`](#contents)

Feature requests are more than welcome! Please take a moment to find out whether your idea fits with the scope and aims of the project. When making a suggestion, provide as much detail and context as possible, and further make clear the degree to which you would like to contribute in its development. Feature requests are marked with the [`feature`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Afeature) label in the [issues](https://github.com/activist-org/activist/issues).

<a name="pull-requests"></a>

## Pull requests [`⇧`](#contents)

Good pull requests — patches, improvements and new features — are the foundation of our community making activist. They should remain focused in scope and avoid containing unrelated commits. Note that all contributions to this project will be made under [the specified license](https://github.com/activist-org/activist/blob/main/LICENSE.txt) and should follow the coding indentation and style standards (contact us if unsure).

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

3. Install [pre-commit](https://pre-commit.com/) to ensure during development that each of your commits is properly formatted against our linter and formatters:

   ```bash
   pre-commit install
   ```

> [!NOTE]
> pre-commit is Python package that can be install via pip or any other Python package manager. You can also find it in our [requirements.txt](backend/requirements.txt) file.
>
> ```bash
> pip install pre-commit
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

> [!NOTE]
> When working on the frontend, activist recommends manual typechecking. From within the `frontend` directory run `yarn run postinstall` followed by `yarn nuxi typecheck` to confirm your changes are type-safe. Existing TS errors may be ignored. PRs to fix these are always welcome!

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

Thank you in advance for your contributions!

<a id="localization"></a>

## Localization [`⇧`](#contents)

Localization for activist happens within our [public localization project on Transifex](https://explore.transifex.com/activist-org/activist). Join us there if you'd like to help bring activist to other languages!

To find issues related to localization, please see the [`localization`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Alocalization) label in the [issues](https://github.com/activist-org/activist/issues), and to report a localization issue use the [localization issue form](https://github.com/activist-org/activist/issues/new?assignees=&labels=localization&projects=activist-org%2F1&template=localization.yml). Please also see the [style guide](https://github.com/activist-org/activist/blob/main/STYLEGUIDE.md) for more information on how to create new localization keys.

<a id="documentation"></a>

## Documentation [`⇧`](#contents)

Documentation is an invaluable way to contribute to coding projects as it allows others to more easily understand the project structure and contribute. Issues related to documentation are marked with the [`documentation`](https://github.com/activist-org/activist/labels/documentation) label in the [issues](https://github.com/activist-org/activist/issues).

<a id="accessibility"></a>

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

<a id="design"></a>

## Design [`⇧`](#contents)

<a href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231"><img src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/FigmaLogo.png" height="50" alt="Public Figma Designs" align="right"></a>

Designs for activist are done in the [public design file in Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in helping with activist's design are also welcome to share their ideas using the [design improvement](https://github.com/activist-org/activist/issues/new?assignees=&labels=design&template=design_improvement.yml) template that makes an issue marked with the [`design`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Adesign) label.

Note that the linked Figma file above is the [public facing designs](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in improving them or contributing designs for new features are invited to contact the team on GitHub or [Matrix](https://matrix.to/#/!uIGQUxlCnEzrPiRsRw:matrix.org?via=matrix.org&via=effektio.org&via=acter.global). We'd love to see a sample of your work, and if everything looks good we'll schedule a time to get connected!

All branding elements such as logos, icons, colors and fonts should follow those that are set out in [activist-org/Organization](https://github.com/activist-org/Organization). As the project is fully open source, these elements are also open for discussion. Your efforts in making activist products professional with a distinct and cohesive identity are much appreciated.
