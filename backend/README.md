# backend

[![django](https://img.shields.io/badge/Django-4-092E20.svg?logo=django&logoColor=ffffff)](https://github.com/activist-org/activist/tree/main/backend)
[![codestyle](https://img.shields.io/badge/style-black-000000.svg)](https://github.com/psf/black)
[![coc](https://img.shields.io/badge/coc-Contributor%20Covenant-ff69b4.svg)](https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md)

This directory contains the source code for the backend of activist.org. For the frontend please visit [activist/frontend](https://github.com/activist-org/activist/tree/main/frontend).

# **Contents**<a id="contents"></a>

- [Contributing](#contributing)
- [Setup](#setup)

<a id="contributing"></a>

# Contributing [`⇧`](#contents)

To setup your development environment, first install [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/). Then clone this repository with the following command:

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

Specific directions for setting up a backend development environment are forthcoming.
