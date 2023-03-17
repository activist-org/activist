# Contributing to activist.org

Thank you for your consideration in contributing to activist!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, and in accordance with this project's [code of conduct](https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md), other contributors will reciprocate that respect in addressing your issue or assessing patches and features.

If you have questions or would like to communicate with the team, please [join us in our public Matrix chat rooms](https://matrix.to/#/#activist_community:matrix.org). We'd be happy to hear from you!

<a id="contents"></a>

# **Contents**

- [Development environment](#dev-env)
- [Issues and projects](#issues-projects)
- [Bug reports](#bug-reports)
- [Feature requests](#feature-requests)
- [Pull requests](#pull-requests)
- [Localization](#localization)
- [Documentation](#documentation)
- [Design](#design)

<a id="dev-env"></a>

# Development environment [`⇧`](#contents)

To setup your development environment, first install [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/).

Then clone this repository with the below command:

```bash
git clone https://github.com/activist-org/activist.git
```

Enter the created directory and start your docker images with the following:

```bash
cd activist
docker-compose up --build
```

You can visit <http://localhost:3000/> to see the development build once the container is up and running.

Those new to any frameworks or technologies who want to work on their skills are more than welcome to contribute!

<a id="issues-projects"></a>

# Issues and projects [`⇧`](#contents)

The [issue tracker for activist](https://github.com/activist-org/activist/issues) is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#pull-requests). activist also organizes related issues into [projects](https://github.com/activist-org/activist/projects).

Be sure to check the [`-next release-`](https://github.com/activist-org/activist/labels/-next%20release-) and [`-priority-`](https://github.com/activist-org/activist/labels/-priority-) labels in the [issues](https://github.com/activist-org/activist/issues) for those that are most important, as well as those marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that are tailored for first time contributors.

<a name="bug-reports"></a>

# Bug reports [`⇧`](#contents)

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

Bug reports are marked with the [`bug`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Abug) label in the [issues](https://github.com/activist-org/activist/issues).

Again, thank you for your time in reporting issues!

<a name="feature-requests"></a>

# Feature requests [`⇧`](#contents)

Feature requests are more than welcome! Please take a moment to find out whether your idea fits with the scope and aims of the project. When making a suggestion, provide as much detail and context as possible, and further make clear the degree to which you would like to contribute in its development. Feature requests are marked with the [`feature`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Afeature) label in the [issues](https://github.com/activist-org/activist/issues).

<a name="pull-requests"></a>

# Pull requests [`⇧`](#contents)

Good pull requests — patches, improvements and new features — are a fantastic help. They should remain focused in scope and avoid containing unrelated commits. Note that all contributions to this project will be made under [the specified license](https://github.com/activist-org/activist/blob/main/LICENSE.txt) and should follow the coding indentation and style standards (contact us if unsure).

**Please ask first** before embarking on any significant pull request (implementing features, refactoring code, etc), otherwise you risk spending a lot of time working on something that the developers might not want to merge into the project. With that being said, major additions are very appreciated!

When making a contribution, adhering to the [GitHub flow](https://guides.github.com/introduction/flow/index.html) process is the best way to get your work merged:

1. [Fork](http://help.github.com/fork-a-repo/) the repo, clone your fork, and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/<repo-name>
   # Navigate to the newly cloned directory
   cd <repo-name>
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/<upsteam-owner>/<repo-name>
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout <dev-branch>
   git pull upstream <dev-branch>
   ```

3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Commit your changes in logical chunks, and please try to adhere to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Use Git's [interactive rebase](https://docs.github.com/en/github/getting-started-with-github/about-git-rebase) feature to tidy up your commits before making them public.

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

<a id="localization"></a>

# Localization [`⇧`](#contents)

Those interested in contributing to localization for the app are welcome to check related issues using the [`localization`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Alocalization) label in the [issues](https://github.com/activist-org/activist/issues).

<a id="documentation"></a>

# Documentation [`⇧`](#contents)

Documentation is an invaluable way to contribute to coding projects as it allows others to more easily understand the project structure and contribute. Issues related to documentation are marked with the [`documentation`](https://github.com/activist-org/activist/labels/documentation) label in the [issues](https://github.com/activist-org/activist/issues).

<a id="design"></a>

# Design [`⇧`](#contents)

The [designs for activist](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231) are made using [Figma](https://www.figma.com). Those interest can use the [discussions](https://github.com/activist-org/activist/discussions) to make suggestions for improvements. Design related issues are marked with the [`design`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Adesign) label.

Note that the linked Figma file above is the [public facing designs](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in improving them or contributing designs for new features are invited to contact the team on GitHub and via other means. We'd love to see a sample of your work, and if everything looks good we'll schedule a time to get connected!

All branding elements such as logos, icons, colors and fonts should follow those that are set out in [activist-org/Organization](https://github.com/activist-org/Organization). As the project is fully open source, these elements are also open for discussion. Your efforts in making activist products professional with a distinct and cohesive identity are much appreciated.
