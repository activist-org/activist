<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
    <p>
      We'd love to hear from activists, volunteers, supporters, and anyone with
      ideas or questions!
    </p>

    <form @submit.prevent="submitForm">
      <label>
        Name:
        <input type="text" v-model="form.name" required />
      </label>
      <label>
        Email:
        <input type="email" v-model="form.email" required />
      </label>
      <label>
        Message:
        <textarea v-model="form.message" required></textarea>
      </label>
      <button type="submit">Send Message</button>
    </form>

    <p v-if="submitted" class="thank-you">
      Thank you for contacting us! We’ll get back to you soon.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
      submitted: false,
    };
  },
  methods: {
    async submitForm() {
      // In the future, this will send to team@activist.org
      // For now, simulate success
      console.log("Form submitted:", this.form);
      this.submitted = true;

      // Optionally reset the form
      this.form = { name: "", email: "", message: "" };
    },
  },
};
</script>

<style scoped>
.contact-page {
  max-width: 600px;
  margin: auto;
}
label {
  display: block;
  margin-top: 1em;
}
input,
textarea {
  width: 100%;
  padding: 0.5em;
  margin-top: 0.25em;
}
button {
  margin-top: 1em;
}
.thank-you {
  margin-top: 2em;
  color: green;
}
</style>
