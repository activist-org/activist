<template></template>

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
