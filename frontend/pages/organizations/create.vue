<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <ProgressBar type="default" :progress="1" :start="1" :end="1" />
    <div class="px-14 mt-2"><PageBreadcrumbs :breadcrumbs="breadcrumbs" /></div>
    <div class="px-14 mt-4">
      <h1 class="font-bold responsive-h2">
        {{ $t("pages.organizations.create.header") }}
      </h1>
      <p class="mt-4">
        {{ $t("pages.organizations.create.subtext") }}
      </p>
    </div>
    <form
      @submit.prevent="submit"
      class="pt-4 flex flex-col w-full justify-center items-center px-14"
    >
      <div class="flex w-full justify-between mx-14 px-5 card-style gap-6 py-6">
        <div class="w-1/2">
          <label for="name" class="block font-medium responsive-h3"
            >Organization name</label
          >
          <input
            v-model="formData.name"
            id="name"
            class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
            type="text"
            name="name"
            placeholder="The name of the organization"
          />
        </div>
        <div class="w-1/2">
          <label for="location" class="block font-medium responsive-h3"
            >Location</label
          >
          <input
            v-model="formData.location"
            id="location"
            class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
            type="text"
            name="location"
            placeholder="Where the organization is based or active"
          />
        </div>
      </div>
      <div class="mx-14 w-full card-style mt-5 px-5 py-6">
        <label for="description" class="block font-medium responsive-h3"
          >Description</label
        >
        <textarea
          v-model="formData.description"
          id="description"
          class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
          name="description"
          placeholder="Please provide a description of the organization for the community so that we can learn more about its goals and composition."
        ></textarea>
      </div>
      <div class="mx-14 w-full card-style mt-5 px-5 py-6">
        <label for="tagline" class="block font-medium responsive-h3"
          >Tagline</label
        >
        <input
          v-model="formData.tagline"
          id="tagline"
          class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
          name="tagline"
          placeholder="Please provide a tagline for the organization."
        />
      </div>
      <!-- TODO: add connect and topic custom components -->
      <div class="mx-14 w-full card-style mt-5 px-5 py-6">
        <h2 class="block font-medium responsive-h3 mb-1">Topics</h2>
        <p class="">
          Please select up to three topics that this organization predominantly
          works on so that the community can more easily find it.
        </p>
        <input
          v-model="formData.newTopic"
          @keydown.enter="addTopic()"
          @keydown.prevent.enter="addTopic()"
          class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
          type="text"
          name="newTopic"
          placeholder="Add a new topic"
        />
        <ul class="list-none flex items-center gap-2 pt-2">
          <li
            v-for="topic in formData.topics"
            class="bg-light-placeholder dark:bg-dark-placeholder py-1 px-2 rounded-md text-white flex items-center"
          >
            {{ topic }}
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
        <CardConnect
          :social-links="formData.social_accounts"
          :userIsAdmin="true"
        />
      </div>

      <div class="mx-14 flex flex-col w-full mt-5">
        <div class="flex space-x-2">
          <FormCheckbox />
          <label for="terms" class="font-medium flex">
            <p>{{ $t("pages.organizations.create.terms-pt-1") }}&nbsp;</p>
            <a href="#" class="text-blue-500">{{
              $t("pages.organizations.create.terms-pt-2")
            }}</a>
            <p>.</p>
          </label>
        </div>
        <div class="my-5">
          <BtnLabeled
            :cta="true"
            class="flex"
            label="pages.organizations.create.complete-application"
            fontSize="lg"
            ariaLabel="pages.organizations.create.complete-application-aria-label"
          />
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
  topics: ["justice", "activism"],
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
      }),
    }
  );

  //TODO: FEATURE - push notification with toast should be added here

  window.location.href = "/organizations";
};
</script>
