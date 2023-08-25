<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.legal.trademark-policy.title") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        src="/images/content_pages/icons/bootstrap_trademark_light.png"
        alt="The trademark symbol - tm within a square.."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/icons/bootstrap_trademark_dark.png"
        alt="The trademark symbol - tm within a square.."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/bootstrap_trademark_light.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_trademark_dark.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1 class="pb-2 font-bold responsive-h1">Trademark Policy</h1>
          <p
            class="responsive-h4 text-light-special-text dark:text-dark-special-text"
          >
            {{ $t("pages.legal.trademark-policy.last-updated") }}
          </p>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-1") }}
          </p>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-2") }}
          </p>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-3") }}
          </p>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-4") }}
          </p>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-5-pt1") }}
            <a href="mailto:team@activist.org" class="focus-brand link-text"
              >team@activist.org</a
            >. {{ $t("pages.legal.trademark-policy.paragraph-5-pt2") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.trademark-policy.subtitle-1") }}</h2>
          <ul class="ml-6 list-disc">
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item1") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item2") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item3") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item4") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item5") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item6") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item7") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list1-item8") }}
            </li>
          </ul>
          <h2 class="font-bold responsive-h3">
            {{ $t("pages.legal.trademark-policy.subtitle-2") }}
          </h2>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-6") }}
          </p>
          <ul class="ml-6 list-disc">
            <li>
              {{ $t("pages.legal.trademark-policy.list2-item1") }}
            </li>
            <li>
              {{ $t("pages.legal.trademark-policy.list2-item2") }}
            </li>
          </ul>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.trademark-policy.subtitle-3") }}</h2>
          <ul class="ml-6 list-disc">
            <li>
              {{ $t("pages.legal.trademark-policy.list3-item1") }}
            </li>
          </ul>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.trademark-policy.subtitle-4") }}</h2>
          <p>
            {{ $t("pages.legal.trademark-policy.paragraph-7") }}
          </p>
          <p class="pb-2 lg:pb-4">
            {{ $t("pages.legal.trademark-policy.paragraph-8-pt1") }}
            <a
              href="https://github.com/orgs/activist-org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              {{ $t("pages.legal.trademark-policy.paragraph-8-pt2") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.legal.trademark-policy.paragraph-8-pt3") }}
            <a
              href="https://matrix.to/#/#activist_community:matrix.org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              {{ $t("pages.legal.trademark-policy.paragraph-8-pt4") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.legal.trademark-policy.paragraph-8-pt5") }}
          </p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <BtnLabeled
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
            src="/images/content_pages/icons/bootstrap_trademark_light.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_trademark_dark.png"
            alt="The trademark symbol - tm within a square.."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
