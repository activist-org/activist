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
        src="/images/content_pages/get_organized_light.png"
        alt="Drawing of a fist raised."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/get_organized_dark.png"
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
            src="/images/content_pages/get_organized_light.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/get_organized_dark.png"
            alt="Drawing of a fist raised."
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
          />
          <h1
            class="pb-2 text-2xl font-semibold sm:text-3xl md:text-4xl sm:w-full xl:text-5xl"
          >
            Tools for organizers
          </h1>
          <p class="py-2">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-link-text dark:text-dark-link-text"
            />
            &nbsp; See the
            <a
              href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=62%3A2&t=ytDrcE8K3RrfCxM6-1"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              event designs on Figma
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to learn more
          </p>
          <p>
            There will be so much more to an <strong>event</strong> on activist
            than a time and a place. We want to create an ecosystem of tools
            that allows organizers to onboard new joiners; keep track of all the
            tasks that need to be done to make the event a success; enable
            discussions with other organizations while providing event
            organizers with a direct voice to those attending; as well as
            provide needed information to make sure that everyone is safe and
            knows their rights while participating.
          </p>
          <p>
            One event is never enough though, so activist has the goal of
            linking political actions so that everyone involved knows the steps
            needed to have the biggest effect. Pre- and post-events will build
            and maintain momentum, while events hosted by more than one
            organization will allow for easier collaboration.
          </p>
          <p>
            Events and organizations will also be able to create and organize
            <strong>resources</strong> to make their work easier. Resources can
            include anything from news stories to spread information; images and
            graphs that make a strong point for action; research articles to
            expand knowledge about an issue; and much more.
          </p>
          <p class="pb-2 md:pb-4">
            Please use the <strong>Request access</strong> link below to tell us
            more about how you'd like to use activist! We'd also love to hear
            from you in our
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
            where our community plans all aspects of activist.
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
            src="/images/content_pages/get_organized_light.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/get_organized_dark.png"
            alt="Drawing of a fist raised."
            class="hidden 2xl:block h-80"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("Get Organized");
</script>
