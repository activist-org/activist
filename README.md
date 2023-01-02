<!-- <div align="center">
  <a href="https://github.com/activist-org/activist"><img src="https://raw.githubusercontent.com/activist-org/Organization/main/logo/activistGitHubOrgBanner.png" width=1024 alt="activist Logo"></a>
</div> -->

# activist

[![web](https://img.shields.io/badge/Web-999999.svg?logo=windows-terminal&logoColor=ffffff)](https://github.com/activist-org/activist)
[![issues](https://img.shields.io/github/issues/activist-org/activist?label=%20&logo=github)](https://github.com/activist-org/activist/issues)
[![django](https://img.shields.io/badge/Django%204-092E20.svg?logo=django&logoColor=ffffff)](#tech-stack)
[![react](https://img.shields.io/badge/React%2018-61DBFB.svg?logo=react&logoColor=2A2D2E)](#tech-stack)
[![tailwind](https://img.shields.io/badge/Tailwind%203-38BDF8.svg?logo=tailwindcss&logoColor=ffffff)](#tech-stack)
[![license](https://img.shields.io/github/license/activist-org/activist-iOS.svg?label=%20)](https://github.com/activist-org/activist/blob/main/LICENSE.txt)
[![coc](https://img.shields.io/badge/Contributor%20Covenant-ff69b4.svg)](https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md)
[![instagram](https://img.shields.io/badge/Instagram-8A3AB9.svg?logo=instagram&logoColor=ffffff)](https://instagram.com/activist_org)
[![twitter](https://img.shields.io/badge/Twitter-1DA1F2.svg?logo=twitter&logoColor=ffffff)](https://twitter.com/activist_org)

<!-- [![twitter](https://img.shields.io/badge/Twitter-activist__org-1DA1F2.svg?logo=twitter&logoColor=ffffff)](https://twitter.com/activist_org)
[![instagram](https://img.shields.io/badge/Instagram-activist__org-8134AF.svg?logo=instagram&logoColor=ffffff)](https://instagram.com/activist_org) -->

<!-- Also available on [Android](https://github.com/activist-org/activist-Android) (planned) and [iOS](https://github.com/activist-org/activist-iOS) (planned). -->

### An open-source, nonprofit activist network

[**activist.org**](http://activist.org/) is a network for sociopolitical action that allows people the world over to coordinate and collaborate on the issues that matter most. The current goal is the creation of a central platform to find and discover political events and organizations.

**What does the activist `a` mean?** The center of the letter represents an arrow that points towards left-center from the top - that we want to work with the left and center of the political spectrum and value a democratic movement of power down to the people.

<a id="contents"></a>

# **Contents**

- [Preview Images](#preview)
- [Contributing](#contributing)
- [Platform Overview](#overview)
- [Supported By](#supported-by)

<a id="preview"></a>

# Preview [`⇧`](#contents)

The following is a screenshot to show the current progress of the development:

<div align="center">
  <kbd>
  <a href="https://github.com/activist-org/activist/blob/main/.github/resources/images/dark_landing_page_preview.png#gh-dark-mode-only"><img height=25% src=".github/resources/images/dark_landing_page_preview.png" alt="Landing Page Preview"></a>
  <a href="https://github.com/activist-org/activist/blob/main/.github/resources/images/light_landing_page_preview.png#gh-light-mode-only"><img height=25% src=".github/resources/images/light_landing_page_preview.png" alt="Landing Page Preview"></a>
  </kbd>
</div>

<a id="contributing"></a>

# Contributing [`⇧`](#contents)

Work that is in progress or could be implemented is tracked in the [issues](https://github.com/activist-org/activist/issues) and [projects](https://github.com/activist-org/activist/projects). Please see the [contribution guidelines](https://github.com/activist-org/activist/blob/main/CONTRIBUTING.md) if you are interested in contributing to activist. Also check the [`-next release-`](https://github.com/activist-org/activist/labels/-next%20release-) and [`-priority-`](https://github.com/activist-org/activist/labels/-priority-) labels in the [issues](https://github.com/activist-org/activist/issues) for those that are most important, as well as those marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that are tailored for first time contributors.

After your first few pull requests organization members would be happy to discuss granting you further rights as a contributor, with a maintainer role then being possible after continued interest in the project. activist seeks to be an inclusive and supportive organization. We'd love to have you on the team!

## Ways to Help [`⇧`](#contents)

- [Reporting bugs](https://github.com/activist-org/activist/issues/new?assignees=&labels=bug&template=bug_report.yml) as they're found 🐞
- Working on [new features](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3Afeature) ✨
- [Localization](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3Alocalization) for the platform 🌐
- [Documentation](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3Adocumentation) for onboarding and project cohesion 📝
<!-- - [Sharing activist.org](https://github.com/activist-org/activist/issues/181) with others! 🚀 -->

### Road Map

The activist road map can be followed in the organization's [project board](https://github.com/orgs/activist-org/projects/1) where we list the most important issues along with their priority, status and an indication of which sub projects they're included in (if applicable).

<a id="tech-stack"></a>

## Tech Stack [`⇧`](#contents)

<details><summary><strong>Backend tools</strong></summary>
<p>

- [Django](https://www.djangoproject.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Celery](https://docs.celeryq.dev/en/stable/)

</p>
</details>

<details><summary><strong>Frontend tools</strong></summary>
<p>

- [React](https://reactjs.org/) (planned)
- [esbuild](https://esbuild.github.io/)
- [TailwindCSS](https://tailwindcss.com/)

</p>
</details>

<details><summary><strong>Analytics tools</strong></summary>
<p>

- [Matomo](https://matomo.org/) (planned)

</p>
</details>

## Environment Setup [`⇧`](#contents)

To setup your development environment, first install [Docker](https://docs.docker.com/install/) and [Docker-Compose](https://docs.docker.com/compose/).

Then clone this repository with the below command:

```bash
git clone https://github.com/activist-org/activist.git
```

Enter the created directory and start your docker images with the following:

```bash
cd activist
docker-compose up --build
# Run the following in a second terminal screen to setup the initial database.
./run manage migrate
```

You can visit <http://localhost:8000> to see the development build once the container is up and running.

## Designs [`⇧`](#contents)

<a href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231"><img src=".github/resources/images/figma_logo.png" height="50" alt="Public Figma Designs" align="right"></a>

The [designs for activist](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231) are made using [Figma](https://www.figma.com). Those with interest can use the [discussions](https://github.com/activist-org/activist/discussions) to make suggestions for improvements. Design related issues are marked with the [`design`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Adesign) label.

Note that the linked Figma file above is the [public facing designs](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in improving them or contributing designs for new features are invited to contact the team on GitHub or via the email on the public designs welcome page. We'd love to see a sample of your work, and if everything looks good we'll schedule a time to get connected!

<a id="overview"></a>

# Platform Overview [`⇧`](#contents)

The following sections give a general overview of the various aspects of [activist.org](http://activist.org/).

## Organizations [`⇧`](#contents)

activist is first and foremost about organizations, with the design of the platform being tailored to their needs rather than those of individuals. The main function of organizations on activist is organizing and hosting [events](#events), but future features aim to help them achieve their goals and scale more effectively.

Organizations will eventually have the following features:

### Application

All organizations have to apply to join activist. The application process is the way that the community transparently expands, with the support for applications from organizations already on the platform serving to verify those who want to join.

### Working Groups

Working groups allow organizations to organize themselves into smaller teams for specific purposes.

### Tasks

Tasks are all the things that organizations need to do, which will be able to be organized in lists and kanban boards. Tasks can themselves be [events](#events).

### Communications

Organizations will be able to send out communications to their members (announcements) and supporters (statements).

## Events [`⇧`](#contents)

Events are where things happen on activist. They are organized by [issue](#issues) and [level](#levels), with the former being the focus of the event, and the latter being the kind of participation that people attending should expect.

### Levels

Activism levels are the kind of involvement for the event, with each being a necessary component to progress within a given issue:

- Act
- Learn

Coloration is used to easily delineate the level of a particular event, with blue being for learning, green being for supporting, and red being for acting.

## Movements [`⇧`](#contents)

activist includes a broad selection of movements:

|                        |                             |                            |
| :--------------------- | :-------------------------- | :------------------------- |
| Environment            | Animal Rights               | Democracy                  |
| LGTBQIA+               | Human Rights                | Women’s Rights             |
| Children’s Rights      | Elder Rights                | Racial Justice             |
| Health                 | Housing and Community       | Refugees and Migration     |
| Worker’s Rights        | Technology and Privacy      | Trade and Development      |
| Nutrition              | Accessibility and Inclusion | Emergency Relief           |
| Education              | Freedom of Expression       | Institutional Transparency |
| Substance Legalization | Peace and Resolution        | Other                      |

Beyond these general issues, tags will also be used to draw community attention to more specific issues.

## Resources [`⇧`](#contents)

Resources at the start will aggregate links to files that organizations want to organize and present to their members and the general public (if made open). Later the goal is to allow for the creation of unique hosted resources such as maps that indicate areas of interest and presentations of statistical findings from researchers.

## Activists [`⇧`](#contents)

Activists, user accounts, will not be included in the MVP beyond what's needed for organizations. The main goal for this component at the start is to derive technical specifications that assure that privacy at the highest level can be provided to those users who want it, while at the same time allowing for those who want to work in the open to do so. Activism is a dangerous job for many, and the platform will respect the needs of those who do dangerous work and still want to participate. Hidden accounts is the current working idea, but it should be noted that such accounts may not be fully featured.

## Affiliations [`⇧`](#contents)

activist has various kinds of relationships between between organizations and activists that are collectively known as affiliations. The possible affiliations include:

- Supporter: an organization or activist that supports another
- Ally: the relationship of mutual support

What kind of affiliate an organization or activist is will determine their notifications and degrees of access to private content.

## Votes [`⇧`](#contents)

Another forthcoming feature, the Votes section would allow events to be made in relation to elections and legislation. Whether or not this section would be integrated into Events is yet to be decided. Generally the idea is that [Wikidata](https://wikidata.org) would be used as a source for votes in the various regions in which activist operates.

<a id="supported-by"></a>

# Supported By [`⇧`](#contents)

activist has received support from the following organizations as a participant in the [UNLOCK accelerator](https://www.wikimedia.de/unlock/):

<div align="center">
  <br>
    <a href="https://www.wikimedia.de/"><img height="130"src=".github/resources/images/wikimedia_deutschland_logo.png" alt="Wikimedia Deutschland"></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://wikimedia.rs/"><img height="120" src=".github/resources/images/wikimedia_serbia_logo.png" alt="Wikimedia Serbia"></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://belgrade.impacthub.net/"><img height="120" src=".github/resources/images/impact_hub_belgrade_logo.png" alt="Impact Hub Belgrade"></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <br>
</div>

<a id="disclosure"></a>

# Powered By

### Contributors

Many thanks to all the [activist.org contributors](https://github.com/activist-org/activist/graphs/contributors)! 🚀

<!-- <a href="https://github.com/activist-org/activist/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=activist-org/activist" />
</a> -->

### Code

<details><summary><strong>List of referenced code</strong></summary>
<p>

- [docker-django-example](https://github.com/nickjj/docker-django-example) by [nickjj](https://github.com/nickjj) ([License](https://github.com/nickjj/docker-django-example/blob/main/LICENSE))

</p>
</details>

# Disclosure

activist is not directly affiliated with any corporations, political parties, governments or non-government organizations. Our goal is to make activism easier for our community and partner organizations.
