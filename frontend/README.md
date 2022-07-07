# frontend

[![vue](https://img.shields.io/badge/Vue-3-41B883.svg?logo=vue.js&logoColor=ffffff)](https://github.com/activist-org/activist/tree/main/frontend)
[![coc](https://img.shields.io/badge/coc-Contributor%20Covenant-ff69b4.svg)](https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md)

This directory contains the source code for the frontend of activist.org. For the backend please visit [activist/backend](https://github.com/activist-org/activist/tree/main/backend).

# **Contents**<a id="contents"></a>

- [Contributing](#contributing)
- [Setup](#setup)

<a id="contributing"></a>

# Contributing [`⇧`](#contents)

To setup your development environment, first install [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/).

Then clone this repository with the following command:

```bash
git clone https://github.com/activist-org/activist.git
```

Enter the created directory and start your virtual machines with the following commands:

```bash
cd activist
docker-compose up --build
```

If all works well, you should be able to create an admin account with:

```bash
docker-compose run backend python manage.py createsuperuser
```

<a id="setup"></a>

# Setup [`⇧`](#contents)

Specific directions for setting up a frontend development environment are forthcoming.
