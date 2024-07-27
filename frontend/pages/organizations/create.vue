<template>
  <Toaster :theme="$colorMode.value === 'dark' ? 'dark' : 'light'" />
  <div class="w-full text-light-text dark:text-dark-text">
    <IndicatorProcessProgress type="default" :progress="1" :start="1" :end="1" />
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
      <form @submit.prevent="submit" class="flex w-full flex-col items-center justify-center pt-4">
        <div class="card-style mx-14 flex w-full justify-between gap-6 px-5 py-6">
          <div class="w-1/2">
            <label for="name" class="responsive-h3 block font-medium">{{ $t("_global.organization-name") }}*</label>
            <input v-model="formData.name" id="name"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="text" name="name" :placeholder="$t('pages.organizations.create.organization-name-placeholder')
                " />
          </div>
          <div class="w-1/2">
            <label for="location" class="responsive-h3 block font-medium">{{ $t("pages._global.location") }}*</label>
            <input v-model="formData.location" id="location"
              class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
              type="text" name="location" :placeholder="$t('pages.organizations.create.location-placeholder')
                " />
          </div>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="description" class="responsive-h3 block font-medium"
            >{{ $t("pages._global.description") }}*</label
          >
          <textarea
            v-model="formData.description"
            id="description"
            class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
            name="description" :placeholder="$t('pages.organizations.create.description-placeholder')
              "></textarea>
        </div>
        <div class="card-style mx-14 mt-5 w-full px-5 py-6">
          <label for="tagline" class="responsive-h3 block font-medium">{{
            $t("pages._global.create.tagline")
            }}</label>
          <input v-model="formData.tagline" id="tagline"
            class="bg:light-layer-0 mt-2 w-full rounded-md border border-light-section-div px-4 py-2 dark:border-dark-section-div dark:bg-dark-layer-0"
            name="tagline" :placeholder="$t('pages.organizations.create.tagline-placeholder')" />
        </div>
        <CardTopicSelection v-model="formData.topics" class="mt-5" pageType="organization" />
        <div class="mx-14 mt-5 w-full">
          <CardConnect pageType="other" />
        </div>
        <div class="mx-14 mt-5 flex w-full flex-col">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label for="terms" class="flex font-medium">
              <p>{{ $t("pages._global.terms-of-service-pt-1") }}&nbsp;</p>
              <NuxtLink
                :to="localePath('/legal/privacy-policy')"
                target="_blank"
                class="link-text"
                >{{ $t("pages._global.terms-of-service-pt-2") }}</NuxtLink
              >

              <p>.</p>
            </label>
          </div>
          <div class="my-5">
            <BtnAction type="submit" :cta="true" class="flex" label="pages.organizations.create.complete-application"
              fontSize="lg" ariaLabel="pages.organizations.create.complete-application-aria-label" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toaster, toast } from "vue-sonner";
import BtnAction from "~/components/btn/action/BtnAction.vue";
import type { OrganizationCreateFormData } from "~/types/entities/organization";


definePageMeta({
  middleware: ["user-only"],
});

const formData = ref<OrganizationCreateFormData>({
  name: "",
  tagline: "",
  location: "",
  description: "",
  social_accounts: [],
  topics: [],
});

const localePath = useLocalePath();
const organizationStore = useOrganizationStore();

const submit = async () => {
  const responseID = await organizationStore.create(formData.value);

  if (responseID) {
    navigateTo(localePath(`/organizations/${responseID}`));
  } else {
    toast.error("Something went wrong. Please try again later.");
  }
};
</script>
