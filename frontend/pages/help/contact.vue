<template>
  <div>

    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div class="container mx-auto md:w-[1200px]">
      <div v-if="!emailSent" class="flex container max-md:flex-col mx-auto justify-center p-4">
        <div class="md:w-1/2 flex flex-col space-y-2 p-4 max-md:text-center">
          <h1 class="text-light-text dark:text-dark-text text-[40px]">
            We'd love to hear from you!
          </h1>
          <p class="text-light-text dark:text-dark-text">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
            make a type specimen book. It has survived not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
            sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>

        <div class="md:ml-auto md:w-[500px]">
          <form @submit.prevent="sendEmail" class="flex flex-col space-y-2 m-5 ">

            <label :class="!nameValidated ? 'text-red-500' : 'text-light-text dark:text-dark-text'">Name <span
                v-if="!nameValidated">cannot be
                empty.</span></label>

            <input @blur="validateName" v-model="name"
              :class="!nameValidated ? 'outline-red-500 outline outline-2' : 'outline-none focus:outline-none'"
              placeholder="Enter your name..."
              class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
              autocomplete="off" spellcheck="false" />

            <label :class="!emailValidated ? 'text-red-500' : 'text-light-text dark:text-dark-text'">Email <span
                v-if="!emailValidated">must be valid (example@mail.com).</span></label>

            <input @blur="validateEmail" v-model="email"
              :class="!emailValidated ? 'outline-red-500 outline outline-2' : 'outline-none focus:outline-none'"
              placeholder="Enter your email..."
              class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
              autocomplete="off" spellcheck="false" />

            <label :class="!messageValidated ? 'text-red-500' : 'text-light-text dark:text-dark-text'">Message
              <span v-if="!messageValidated">cannot be
                empty.</span></label>

            <textarea @blur="validateMessage" v-model="message"
              :class="!messageValidated ? 'outline-red-500 outline outline-2' : 'outline-none focus:outline-none'"
              rows="6" placeholder="Write something..."
              class="p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic resize-none bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
              autocomplete="off" spellcheck="false"></textarea>

            <button type="submit"
              class="ml-auto px-4 py-2 font-medium text-center border rounded-md select-none xl:rounded-lg focus-brand bg-light-cta-orange dark:bg-dark-cta-orange text-light-distinct  border-light-distinct dark:text-dark-distinct dark:border-dark-distinct"
              :class="!buttonDisabled ? 'hover:bg-light-cta-orange-light active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-light dark:active:bg-dark-cta-orange  ' : 'cursor-not-allowed'"
              :disabled="buttonDisabled">Send</button>
          </form>
        </div>
      </div>
      <div v-else class="p-4 justify-center flex text-center flex-col mx-auto items-center">
        <h1 class="text-[40px] font-semibold ">Thank you for for contacting Activist team</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
          a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions
          of Lorem Ipsum.</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const title = ref("Contact");
const name = ref('');
const email = ref('');
const message = ref('');
const nameValidated = ref(true)
const emailValidated = ref(true)
const messageValidated = ref(true)
const buttonDisabled = ref(true)
const mail = useMail()
const emailSent = ref(false)

const validateEmail = () => {
  if (!email.value.match(/.*@\w+\.\w+/)) {
    emailValidated.value = false
  }
}

const validateMessage = () => {
  if (message.value.trim().length === 0) {
    messageValidated.value = false
  }
}

const validateName = () => {
  if (name.value.trim().length === 0) {
    nameValidated.value = false
  }
}
watch(name, () => {
  if (name.value.length > 0) {
    nameValidated.value = true
  }
})

watch(email, () => {
  if (email.value.match(/.*@\w+\.\w+/)) {
    emailValidated.value = true
  }
})

watch(message, () => {
  if (message.value.length > 0) {
    messageValidated.value = true
  }
})

watch([message, email, name], () => {
  if (name.value.trim().length > 0 && email.value.match(/.*@\w+\.\w+/) && message.value.trim().length > 0) {
    buttonDisabled.value = false
  } else {
    buttonDisabled.value = true
  }
})

const sendEmail = async () => {
  if (name.value.trim().length > 0 && email.value.match(/.*@\w+\.\w+/) && message.value.trim().length > 0) {
    await mail.send({
      from: email.value,
      subject: `Activist contact message from ${name.value}`,
      text: message.value,
    })
    emailSent.value = true
  }
}




</script>
