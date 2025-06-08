<template>
  <div class="mx-auto max-w-xl p-6">
    <h1 class="mb-4 text-3xl font-bold">Contact Us</h1>
    <p class="mb-6">
      We'd love to hear from you! Whether you're an activist, supporter, or just
      have a question, feel free to reach out. Thanks for contacting us!
    </p>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block text-sm font-medium">Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full rounded border p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full rounded border p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Message</label>
        <textarea
          v-model="form.message"
          required
          class="w-full rounded border p-2"
          rows="5"
        ></textarea>
      </div>

      <button
        type="submit"
        class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Send Message
      </button>

      <p v-if="submitted" class="mt-4 text-green-600">
        Thanks! Your message has been sent.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const submitted = ref(false);

const handleSubmit = () => {
  // This is where you would normally call your backend or email API
  console.log("Form submitted:", form.value);

  // Placeholder: Mark as submitted
  submitted.value = true;

  // Reset form (optional)
  form.value = {
    name: "",
    email: "",
    message: "",
  };
};
</script>

<style scoped>
/* optional: add styling here */
</style>
