<div align="center">
  <a href="https://github.com/activist-org/activist"><img src="https://raw.githubusercontent.com/activist-org/Organization/main/logos/activistGitHubOrgBanner.png" width=1024 alt="activist Logo"></a>
</div>

<!-- [![django](https://img.shields.io/badge/Django%204-092E20.svg?logo=django&logoColor=ffffff)](#tech-stack) -->

[![platforms](https://img.shields.io/badge/Web-0183DC.svg?logo=windows-terminal&logoColor=ffffff)](https://github.com/activist-org/activist)
[![netlify](https://img.shields.io/netlify/f184f5a7-e9a8-4e3a-be26-70fefb50d4cb?label=%20&logo=netlify&logoColor=ffffff)](https://app.netlify.com/sites/activist-org)
[![issues](https://img.shields.io/github/issues/activist-org/activist?label=%20&logo=github)](https://github.com/activist-org/activist/issues)
[![nuxt](https://img.shields.io/badge/Nuxt%203-41b883.svg?logo=nuxt.js&logoColor=ffffff)](#tech-stack)
[![vue](https://img.shields.io/badge/Vue%203-41b883.svg?logo=vue.js&logoColor=ffffff)](#tech-stack)
[![tailwind](https://img.shields.io/badge/Tailwind%203-38BDF8.svg?logo=tailwindcss&logoColor=ffffff)](#tech-stack)
[![license](https://img.shields.io/github/license/activist-org/activist-iOS.svg?label=%20)](https://github.com/activist-org/activist/blob/main/LICENSE.txt)
[![coc](https://img.shields.io/badge/Contributor%20Covenant-ff69b4.svg)](https://github.com/activist-org/activist/blob/main/.github/CODE_OF_CONDUCT.md)
[![twitter](https://img.shields.io/badge/Twitter-1DA1F2.svg?logo=twitter&logoColor=ffffff)](https://twitter.com/activist_org)
[![instagram](https://img.shields.io/badge/Instagram-8134AF.svg?logo=instagram&logoColor=ffffff)](https://instagram.com/activist_org)
[![matrix](https://img.shields.io/badge/Matrix-000000.svg?logo=matrix&logoColor=ffffff)](https://matrix.to/#/#activist_community:matrix.org)

<!-- Also available on [Android](https://github.com/activist-org/activist-Android) (planned) and [iOS](https://github.com/activist-org/activist-iOS) (planned). -->

<details><summary>🌐 Language</summary>
<p>

- [Open a localization issue](https://github.com/activist-org/activist/issues/new?assignees=&labels=localization&template=localization.yml) to add a new readme to the [README](https://github.com/activist-org/activist/tree/main/README) directory

</p>
</details>

### Open-source, nonprofit activism platform

[**activist.org**](https://activist.org) is a network for political action that allows people to coordinate and collaborate on the issues that matter most to them. The current goal is the creation of a central platform to discover activist organizations and their events.

> **Note**: The [contributing](#contributing) section has information for those interested, with the articles and presentations in [supported by](#supported-by) also being good resources for learning more about activist.

[**Frequently Asked Questions**](https://activist.org/help/faq)

<a id="contents"></a>

# **Contents**

- [Preview Video](#preview)
- [Contributing](#contributing)
- [Platform Overview](#overview)
- [Supported By](#supported-by)

<a id="preview"></a>

# Preview Video [`⇧`](#contents)

The following is a recording of the [Creating and Joining Events prototype](https://www.figma.com/proto/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=1998%3A2577&scaling=contain&page-id=1986%3A1046&starting-point-node-id=1998%3A2577) found on [Figma](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231):

https://user-images.githubusercontent.com/24387426/215117858-96b0d3ac-4d11-449e-bcc0-2b7ec330a6e1.mp4

Further prototypes and designs are available in the [designs for activist](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Feedback and ideas can be submitted via a [design issue](https://github.com/activist-org/activist/issues/new?assignees=&labels=design&template=design_improvement.yml).

<a id="contributing"></a>

# Contributing [`⇧`](#contents)

<a href="https://matrix.to/#/#activist_community:matrix.org"><img src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/MatrixLogoGrey.png" height="50" alt="Public Matrix Chat" align="right"></a>

activist uses [Matrix](https://matrix.org/) for communications. You're more than welcome to [join us in our public chat rooms](https://matrix.to/#/#activist_community:matrix.org) to share ideas, ask questions or just say hi :)

Please see the [contribution guidelines](https://github.com/activist-org/activist/blob/main/CONTRIBUTING.md) and [style guide](https://github.com/activist-org/activist/blob/main/STYLEGUIDE.md) if you are interested in contributing to activist. Work that is in progress or could be implemented is tracked in the [issues](https://github.com/activist-org/activist/issues) and [projects](https://github.com/activist-org/activist/projects).

> **Note**: Just because an issue is assigned on GitHub doesn't mean that the team isn't interested in your contribution! Feel free to write [in the issues](https://github.com/activist-org/activist/issues) and we can potentially reassign it to you.

Also check the [`-next release-`](https://github.com/activist-org/activist/labels/-next%20release-) and [`-priority-`](https://github.com/activist-org/activist/labels/-priority-) labels in the [issues](https://github.com/activist-org/activist/issues) for those that are most important, as well as those marked [`good first issue`](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that are tailored for first time contributors.

After your first pull requests organization members would be happy to discuss granting you further rights as a contributor, with a maintainer role then being possible after continued interest in the project. activist seeks to be an inclusive and supportive organization. We'd love to have you on the team!

## Environment Setup [`⇧`](#contents)

To setup your development environment, first install [Docker](https://docs.docker.com/install) and [Docker-Compose](https://docs.docker.com/compose).

> **Note**: If you are new to Docker, as an alternative activist recommends installing [Docker Desktop](https://docs.docker.com/desktop/). Docker Desktop comes with many Docker tools and a straightforward GUI (Graphical User Interface).

Then clone this repository with the below command:

```bash
git clone https://github.com/activist-org/activist.git
```

Enter the created directory and start your docker images with the following:

```bash
cd activist
docker-compose up
# Or with new dependencies:
# docker-compose up --build
```

You can then visit <http://localhost:3000> to see the development frontend build once the container is up and running.

## Ways to Help [`⇧`](#contents)

- [Reporting bugs](https://github.com/activist-org/activist/issues/new?assignees=&labels=bug&template=bug_report.yml) as they're found 🐞
- Working on [new features](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3Afeature) ✨
- [Localization](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3Alocalization) for the platform 🌐
  - Please join our public localization project [on Transifex](https://explore.transifex.com/activist-org/activist)!
- [Documentation](https://github.com/activist-org/activist/issues?q=is%3Aissue+is%3Aopen+label%3Adocumentation) for onboarding and project cohesion 📝
- [Sharing activist.org](https://github.com/activist-org/activist/issues/23) with others! 🚀

### Road Map

The activist road map can be followed in the organization's [project board](https://github.com/orgs/activist-org/projects/1) where we list the most important issues along with their priority, status and an indication of which sub projects they're included in (if applicable).

<a id="tech-stack"></a>

## Tech Stack [`⇧`](#contents)

The following are the current and planned technologies for [activist.org](https://activist.org):

### Frontend

- [Nuxt.js](https://nuxt.com) • [Vue.js](https://vuejs.org) • [TypeScript](https://www.typescriptlang.org) • [Tailwind CSS](https://tailwindcss.com) • [Headless UI](https://headlessui.com)

<details><summary>Frontend tools</summary>
<p>

- Countless [Nuxt modules](https://nuxt.com/modules)
- [OpenStreetMap](https://www.openstreetmap.org)
- [Leaflet](https://leafletjs.com/)

</p>
</details>

### Backend

- [Django](https://www.djangoproject.com) (planned) • [PostgreSQL](https://www.postgresql.org) (planned) • [Redis](https://redis.io) (planned) • [Celery](https://docs.celeryq.dev/en/stable) (planned)

### Deployment

- [Docker](https://www.docker.com) • [Netlify](https://www.netlify.com) • [Vitest](https://vitest.dev/) (planned)

### Localization

- [Nuxt I18n](https://github.com/nuxt-modules/i18n) • [Transifex](https://www.transifex.com/) ([activist on Transifex](https://explore.transifex.com/activist-org/activist))

<!-- ### Analytics

- [Plausible](https://plausible.io/) (planned) -->

<a id="designs"></a>

## Designs [`⇧`](#contents)

<a href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231"><img src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/FigmaLogo.png" height="50" alt="Public Figma Designs" align="right"></a>

The [designs for activist](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231) are made using [Figma](https://www.figma.com). Those with interest can use the [issues](https://github.com/activist-org/activist/issues) to make suggestions for improvements. Design related issues are marked with the [`design`](https://github.com/activist-org/activist/issues?q=is%3Aopen+is%3Aissue+label%3Adesign) label.

Note that the Figma file above is the [public facing designs](https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_designs?node-id=805%3A231). Those interested in improving them or contributing designs for new features are invited to contact the team on GitHub or via the email on the public designs welcome page. We'd love to see a sample of your work and if everything looks good we'll schedule a time to get connected!

<a id="overview"></a>

# Platform Overview [`⇧`](#contents)

The following sections give a general overview of the various features of [activist.org](https://activist.org).

## Organizations [`⇧`](#contents)

activist is first and foremost about organizations, with the design of the platform being tailored to their needs. The main function of organizations on activist is organizing and hosting [events](#events), but future features aim to help them achieve their goals and scale more effectively.

Organizations will eventually have the following features:

### Applying to join

All organizations have to apply to join activist. The application process is the way that the community transparently expands, with the support from organizations already on the platform serving to verify those who want to join. Interactions on the platform will also in some cases be limited to members of organizations. In this way we create important links of trust from organizations to other organizations and each organization to its individual members.

### Working Groups

Working groups will allow organizations to organize themselves into smaller teams for specific purposes.

### Communications

Organizations will be able to send out communications to their members (announcements) and supporters (statements).

### Tasks

Tasks are all the things that organizations need to do, which will be able to be organized in lists and kanban boards.

<a id="events"></a>

## Events [`⇧`](#contents)

Events are where things happen on activist. They are organized by [movements](#movements), [types](#types) and [formats](#formats): the first being the focus of the event; the second being the kind of participation that people attending should expect; and the third being the specific kind of activity happening (see below).

<a id="movements"></a>

### Movements

activist will eventually include a broad selection of movements. From the start the platform will focus on a select few: `Environment`, `Housing` and `Refugees and Migration`. Further movements will be added later as interest from organizations and the community grows. The following are the working movements that activist could include:

|                      |                             |                            |
| :------------------- | :-------------------------- | :------------------------- |
| Environment          | Housing                     | Refugees and Migration     |
| LGTBQIA+             | Racial Justice              | Women's Rights             |
| Children's Rights    | Elder Rights                | Education                  |
| Health and Wellbeing | Animal Rights               | Democracy                  |
| Labor Rights         | Technology and Privacy      | Peace and Resolution       |
| Nutrition            | Accessibility and Inclusion | Institutional Transparency |
| Infrastructure       | Freedom of Expression       | Emergency Relief           |

<br/>
Beyond clustering by movements, tags will also be used to draw community attention to more specific issues.

<a id="types"></a>

### Types

`Act` and `Learn` are the two types of an event on activist, with coloration being used to easily delineate the level of participation for a particular event (🔴 red is for act and 🔵 blue is for learn).

<a id="formats"></a>

### Formats

Types are further broken down into specific formats. The available formats currently include:

- Act: protests, volunteering, organizing, fundraising
- Learn: seminars, webinars, meetings, panel discussions

Formats are not required for events like movements and types, but add an optional granularity to help people find what they're looking for.

## Resources [`⇧`](#contents)

Resources at the start will aggregate links to files that organizations want to present to their members and the general public (if made open). Later the goal is to allow for the creation of unique hosted resources such as maps that indicate areas of interest, findings from researchers, news articles and any other kind of information that they would like to share.

## Activists [`⇧`](#contents)

Activists, user accounts, will not be included in the MVP beyond what's needed for organization management. The main goal at the start is to derive technical specifications that assure that privacy at the highest level can be provided to those users who want it, while at the same time balancing features needed by the community. Activism is dangerous work for many and the platform will respect the needs of those who need anonymity in their work and still want to participate.

## Affiliations [`⇧`](#contents)

activist will have various kinds of relationships between organizations and activists that are collectively known as affiliations. The possible affiliations include:

- Supporter: an organization or activist that supports another ➡️
- Ally: the relationship of mutual support ↔️

What kind of affiliate an organization or activist is will determine their notifications and degrees of access to private content.

## Votes [`⇧`](#contents)

Another forthcoming feature, the votes section would allow events to be made in relation to elections and legislation. This would allow users to filter by votes to find events that have an impact on the legislative process. Generally the idea is that [Wikidata](https://wikidata.org) would be used as a source for votes in the various regions in which activist operates.

<a id="supported-by"></a>

# Supported By [`⇧`](#contents)

<details open><summary><strong>activist Featured on the Web</strong></summary>
<p>

<strong>2023</strong>

- [Presentation](https://docs.google.com/presentation/d/1MMCi8UoGZgDOLovEsE-jHNsPQcoQD5pQxLCI1E9Qt0Q/edit?usp=sharing) of activist at the Berlin [tech from below meetup](https://techfrombelow.de/2023-05-11/)

<strong>2022</strong>

- [Presentation](https://www.youtube.com/watch?v=PdUZ8zFWnCk&list=PLduaHBu_3ejMxN1xipMDCOTb0wx6wxWnZ) for the [2022 Wikimedia UNLOCK accelerator](https://www.wikimedia.de/unlock)
- activist on the [Wikimedia UNLOCK accelerator website](https://www.wikimedia.de/unlock/unlock-projects/activist-org)

</p>
</details>

activist has received support from the following organizations as a participant in the [UNLOCK accelerator](https://www.wikimedia.de/unlock):

<div align="center">
  <br>
    <a href="https://www.wikimedia.de"><img height="130"src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/WikimediaDeutschlandLogo.png" alt="Wikimedia Deutschland"></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://wikimedia.rs"><img height="120" src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/WikimediaSerbiaLogo.png" alt="Wikimedia Serbia"></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://belgrade.impacthub.net"><img height="120" src="https://raw.githubusercontent.com/activist-org/Organization/main/resources/images/logos/ImpactHubLogo.png" alt="Impact Hub Belgrade"></a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <br>
</div>

# Powered By

### Contributors

Many thanks to all the [activist.org contributors](https://github.com/activist-org/activist/graphs/contributors)! 🚀

<a href="https://github.com/activist-org/activist/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=activist-org/activist" />
</a>

# Disclosure

activist is not directly affiliated with any corporations, political parties or governments. Our goal is to make activism easier for our community and partner organizations.
