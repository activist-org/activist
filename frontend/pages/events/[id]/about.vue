<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0 flex flex-col px-4 xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}</Title>
    </Head>
    <HeaderAppPage :event="event">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteInternal
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.offer-to-help"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.25em"
          ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
        />
        <BtnAction
          class="hidden w-max md:block"
          :cta="true"
          label="components.btn-action.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.25em"
          :counter="event.supporters"
          ariaLabel="components.btn-action.support-event-aria-label"
        />
        <ModalSharePage
          :cta="true"
          label="components.btn-action.share-event"
          ariaLabel="components.btn-action.share-event-aria-label"
          :event="event"
        />
      </div>
    </HeaderAppPage>
    <div class="space-y-6 pb-6">
      <div
        class="lg:grid lg:grid-cols-3 lg:grid-rows-1"
        :class="{
          'lg:mr-6 lg:space-x-6': !textExpanded,
        }"
      >
        <CardAbout
          @expand-reduce-text="expandReduceText"
          class="mb-6 lg:mb-0"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
          aboutType="event"
          :event="event"
        />
        <MediaMap
          v-if="
            (event.inPersonLocation && !textExpanded) ||
            (event.inPersonLocation && isUnderLargeBP)
          "
          class="h-[17.5rem] w-full"
          :markerColors="event.type === 'learn' ? ['#2176AE'] : ['#BA3D3B']"
          :eventNames="[event.name]"
          :eventLocations="[event.inPersonLocation]"
        />
      </div>
      <CardGetInvolved
        :event="event"
        disclaimer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
      <CardConnect :social-links="event.socialLinks" :userIsAdmin="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";

definePageMeta({
  layout: "sidebar",
});

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const isUnderLargeBP = ref(false);

const checkUnderLargeBP = () => {
  isUnderLargeBP.value = window.innerWidth < 1024;
};

const handleResize = () => {
  checkUnderLargeBP();
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize(); // initial check
});

const event: Event = {
  name: "Brandenburg Gate Climate Demo",
  tagline: "There is no Planet B",
  organizations: ["Berlin Climate Org", "Testing Corp"],
  type: "action",
  topic: "Environment",
  description:
    "Aute aliqua reprehenderit ex ut commodo nostrud et excepteur. Sunt amet velit sunt fugiat et excepteur dolore pariatur nisi non. Exercitation aute aute culpa commodo commodo ea Lorem aliquip id duis. Laboris nostrud ullamco ea voluptate et anim id adipisicing sint reprehenderit incididunt elit. Est fugiat pariatur elit culpa in incididunt eu esse cupidatat minim. Deserunt duis culpa minim Lorem consectetur quis fugiat ipsum nostrud voluptate veniam do. Reprehenderit duis officia in enim anim elit.",
  getInvolvedDescription:
    "Sint cillum excepteur sint cupidatat do consectetur excepteur nisi veniam. Sint id in sit eiusmod Lorem commodo minim culpa id cupidatat consectetur. Labore nisi est officia sunt occaecat.",
  inPersonLocation: "Brandenburg Gate, Berlin",
  date: new Date().toISOString().slice(0, 10),
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
  socialLinks: ["climate_org@mastodon", "climate_org@email.com"],
};
</script>
