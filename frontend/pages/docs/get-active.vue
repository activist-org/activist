<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full px-6 py-6 md:py-10 lg:py-12 xl:py-16 lg:px-10 xl:px-14"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/get_active_light.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/get_active_dark.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="grid w-10/12 grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div
          class="items-center space-y-2 text-left md:space-y-4 md:items-start"
        >
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/get_active_light.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/get_active_dark.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <h1
            class="pb-2 text-2xl font-semibold sm:text-3xl md:text-4xl sm:w-full xl:text-5xl"
          >
            Discover and get involved
          </h1>
          <p class="py-2">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-cta-orange dark:text-dark-cta-orange"
            />
            &nbsp; See the
            <a
              href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=2475%3A19102&t=ytDrcE8K3RrfCxM6-1"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              homepage designs on Figma
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to learn more
          </p>
          <p>
            activist has the goal of making finding political
            <strong>events</strong> and <strong>organizations</strong> near you
            as easy as possible. With each event we want people to have an
            opportunity to get involved in the organization that's putting it
            on, and once in an organization we want to make it easy to find what
            to do next to have the biggest impact.
          </p>
          <p>Events are broken down based on the following criteria:</p>
          <ul class="pl-6 list-disc xl:pl-10">
            <li>
              The <strong>movement</strong> they're a part of
              <ul class="pl-4 list-disc xl:pl-6">
                <li>Environment, refugees, housing and countless others</li>
              </ul>
            </li>
            <li>
              The type of event — <strong>Act</strong> or <strong>Learn</strong>
              <ul class="pl-4 list-disc xl:pl-6">
                <li>Search based on the level of involvement you want</li>
              </ul>
            </li>
            <li>
              The event <strong>format</strong>
              <ul class="pl-4 list-disc xl:pl-6">
                <li>Act: protests, volunteering, organizing ...</li>
                <li>Learn: seminars, meetings, panel discussions ...</li>
              </ul>
            </li>
          </ul>
          <p>
            Organizations are also categorized based on the the movements they
            work on to make them easy to find. From there it's up to you to show
            up to an event and follow up on becoming a regular contributor, but
            we aim to take as much friction out of this process as possible.
          </p>
          <p class="pb-2 md:pb-4">
            Please use the <strong>Request access</strong> link below to tell us
            more about you and your activism! We'd also love to hear from you in
            our
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
            so we know how best to help you in your work.
          </p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <LabeledBtn
              :cta="true"
              label="Request access"
              linkTo="https://tally.so/r/nprxbq"
              fontSize="lg"
            />
            <LabeledBtn
              :cta="false"
              label="Return home"
              linkTo="/"
              fontSize="lg"
            />
          </div>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/get_active_light.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/get_active_dark.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Get Active");
</script>
