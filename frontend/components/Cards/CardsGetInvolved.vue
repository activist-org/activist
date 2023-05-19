<template>
  <div class="card-style">
    <div
      class="flex items-center justify-center sm:justify-start gap-1 w-full mb-3 px-4 pb-2 pt-6"
    >
      <h1 class="text-4xl font-bold">
        Getting Involved
        <Icon
          name="bi:box-arrow-up-right"
          size="0.5em"
          style="vertical-align: baseline"
        />
      </h1>
    </div>
    <div v-if="feeds">
      <div class="flex flex-col sm:flex-row justify-between items-center px-4">
        <p class="mb-1 text-center sm:text-justify sm:mb-0">
          The following are working groups within Berliner Obdachlosenhilfe:
        </p>
        <div class="flex items-center justify-center gap-3">
          <LabeledBtn
            :cta="true"
            label="View all groups"
            linkTo="https://tally.so/r/nprxbq"
            fontSize="sm"
            class=""
          />
          <LabeledBtn
            :cta="true"
            label="Join organisation"
            linkTo="https://tally.so/r/nprxbq"
            fontSize="sm"
          />
        </div>
      </div>
      <div
        class="w-full flex flex-col items-center justify-center sm:flex-row sm:justify-between sm:items-start sm:space-x-3 overflow-x-scroll scrolling-touch p-4 mb-4"
      >
        <div v-for="feed in feeds">
          <CardsFeed
            :title="feed.title"
            :description="feed.description"
            class="mb-3 sm:mb-0 w-[310px]"
          />
        </div>
      </div>
    </div>
    <div class="px-4" v-if="event">
      <div>
        <p class="mb-1 text-center sm:text-justify sm:mb-2">
          {{ event?.description }}
        </p>
        <p class="mb-1 text-center sm:text-justify sm:mb-2">
          Detailed shift plan:
        </p>
        <ul class="mb-1 text-center sm:text-justify sm:mb-2 list-disc" v-for="(plan, index) in event?.plans">
          <li class="ml-6">{{ plan }}</li>
        </ul>
        <p class="mb-1 text-center sm:text-justify sm:mb-2">
          We’d be happy to have your support!
        </p>
      </div>
      <div class="flex flex-col justify-center">
        <p class="mb-1 text-center sm:text-justify sm:mb-2">
          Please read the legal disclaimer below for more information on your
          rights during this event!
        </p>
        <div
          class="flex px-2 py-3 w-full bg-light-header dark:bg-dark-header cursor-pointer justify-start items-center gap-3 border rounded-md font-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight focus-brand"
          :class="{
            'bg-light-menu-selection dark:bg-dark-menu-selection text-light-distinct dark:text-dark-distinct':
              selected == true,
            'text-light-text dark:text-dark-text': selected == false,
          }"
        >
          <Icon name="bi:globe" />
          <p>Legal disclaimer</p>
          <Icon name="bi:globe" />
        </div>
        <div class="mb-6 mt-4">
          <LabeledBtn
            :cta="true"
            label="Offer to help"
            linkTo="https://tally.so/r/nprxbq"
            fontSize="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  selected?: boolean;
  event?: {
    description?: string
    plans?: Array<string>
    disclaimer?: string
  }
  feeds?: Array<{
    title?: string;
    description?: string;
  }>;
}>();
</script>
