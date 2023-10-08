<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ event.name }}</title>
    </head>
    <headerapppage :event="event">
      <div class="flex space-x-2 lg:space-x-3">
        <btnlabeled
          class="w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.offer-to-help"
          fontSize="sm"
          rightIcon="bi:arrow-right"
          iconSize="1.25em"
          ariaLabel="components.btn-labeled.offer-to-help-aria-label"
        />
        <btnlabeled
          class="hidden md:block w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.support"
          fontSize="sm"
          leftIcon="iconsupport"
          iconSize="1.25em"
          :counter="event.supporters"
          ariaLabel="components.btn-labeled.support-event-aria-label"
        />
        <btnlabeled
          class="md:hidden w-fit"
          :cta="true"
          linkTo="/"
          fontSize="sm"
          leftIcon="iconsupport"
          iconSize="1.25em"
          :counter="event.supporters"
          ariaLabel="components.btn-labeled.support-event-aria-label"
        />
        <btnlabeled
          class="hidden md:block w-max"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.share-event"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.25em"
          ariaLabel="components.btn-labeled.share-event-aria-label"
        />
        <btnlabeled
          class="md:hidden w-fit"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.share"
          fontSize="sm"
          leftIcon="bi:box-arrow-up"
          iconSize="1.25em"
          ariaLabel="components.btn-labeled.share-event-aria-label"
        />
      </div>
    </headerapppage>
    <div class="pt-3 pb-6 space-y-6 lg:pt-4">
      <div
        class="pb-6 grid grid-cols-1 grid-rows-2 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6"
      >
        <cardabout class="lg:col-span-2" aboutType="event" :event="event" />
        <mediamap
          v-if="event.inPersonLocation"
          class="w-full h-full"
          :addresses="[event.inPersonLocation]"
          :type="event.type"
          :title="event.name"
        />
      </div>
      <cardgetinvolved
        :event="event"
        disclaimer="lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum. stet clita kasd gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet. lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum. stet clita kasd gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet."
      />
      <cardconnect :social-links="event.socialLinks" :userIsAdmin="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { event } from "../../../types/event";

definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;

const event: event = {
  name: "brandenburg gate climate demo",
  tagline: "there is no planet b",
  organizer: "berlin climate org",
  type: "act",
  topic: "environment",
  description:
    "aute aliqua reprehenderit ex ut commodo nostrud et excepteur. sunt amet velit sunt fugiat et excepteur dolore pariatur nisi non. exercitation aute aute culpa commodo commodo ea lorem aliquip id duis. laboris nostrud ullamco ea voluptate et anim id adipisicing sint reprehenderit incididunt elit. est fugiat pariatur elit culpa in incididunt eu esse cupidatat minim. deserunt duis culpa minim lorem consectetur quis fugiat ipsum nostrud voluptate veniam do. reprehenderit duis officia in enim anim elit.",
  getInvolvedDescription:
    "sint cillum excepteur sint cupidatat do consectetur excepteur nisi veniam. sint id in sit eiusmod lorem commodo minim culpa id cupidatat consectetur. labore nisi est officia sunt occaecat.",
  inPersonLocation: "brandenburg gate, berlin",
  date: new date().toISOString().slice(0, 10),
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
  socialLinks: ["climate_org@mastodon", "climate_org@email.com"],
};
</script>
