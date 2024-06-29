<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <IndicatorProcessProgress
      type="default"
      :progress="1"
      :start="1"
      :end="1"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div class="mt-4">
        <h1 class="responsive-h2 font-bold">
          {{ $t("pages.organizations.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("pages.organizations.create.subtext") }}
        </p>
      </div>
      <form
        @submit.prevent="submit"
        class="flex w-full flex-col items-center justify-center pt-4"
      >
        <div
          class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
        >
          <div class="w-1/2">
            <label for="name" class="responsive-h3 block font-medium"
              >{{ $t("_global.organization-name") }}*</label
            >
            <input
              v-model="formData.name"
              id="name"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="text"
              name="name"
              :placeholder="
                $t('pages.organizations.create.organization-name-placeholder')
              "
            />
          </div>
          <div class="w-1/2">
            <label for="location" class="responsive-h3 block font-medium"
              >{{ $t("pages._global.location") }}*</label
            >
            <input
              v-model="formData.location"
              id="location"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="text"
              name="location"
              :placeholder="
                $t('pages.organizations.create.location-placeholder')
              "
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="description" class="responsive-h3 block font-medium"
            >{{ $t("pages.organizations.create.description") }}*</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
            name="description"
            :placeholder="
              $t('pages.organizations.create.description-placeholder')
            "
          ></textarea>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="tagline" class="responsive-h3 block font-medium">{{
            $t("pages._global.create.tagline")
          }}</label>
          <input
            v-model="formData.tagline"
            id="tagline"
            class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
            name="tagline"
            :placeholder="$t('pages.organizations.create.tagline-placeholder')"
          />
        </div>
        <CardTopicSelection
          v-model="formData.topics"
          class="mt-5"
          pageType="organization"
        />
        <div class="mx-14 mt-5 w-full">
          <CardConnect pageType="other" />
        </div>
        <div class="mx-14 mt-5 flex w-full flex-col">
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
import type { Organization } from "~/types/entities/organization";

definePageMeta({
  middleware: ["user-only"],
});

const formData = ref({
  name: "",
  location: "",
  description: "",
  tagline: "",
  social_accounts: [],
  topics: [],
});

const token = localStorage.getItem("accessToken");
const localePath = useLocalePath();

const submit = async () => {
  const responseOrg = await useFetch(
    `${BASE_BACKEND_URL}/entities/organizations/`,
    {
      method: "POST",
      body: JSON.stringify({
        name: formData.value.name,
        location: formData.value.location,
        tagline: formData.value.tagline,
        social_accounts: ["https://twitter.com/activist-org"],
        created_by: "cdfecc96-2dd5-435b-baba-a7610afee70e",
        topics: ["test"],
        high_risk: false,
        total_flags: 0,
        acceptance_date: new Date(),
      }),
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  const responseOrgData = responseOrg.data.value as unknown as Organization;

  const responseOrgText = await useFetch(
    `${BASE_BACKEND_URL}/entities/organization_texts/`,
    {
      method: "POST",
      body: JSON.stringify({
        org_id: responseOrgData.id,
        iso: 1,
        description: formData.value.description,
        get_involved: "",
        donate_prompt: "",
      }),
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  // TODO: Push notification with toast should be added here.
  if (responseOrgText.error.value === null) {
    navigateTo(localePath(`/organizations/${responseOrgData.id}`));
  }
};
</script>
