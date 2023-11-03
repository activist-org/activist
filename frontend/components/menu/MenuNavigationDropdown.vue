<template>
  <div>
    <div class="fixed top-12 bg-dark-gray
    z-20 w-full h-10 border-b-2 md:hidden bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div
    ">
      <Listbox v-model="selectedPerson">
        <ListboxButton class="flex items-center align-middle text-white
        relative w-full py-2 pl-3 pr-10 text-left shadow-md">
          <Icon name="bi:person-fill-check" class="w-5 h-5 mr-2 align-middle" aria-hidden="true" />
          {{ selectedPerson.name }}
          <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon name="tabler:chevron-down" class="w-5 h-5 mr-2 align-middle" aria-hidden="true" />

          </span>
        </ListboxButton>
        <ListboxOptions class="bg-dark-gray">
          <ListboxOption
            v-for="person in people"
            :key="person.id"
            :value="person"
            :disabled="person.unavailable"
            class="text-white"
          >
            {{ person.name }}
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
const people = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
]
const selectedPerson = ref(people[0])
</script>

<style scoped>
.bg-dark-gray {
  background-color: #333;
}
</style>