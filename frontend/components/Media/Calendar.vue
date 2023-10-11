<template>
    <!-- <Calendar :attributes="attributes" :is-dark="$colorMode.value == 'dark'" /> -->
    <form class="flex flex-col max-h-fit sm:max-w-min">
        <tab1 :class="{ hidden: tab != 1 }">
        <DatePicker
            class="z-0"
            v-model="eventData.range"
            v-model.range="eventData.range"
            mode="dateTime"
            expanded
        >
        </DatePicker>
        <button
            type="button"
            @click="handler(2)"
            class="w-full my-2 px-4 py-2 mr-auto font-medium text-center border select-none rounded-md xl:rounded-lg focus-brand bg-light-cta-orange dark:bg-dark-cta-orange text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct"
        >
            next
        </button>
        </tab1>
        <tab2
        :class="{ hidden: tab != 2 }"
        class="grow flex flex-col gap-2 z-10 h-[408px] max-w-[250px]"
        >
            <div class="text-center">
            <div class="text-black p-1">{{ eventData.range.start.toLocaleString() }}</div>
            <Icon name="bx:right-arrow" size="1em" />
            <div class="text-black p-1">{{ eventData.range.end.toLocaleString() }}</div>
            </div>
            <label 
            :class="
                !validation.name
                ? 'text-red-500'
                : 'text-light-text dark:text-dark-text'
            "
            class="text-light-text dark:text-dark-text" for="name">Event Name</label>
            <input
            id="name"
            v-model="eventData.name"
            @blur="checkEmpty('name', true)"
            :class="
                !validation.name
                ? 'outline-red-500 outline outline-2'
                : 'outline-none focus:outline-none'
            "
            type="text"
            class="flex-none outline-none focus:outline-none p-2 rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
            />
            <label
            :class="
                !validation.description
                ? 'text-red-500'
                : 'text-light-text dark:text-dark-text'
            "
            class="text-light-text dark:text-dark-text" for="description">Event Description</label>
            <textarea
            id="description"
            v-model="eventData.description"
            @blur="checkEmpty('description', true)"
            :class="
                    !validation.description
                    ? 'outline-red-500 outline outline-2'
                    : 'outline-none focus:outline-none'
            "
            class="grow outline-none focus:outline-none p-2 resize-none rounded-md placeholder:dark:dark-placeholder placeholder:light-placeholder placeholder:italic bg-light-highlight dark:bg-dark-highlight focus:bg-light-distinct focus:dark:bg-dark-distinct text-light-text dark:text-dark-text"
            ></textarea>
        <div class="flex gap-2">
            <button
            type="button"
            @click="handler(1)"
            class="w-full my-2 px-4 py-2 mr-auto font-medium text-center border select-none rounded-md xl:rounded-lg focus-brand bg-light-cta-orange dark:bg-dark-cta-orange text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct"
        >
            prev
        </button>
            <button
            type="button"
            @click="sendData"
            :disabled="submitDisabled"
            class="w-full my-2 px-4 py-2 mr-auto font-medium text-center border select-none rounded-md xl:rounded-lg focus-brand bg-light-cta-orange dark:bg-dark-cta-orange text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct"
        >
            submit
        </button>
        </div>
        </tab2>
    </form>
</template>

<script setup>
  import { DatePicker } from "v-calendar";
  import "v-calendar/style.css";

  import { ref, watch } from "vue";

  const tab = ref(1);
  const eventData = ref({
    name: "",
    description : "",
    range : {
      start: new Date(),
      end: new Date(),
    }
  })
  const validation = ref({
    name: true,
    description: true
  })

  const submitDisabled = ref(true)
  const checkEmpty = (name, onBlur = false) => {
    if (eventData.value[name].trim().length > 0) {
      validation.value[name] = true
    } else if (onBlur) {
      validation.value[name] = false
    }
  }

  watch(eventData.value.name, checkEmpty("name"))
  watch(eventData.value.description, checkEmpty("description"))
  watch(eventData.value, () => {
    if (eventData.value.description.trim().length > 0 && eventData.value.name.trim().length > 0) return submitDisabled.value = false
    submitDisabled.value = true
  });

  const handler = (value) => {
    tab.value = value;
  };

  const sendData = async () => {
    try {
      console.log(eventData.value);
      alert("the following information should be posted to api: \n" + JSON.stringify(eventData.value))

      const response = await fetch("https://apiplaceholder.io/eventData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData.value),
      });

      await response.json()
    } catch (error) {
      console.log(error)
    }
  }
</script>
