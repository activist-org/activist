<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Toaster :theme="$colorMode.value === 'dark' ? 'dark' : 'light'" />
  <div class="w-full">
    <IndicatorProcessProgress
      :end="1"
      :progress="1"
      :start="1"
      type="default"
    />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" />
      <div class="mt-4 pb-4">
        <h1 class="font-bold">
          {{ $t("i18n.pages.organizations.create.header") }}
        </h1>
        <p class="mt-4">
          {{ $t("i18n.pages.organizations.create.subtext") }}
        </p>
      </div>
      <Form
        id="organization-create-form"
        @submit="submit"
        class="flex w-full flex-col items-center justify-center pt-4"
        class-button="mb-4"
        :schema="schema"
        submit-label="i18n.pages.organizations.create.complete_application"
      >
        <!-- MARK: Name and Location -->
        <div class="card-style flex justify-between gap-6 px-5 py-6">
          <div class="w-1/2">
            <FormItem
              v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
              :label="$t('i18n._global.organization_name')"
              name="name"
              :required="true"
            >
              <!-- prettier-ignore-attribute :modelValue -->
              <FormTextInput
                :id="id"
                @blur="handleBlur"
                @input="handleChange"
                :hasError="!!errorMessage.value"
                :label="
                  $t(
                    'i18n.pages.organizations.create.organization_name_placeholder'
                  )
                "
                :modelValue="(value.value as string)"
              />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem
              v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
              :label="$t('i18n._global.location')"
              name="location"
              :required="true"
            >
              <!-- prettier-ignore-attribute :modelValue -->
              <FormTextInput
                :id="id"
                @blur="handleBlur"
                @input="handleChange"
                :hasError="!!errorMessage.value"
                :label="
                  $t('i18n.pages.organizations.create.location_placeholder')
                "
                :modelValue="(value.value as string)"
              />
            </FormItem>
          </div>
        </div>
        <!-- MARK: Description -->
        <div class="card-style mt-5 px-5 py-6">
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage }"
            :label="$t('i18n._global.description')"
            name="description"
            :required="true"
          >
            <FormTextArea
              :id="id"
              @blur="handleBlur"
              @input="handleChange"
              :hasError="!!errorMessage.value"
              :placeholder="
                $t('i18n.pages.organizations.create.description_placeholder')
              "
            />
          </FormItem>
        </div>
        <!-- MARK: Tagline -->
        <div class="card-style mt-5 px-5 py-6">
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
            :label="$t('i18n._global.tagline')"
            name="tagline"
          >
            <!-- prettier-ignore-attribute :modelValue -->
            <FormTextInput
              :id="id"
              @blur="handleBlur"
              @input="handleChange"
              :hasError="!!errorMessage.value"
              :label="$t('i18n.pages.organizations.create.tagline_placeholder')"
              :modelValue="(value.value as string)"
            />
          </FormItem>
        </div>
        <!-- MARK: Topics -->
        <div class="card-style mt-5 px-5 pb-6">
          <FormItem
            v-slot="{ id, handleChange, handleBlur, value }"
            name="topics"
          >
            <!-- prettier-ignore-attribute v-model -->
            <CardTopicSelection
              :id="id"
              v-model="(value.value as TopicEnum[])"
              @blur="handleBlur"
              @input="handleChange"
              class="mt-5"
              pageType="organization"
            />
          </FormItem>
        </div>
        <!-- MARK: Connect -->
        <div class="mt-5">
          <CardConnectOrganization />
        </div>
        <!-- MARK: Terms -->
        <div class="mt-5 flex flex-col">
          <div class="flex space-x-2">
            <FormCheckbox />
            <label class="flex font-medium" for="terms">
              <p>{{ $t("i18n.pages._global.terms_of_service_pt_1") }}&nbsp;</p>
              <NuxtLink
                class="link-text"
                target="_blank"
                :to="localePath('/legal/privacy-policy')"
              >
                {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
              </NuxtLink>
              <p>.</p>
            </label>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toaster, toast } from "vue-sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Organization name is required"),
  tagline: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  topics: z.array(z.string()).optional(),
});

const localePath = useLocalePath();

const submit = async () => {
  // const responseId = await organizationStore.create(
  //   values as OrganizationCreateFormData
  // );
  const responseId = "test-id"; // TODO: Replace with actual response from store
  if (responseId) {
    navigateTo(localePath(`/organizations/${responseId}`));
  } else {
    toast.error("Something went wrong. Please try again later.");
  }
};
</script>
