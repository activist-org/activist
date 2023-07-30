<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content for mobile. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/mockups/get_organized_light.png"
        :alt="$t('get-organized-modal-image-alt-text')"
        class="w-full md:hidden h-1/6"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/mockups/get_organized_dark.png"
        :alt="$t('get-organized-modal-image-alt-text')"
        class="w-full md:hidden h-1/6"
      />
      <div class="w-10/12 gap-16 2xl:grid 2xl:grid-cols-2 md:w-full">
        <ModalImage
          imageURL="/images/content_pages/mockups/get_organized"
          imageAltText="get-organized-modal-image-alt-text"
        />
        <div
          class="items-center text-left space-y-4 2xl:col-span-1 2xl:row-start-1 md:items-start"
        >
          <h1 class="pb-2 font-bold responsive-h1">Tools for organizers</h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            />
            <p>
              See the
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
          </div>
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
            class="grid grid-cols-1 max-w-[70%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[80%] grid-rows-2 gap-y-4 sm:gap-y-0 sm:gap-x-4 md:gap-x-6 xl:gap-x-8 mx-auto sm:mx-0 sm:grid-cols-2 sm:grid-rows-1"
          >
            <BtnLabeled
              :cta="true"
              label="Request access"
              linkTo="https://tally.so/r/nprxbq"
              fontSize="lg"
              class="w-full"
            />
            <BtnLabeled
              :cta="false"
              label="Return home"
              linkTo="/"
              fontSize="lg"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const title = ref("Get Organized");
</script>
