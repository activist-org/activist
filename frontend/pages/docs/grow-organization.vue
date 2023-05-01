<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full px-6 py-8 md:py-10 lg:py-12 xl:py-16 lg:px-10 xl:px-14"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/grow_organization_light.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/grow_organization_dark.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div
          class="items-center text-left space-y-2 md:space-y-4 md:items-start"
        >
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/grow_organization_light.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/grow_organization_dark.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <h1
            class="pb-2 text-2xl font-semibold sm:text-3xl md:text-4xl sm:w-full xl:text-5xl"
          >
            Expand your movement
          </h1>
          <p class="flex flex-row py-2 space-x-3">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            />
            <p>
              See the
            <a
              href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=517%3A4852&t=ytDrcE8K3RrfCxM6-1"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              organization designs on Figma
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to learn more
            </p>
          </p>
          <p>
            activist is first and foremost about
            <strong>organizations</strong>, with the design of the platform
            being tailored to their needs. The main function of organizations on
            activist is organizing and hosting <strong>events</strong>, but
            future features aim to help them achieve their goals and scale more
            effectively.
          </p>
          <p>
            With activist you can keep track of all your pads, protocols,
            decisions and events in one place while at the same time quickly
            onboarding new joiners to your political actions. We want to inspire
            as well as improve collaboration between organizations because we
            know that we're only going to be able to sustain action together.
          </p>
          <p>
            Of paramount importance to activist's health is the
            <strong>application to join</strong> for all organizations. We'll
            start with a select few that will then help us choose all future
            organizations that join the platform. In this way we hope to instill
            trust in the community — that no organization has not been vouched
            for, and that when interacting with a person they are verified and
            brought in by people that others work with.
          </p>
          <p>
            Long term features will integrate every aspect of an organization's
            political life: making working groups and assigning tasks; releasing
            statements to their supporters; finding and tailoring actions based
            on real life legislation; and much more!
          </p>
          <p class="pb-2 md:pb-4">
            Please use the <strong>Request access</strong> link below to tell us
            more about your organization! We'd also love to hear from you in our
            <a
              href="https://matrix.to/#/#activist_community:matrix.org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              public Matrix chat rooms
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            so we know how best to help your organization.
          </p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <LabeledBtn
              :cta="true"
              label="Request access"
              linkTo="https://tally.so/r/nprxbq"
              fontSize="lg"
              style="width: 200px;"
            />
            <LabeledBtn
              :cta="false"
              label="Return home"
              linkTo="/"
              fontSize="lg"
              style="width: 200px;"
            />
          </div>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/grow_organization_light.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/grow_organization_dark.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Grow Organization");
</script>
