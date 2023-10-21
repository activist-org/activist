<template>
  <div class="w-full">
    <div
      class="flex justify-between items-center bg-dark-special-text-over-header"
    >
      <h1 class="text-2xl font-semibold pl-14">Create Organization</h1>
      <div class="flex">
        <button
          class="flex justify-between items-center bg-dark-cta-orange px-3 py-[0.35rem]"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <span>Close</span>
        </button>
      </div>
    </div>
    <div class="px-14 mt-2"><PageBreadcrumbs :breadcrumbs="breadcrumbs" /></div>
    <div class="px-14 mt-4">
      <h1 class="font-bold responsive-h2">Application information</h1>
      <p class="mt-4">
        Thanks for bringing your organization to activist! The following
        information is requested so that our community can better understand
        what the goals of the organization are. Checking each new organization
        takes time for all of us, but in this way we can maintain trust within
        the network. We look forward to working with and supporting you all!
      </p>
    </div>
    <form @submit.prevent="submit" class="pt-4 flex flex-col w-full justify-center items-center px-14">
      <div class="flex w-full justify-between mx-14 px-5 card-style gap-6 py-10">
        <div class="w-1/2">
          <label for="name" class="block font-medium responsive-h6">Organization name</label>
          <input
            v-model="formData.name"
            id="name"
            type="text"
            name="name"
            placeholder="The name of the organization"
            class="responsive-h6 px-4 py-2 mt-2 w-full bg-dark-input-bg text-dark-input-text border border-dark-input-border rounded-md"
          />
        </div>
        <div class="w-1/2">
          <label for="location" class="block font-medium responsive-h6">Location</label>
          <input
            v-model="formData.location"
            id="location"
            type="text"
            name="location"
            placeholder="Where the organization is based or active"
            class="responsive-h6 px-4 py-2 mt-2 w-full bg-dark-input-bg text-dark-input-text border border-dark-input-border rounded-md"
          />
        </div>
      </div>
      <div class="mx-14 w-full card-style mt-5 px-5 py-10">
        <label for="description" class="block font-medium responsive-h6">Description</label>
        <textarea
          v-model="formData.description"
          id="description"
          name="description"
          placeholder="Please provide a description of the organization for the community so that we can learn more about its goals and composition."
          class="responsive-h6 px-4 py-2 mt-2 w-full bg-dark-input-bg text-dark-input-text border border-dark-input-border rounded-md"
        ></textarea>
      </div>
      <div class="mx-14 w-full card-style mt-5 px-5 py-10">
        <label for="tagline" class="block font-medium responsive-h6">Tagline</label>
        <input
          v-model="formData.tagline"
          id="tagline"
          name="tagline"
          placeholder="Please provide a tagline for the organization."
          class="responsive-h6 px-4 py-2 mt-2 w-full bg-dark-input-bg text-dark-input-text border border-dark-input-border rounded-md"
        />
      </div>
      <!-- TODO: add connect and topic custom components -->
      
      <div class="mx-14 w-full card-style mt-5 px-5 py-10">
        <h2 class="block font-medium responsive-h4 mb-1">Topics</h2>
        <p class="">Please select up to three topics that this organization predominantly works on so that the community can more easily find it.</p>
        <input v-model="formData.newTopic" @keydown.enter="addTopic()" @keydown.prevent.enter="addTopic()" type="text" name="newTopic" placeholder="Add a new topic" class="responsive-h6 px-4 py-2 my-2 w-full bg-dark-input-bg text-dark-input-text border border-dark-input-border rounded-md" />
        <ul class="list-none flex items-center gap-2">
          <li v-for="topic in formData.topics" class="bg-dark-special-text-over-header py-1 px-2 rounded-md text-white flex items-center">
            {{ topic  }}
            <button @click="removeTopic(topic)" class="ml-2">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </div>
      <div class="mx-14 w-full mt-5">
        <CardConnect :social-links="formData.social_accounts" :userIsAdmin="true" />
      </div>

      <div class="mx-14 flex flex-col w-full mt-5">
        <div>
          <input
            id="terms"
            type="checkbox"
            name="terms"
            class="mr-2"
          />
          <label for="terms" class="font-medium responsive-h6">I have read and agree to the <a href="#" class="text-blue-500">organization terms and conditions.</a></label>
        </div>
        <div class="my-5">
          <button type="submit" class="px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700 text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10 text-sm hidden lg:block">complete application</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "sidebar",
});
const sidebar = useSidebar();

const addTopic = () => {
  if (formData.value.newTopic) {
    formData.value.topics.push(formData.value.newTopic);
    formData.value.newTopic = "";
  }
};

const removeTopic = (topic: string) => {
  formData.value.topics = formData.value.topics.filter((t) => t !== topic);
};



const formData = ref({
  name: "",
  location: "",
  description: "",
  tagline: "",
  social_accounts: [],
  topics : ["justice", "activism"],
  newTopic: "",
});

const submit = async () => {

  const { data: responseData } = await useFetch(
    "http://127.0.0.1:8000/v1/entities/organizations/",
    {
      method: "POST",
      body: JSON.stringify({
        name: formData.value.name,
        location: formData.value.location,
        tagline: formData.value.tagline,
        description: formData.value.description,
        social_accounts: ["https://twitter.com/activist_hq"],
        created_by: "cdfecc96-2dd5-435b-baba-a7610afee70e",
        topics: formData.value.topics,
        high_risk: false,
        total_flags: 0,
      })
    });

    //TODO: FEATURE - push notification with toast should be added here


    window.location.href = "/organizations";

};
</script>
