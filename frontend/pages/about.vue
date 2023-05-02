<template>
  <div class="text-light-text dark:text-dark-text">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/activist_icon_light.png"
        alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/activist_icon_dark.png"
        alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/activist_icon_light.png"
            alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/activist_icon_dark.png"
            alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1 class="pb-2 font-semibold responsive-text-4">
            About activist.org
          </h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              name="bi:info-circle-fill"
              size="1.25em"
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
            />
            <p>
              See the
              <a
                href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=805%3A231&t=vNWHCPdiq5EbPaO9-1"
                class="items-center focus-brand link-text"
                target="_blank"
              >
                designs on Figma
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
            We're a Berlin-based team with a growing global network of
            affiliates and partners. Our goal is to create and maintain a
            platform that enables more people to safely engage in activism,
            learn from experienced organizers as well as replicate proven and
            novel strategies and tactics for social and ecological change.
          </p>
          <p>
            We're building a free, open-source and privacy-focused technical
            infrastructure that can rival with the commercial campaigning tools
            that are often inaccessible — financially and/or technically — to
            small progressive organizations.
          </p>
          <p>
            We want to end their dependance on Big Tech infrastructure and put
            tools of social action into the hands of everyone willing to work
            towards a more equitable society. Well-executed campaign tactics
            should not be the exception for well-funded, tech-savvy activists,
            but a tool for all participants in social movements.
          </p>
          <p>
            That also means building a user experience that is easy and fun to
            use while establishing security best-practices from the very
            beginning. From signup to regularly organizing events. Imagine every
            person new to activism showing up well-prepared to their first
            meeting — guided by the knowledge and tools of veteran organizers —
            and immediately being able to contribute a meaningful cause.
          </p>
          <p class="pb-2 lg:pb-4">
            Interested in helping? Please visit us
            <a
              href="https://github.com/orgs/activist-org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              on GitHub
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            to contribute code, translations or suggestions to the project.
            You're also welcome to join us in our
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
            to share ideas, ask questions or just say hi :) For activists
            already involved in an organization, please use the form in the
            <strong>Request access</strong> button below to get in contact with
            us. We'll be in touch soon after!
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
            src="/images/content_pages/activist_icon_light.png"
            alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/activist_icon_dark.png"
            alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const title = ref("About");
</script>
