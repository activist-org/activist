# Environment setup

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

2. To setup your development environment, first install [Docker](https://docs.docker.com/install) and [Docker Compose](https://docs.docker.com/compose).

> [!NOTE]
> If you are new to Docker, activist recommends installing [Docker Desktop](https://docs.docker.com/desktop/). Docker Desktop comes with many Docker tools and a straightforward user interface.

3. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the repo, clone your fork, and configure the remotes:

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

4. Create a virtual environment for the backend (Python `>=3.12`), activate it and install dependencies:

> [!NOTE]
> First, install `uv` if you don't already have it by following the [official installation guide](https://docs.astral.sh/uv/getting-started/installation/).

    ```bash
    cd backend && uv sync --all-extras  # create .venv and install all dependencies from uv.lock

    # Unix or MacOS:
    source .venv/bin/activate

    # Windows:
    .venv\Scripts\activate.bat  # .venv\Scripts\activate.ps1 (PowerShell)
    ```

5. Start your docker images with the following:

    ```bash
    # --build only necessary with new dependencies or backend model changes
    docker compose --env-file .env.dev up --build

    # And to stop the containers when you're done working:
    # docker compose --env-file .env.dev down
    ```

   Sometimes changes to the database can cause the database population to fail in your environment. If this happens, you can destroy the deployment and rebuild it:

    ```bash
    # Destroy your current docker compose deployment:
    docker compose rm -f -v --env-file .env.dev
    ```

6. You can then visit <http://localhost:3000> to see the development frontend build once the container is up and running. From there click `View organizations` or `View events` to explore the platform.

7. To view the backend admin UI and Swagger UI, visit <http://localhost:8000/admin> and <http://localhost:8000/v1/schema/swagger-ui/> respectively.

8. If you'd like to sign in to the frontend via <http://localhost:3000/auth/sign-in> or the Django admin panel via <http://localhost:8000/admin>, then you can use the fixtures `admin` user with the password `admin`.

> [!NOTE]
> Feel free to contact the team in the [Development room on Matrix](https://matrix.to/#/!CRgLpGeOBNwxYCtqmK:matrix.org?via=matrix.org&via=acter.global&via=chat.0x7cd.xyz) if you're having problems getting your environment setup! If you're having issues with Docker and just want to get the frontend or backend up and running, please see [the section on this in the contributing guide](CONTRIBUTING.md#using-yarn-or-python).

9. Install [pre-commit](https://pre-commit.com/) to ensure that each of your commits is properly checked against our linter and formatters:

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
