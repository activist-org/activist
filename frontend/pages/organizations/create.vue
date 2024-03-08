<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <ProgressBar type="default" :progress="1" :start="1" :end="1" />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" :breadcrumbs="breadcrumbs" />
      <div class="mt-4">
        <h1 class="font-bold responsive-h2">
          {{ $t("pages.organizations.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.organizations.create.subtext") }}
        </p>
      </div>
      <form
        @submit.prevent="submit"
        class="flex flex-col items-center justify-center w-full pt-4"
      >
        <div
          class="flex justify-between w-full px-5 py-6 gap-6 mx-14 card-style"
        >
          <div class="w-1/2">
            <label for="name" class="block font-medium responsive-h3"
              >{{ $t("_global.organization-name") }}*</label
            >
            <input
              v-model="formData.name"
              id="name"
              class="w-full px-4 py-2 mt-2 border rounded-md border-light-section-div dark:border-dark-section-div bg:light-layer-0 dark:bg-dark-layer-0"
              type="text"
              name="name"
              :placeholder="
                $t('pages.organizations.create.organization-name-placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <label for="location" class="block font-medium responsive-h3"
              >{{ $t("pages._global.location") }}*</label
            >
            <input
              v-model="formData.location"
              id="location"
              class="w-full px-4 py-2 mt-2 border rounded-md border-light-section-div dark:border-dark-section-div bg:light-layer-0 dark:bg-dark-layer-0"
              type="text"
              name="location"
              :placeholder="
                $t('pages.organizations.create.location-placeholder')
              "
            />
          </div>
        </div>
        <div class="w-full px-5 py-6 mt-5 mx-14 card-style">
          <label for="description" class="block font-medium responsive-h3"
            >{{ $t("pages.organizations.create.description") }}*</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            class="w-full px-4 py-2 mt-2 border rounded-md border-light-section-div dark:border-dark-section-div bg:light-layer-0 dark:bg-dark-layer-0"
            name="description"
            :placeholder="
              $t('pages.organizations.create.description-placeholder')
            "
          ></textarea>
        </div>
        <div class="w-full px-5 py-6 mt-5 mx-14 card-style">
          <label for="tagline" class="block font-medium responsive-h3">{{
            $t("pages.organizations.create.tagline")
          }}</label>
          <input
            v-model="formData.tagline"
            id="tagline"
            class="w-full px-4 py-2 mt-2 border rounded-md border-light-section-div dark:border-dark-section-div bg:light-layer-0 dark:bg-dark-layer-0"
            name="tagline"
            :placeholder="$t('pages.organizations.create.tagline-placeholder')"
          />
        </div>
        <CardTopicSelection v-model="formData.topics" class="mt-5" />
        <div class="w-full mt-5 mx-14">
          <CardConnect
            :social-links="formData.social_accounts"
            :userIsAdmin="true"
          />
        </div>
        <div class="flex flex-col w-full mt-5 mx-14">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label for="terms" class="flex font-medium">
              <p>{{ $t("pages._global.terms-of-service-pt-1") }}&nbsp;</p>
              <a href="#" class="text-blue-500">{{
                $t("pages._global.terms-of-service-pt-2")
              }}</a>
              <p>.</p>
            </label>
          </div>
          <div class="my-5">
            <BtnAction
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const formData = ref({
  name: "",
  location: "",
  description: "",
  tagline: "",
  social_accounts: [],
  topics: [],
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
