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
      <FormKit
        @submit="submit"
        type="form"
        :actions="false"
        :classes="{
          form: 'flex w-full flex-col items-center justify-center pt-4'
        }"
        :config="{ validationVisibility: 'submit' }"
      >
        <div
          class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6"
        >
          <div class="w-1/2">
            <!-- name -->
            <label for="name" class="responsive-h3 block font-medium">
              {{ $t("_global.organization-name") }}*
            </label>
            <FormKit
              v-model="formData.name"
              id="name"
              type="text"
              name="name"
              :placeholder="$t('pages.organizations.create.organization-name-placeholder')"
              :classes="{
                input: 'bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0'
              }"
              validation="required"
            />
          </div>
          <div class="w-1/2">
            <!-- location -->
            <label for="location" class="responsive-h3 block font-medium">
              {{ $t("pages._global.location") }}*
            </label>
            <FormKit
              v-model="formData.location"
              id="location"
              type="text"
              name="location"
              :placeholder="$t('pages.organizations.create.location-placeholder')"
              :classes="{
                input: 'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0'
              }"
              validation="required"
            />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <!-- description -->
          <label for="description" class="responsive-h3 block font-medium">
            {{ $t("pages.organizations.create.description") }}*
          </label>
          <FormKit
            v-model="formData.description"
            id="description"
            type="textarea"
            name="description"
            :placeholder="$t('pages.organizations.create.description-placeholder')"
            :classes="{
              input: 'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0'
            }"
            validation="required"
          />
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <!-- tagline -->
          <label for="tagline" class="responsive-h3 block font-medium">
            {{ $t("pages._global.create.tagline") }}
          </label>
          <FormKit
            v-model="formData.tagline"
            id="tagline"
            type="text"
            name="tagline"
            :placeholder="$t('pages.organizations.create.tagline-placeholder')"
            :classes="{
              input: 'bg-light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0'
            }"
          />
        </div>
        <CardTopicSelection
          v-model="formData.topics"
          class="mt-5"
          pageType="organization"
        />
        <div class="mx-14 mt-5 w-full">
          <CardConnect
            :social-links="formData.social_accounts"
            :userIsAdmin="true"
          />
        </div>
        <div class="mx-14 mt-5 flex w-full flex-col">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label for="terms" class="flex font-medium">
              <p>{{ $t("pages._global.terms-of-service-pt-1") }}&nbsp;</p>
              <a href="#" class="text-blue-500">
                {{ $t("pages._global.terms-of-service-pt-2") }}
              </a>
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
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
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
