<template>
  <div class="w-full card-style px-5 py-6">
    <h2 class="block font-medium responsive-h3 mb-1">
      {{ $t("components.card-topic-selection.header") }}
    </h2>
    <p>
      {{ $t("components.card-topic-selection.topic-selection-prompt") }}
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
</template>

<script setup lang="ts">
const formData = ref({
  topics: ["justice", "activism"],
  newTopic: "",
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
</script>
