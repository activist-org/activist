<template>
  <div
    class="px-8 py-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content flex flex-col justify-between items-center gap-8"
  >
    <Head>
      <Title>{{ organization.name }} </Title>
    </Head>

    <div class="w-3/4 h-[260px] mx-auto">
      <ImageOrganization :imgURL="organization?.imageURL" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <h1
        class="font-bold responsive-h1 text-3xl text-light-text dark:text-dark-text"
      >
        {{ organization.name }}
      </h1>

      <h2
        class="font-bold responsive-h2 text-lg text-light-special-text dark:text-dark-special-text text-center"
      >
        {{ organization.tagline }}
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
import { Event } from "../../types/organization";
import { onMounted } from "vue";

const organization: Organization = {
  name: "tech from below",
  status: "approved",
  tagline: "Technologie von und für soziale Bewegungen",
  location: "Berlin",
  description: "This is the description of tech from below",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};

onMounted(() => {
  redirectBasedOnScreenSize();
});

function redirectBasedOnScreenSize() {
  if (window.innerWidth > 384) {
    navigateTo(`${id}/about`);
  }
}
</script>
