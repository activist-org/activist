<template>
  <div class="card-style">
    <div class="flex items-center justify-start gap-1 w-full mb-3 px-4 pb-2 pt-6">
      <h1 class="text-4xl font-bold">
        Getting Involved
        <Icon
          name="bi:box-arrow-up-right"
          size="0.5em"
          style="vertical-align: baseline"
        />
      </h1>
      
    </div>
    <div class="flex justify-between items-center px-4">
        <p>The following are working groups within Berliner Obdachlosenhilfe:</p>
        <div class="flex items-center justify-center gap-3">
            <LabeledBtn
              :cta="true"
              label="View all groups"
              linkTo="https://tally.so/r/nprxbq"
              fontSize="sm"
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
      class="w-full flex justify-between items-start space-x-3 overflow-x-scroll p-4 mb-4"
    >
      <CardsFeed
        title="Group Name"
        description="Lorem ipsum dolor sit amet, consectetur"
      />
      <CardsFeed
        title="Group Name"
        description="Lorem ipsum dolor sit amet, consectetur"
      />
      <CardsFeed
        title="Group Name"
        description="Lorem ipsum dolor sit amet, consectetur"
      />
      <CardsFeed
        title="Group Name"
        description="Lorem ipsum dolor sit amet, consectetur"
      />
      <CardsFeed
        title="Group Name"
        description="Lorem ipsum dolor sit amet, consectetur"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>
