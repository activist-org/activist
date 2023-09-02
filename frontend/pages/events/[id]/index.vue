<template>
  <div
    class="px-8 py-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content flex flex-col justify-between items-center gap-8"
  >
    <Head>
      <Title>{{ event.name }} </Title>
    </Head>

    <div class="w-3/4 h-[260px] mx-auto">
      <ImageEvent :eventType="event.type" :imgURL="event?.imageURL" />
    </div>

		<div class="flex flex-col items-center gap-2">
			<h1 class="font-bold responsive-h1 text-3xl text-light-text dark:text-dark-text">
				{{ event.name }}
			</h1>
	
			<h2 class="font-bold responsive-h2 text-lg text-light-special-text dark:text-dark-special-text">
				{{ event.tagline }}
			</h2>
		</div>

  </div>
</template>

<script setup lang="ts">
import { Event } from "../../types/event";
import { onMounted } from "vue";
const { id } = useRoute().params;

const event: Event = {
  name: "Test Event",
  type: "act",
  tagline: "We love to test!",
  organizer: "Testers LLC",
  topic: "Testing and Designing",
  description: "This is a test event for testers.",
  getInvolvedDescription: "Wanna help test?",
  onlineLocation: "Zoom Test Room",
  date: new Date(),
  supporters: 10,
};

onMounted(() => {
  redirectBasedOnScreenSize();
});

function redirectBasedOnScreenSize() {
  if (window.innerWidth > 640) {
    navigateTo(`/${id}/about`);
  }
}
</script>
