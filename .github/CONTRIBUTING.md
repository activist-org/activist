# Contributing to activist

Thank you for your consideration in contributing to this project!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, and in accordance with this project's [code of conduct](https://github.com/andrewtavis/activist/blob/main/.github/CODE_OF_CONDUCT.md), other contributors will reciprocate that respect in addressing your issue or assessing patches and features.


## Using the issue tracker

The [issue tracker for activist](https://github.com/andrewtavis/activist/issues) is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#pull-requests).


<a name="bug-reports"></a>
## Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you!

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

Again, thank you for your time in reporting issues!


<a name="feature-requests"></a>
## Feature requests

Feature requests are more than welcome! Please take a moment to find out whether your idea fits with the scope and aims of the project. When making a suggestion, provide as much detail and context as possible, and further make clear the degree to which you would like to contribute in its development.


<a name="pull-requests"></a>
## Pull requests

Good pull requests - patches, improvements and new features - are a fantastic help. They should remain focused in scope and avoid containing unrelated commits. Note that all contributions to this project will be made under [the specified license](https://github.com/andrewtavis/activist/blob/main/LICENSE.txt) and should follow the coding indentation and style standards (contact us if unsure).

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

7.  [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

Thank you in advance for your contributions!
