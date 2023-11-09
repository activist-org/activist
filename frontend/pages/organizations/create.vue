<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <ProgressBar type="default" :progress="1" :start="1" :end="1" />
    <div class="px-8 mt-2"><PageBreadcrumbs :breadcrumbs="breadcrumbs" /></div>
    <div class="px-8 mt-4">
      <h1 class="font-bold responsive-h2">
        {{ $t("pages.organizations.create.header") }}
      </h1>
      <p class="mt-4">
        {{ $t("pages.organizations.create.subtext") }}
      </p>
    </div>
    <form
      @submit.prevent="submit"
      class="pt-4 flex flex-col w-full justify-center items-center px-8"
    >
      <div class="flex w-full justify-between mx-14 px-5 card-style gap-6 py-6">
        <div class="w-1/2">
          <label for="name" class="block font-medium responsive-h3"
            >{{ $t("pages.organizations.create.organization-name") }}*</label
          >
          <input
            v-model="formData.name"
            id="name"
            class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
            type="text"
            name="name"
            :placeholder="
              $t('pages.organizations.create.organization-name-placeholder')
            "
          />
        </div>
        <div class="w-1/2">
          <label for="location" class="block font-medium responsive-h3"
            >{{ $t("pages.organizations.create.location") }}*</label
          >
          <input
            v-model="formData.location"
            id="location"
            class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
            type="text"
            name="location"
            :placeholder="$t('pages.organizations.create.location-placeholder')"
          />
        </div>
      </div>
      <div class="mx-14 w-full card-style mt-5 px-5 py-6">
        <label for="description" class="block font-medium responsive-h3"
          >{{ $t("pages.organizations.create.description") }}*</label
        >
        <textarea
          v-model="formData.description"
          id="description"
          class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
          name="description"
          :placeholder="
            $t('pages.organizations.create.description-placeholder')
          "
        ></textarea>
      </div>
      <div class="mx-14 w-full card-style mt-5 px-5 py-6">
        <label for="tagline" class="block font-medium responsive-h3">{{
          $t("pages.organizations.create.tagline")
        }}</label>
        <input
          v-model="formData.tagline"
          id="tagline"
          class="px-4 py-2 mt-2 w-full border rounded-md border-light-section-div dark:border-dark-section-div bg:light-content dark:bg-dark-content"
          name="tagline"
          :placeholder="$t('pages.organizations.create.tagline-placeholder')"
        />
      </div>
      <CardTopicSelection v-model="formData.topics" class="mt-5" />
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
            type="submit"
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

const formData = ref({
  name: "",
  location: "",
  description: "",
  tagline: "",
  social_accounts: [],
  topics: ["justice", "activism"],
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
