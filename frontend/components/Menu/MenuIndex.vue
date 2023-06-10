<template>
  <div class="flex flex-col items-center text-light-text dark:text-dark-text mx-2 md:h-4/6">
    <img :src="logoUrl" :alt="name">
    <p class="text-2xl font-bold text-center">{{ name }}</p>
    <ul class="flex flex-col w-full overflow-auto">
      <li v-if="menuType === 'organization'" v-for="button in organizationButtons">
        <MenuSelector 
          :btn-text="button.btnText"
          :icon-u-r-l="button.iconURL"
          :btnURL="button.btnURL"
          :active="button.active"
        ></MenuSelector>
      </li>
      <li v-if="menuType === 'event'" v-for="button in eventButtons">
        <MenuSelector 
          :btn-text="button.btnText"
          :icon-u-r-l="button.iconURL"
          :btnURL="button.btnURL"
          :active="button.active"
        ></MenuSelector>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface MenuSelectorType {
  btnText: string
  btnURL: string;
  iconURL?: string;
  active: boolean;
}

const organizationButtons: MenuSelectorType[] = [
  {
    btnText: "sidebar.about",
    btnURL: "/",
    iconURL: "bi:card-text",
    active: true,
  },
  {
    btnText: "sidebar.events",
    btnURL: "/",
    iconURL: "bi:calendar-check",
    active: true,
  },
  {
    btnText: "sidebar.groups",
    btnURL: "/",
    iconURL: "bi:collection",
    active: true,
  },
  {
    btnText: "sidebar.resources",
    btnURL: "/",
    iconURL: "bi:megaphone",
    active: true,
  },
  {
    btnText: "sidebar.faq",
    btnURL: "/",
    iconURL: "bi:chat-left",
    active: true,
  },
  {
    btnText: "sidebar.settings",
    btnURL: "/",
    iconURL: "bi:gear",
    active: true,
  },
  {
    btnText: "sidebar.affiliates",
    btnURL: "/",
    iconURL: "bi:emoji-smile",
    active: false,
  },
  {
    btnText: "sidebar.tasks",
    btnURL: "/",
    iconURL: "bi:check-square",
    active: false,
  },
  {
    btnText: "sidebar.discussions",
    btnURL: "/",
    iconURL: "bi:chat-left-dots",
    active: false,
  },
]

const eventButtons: MenuSelectorType[] = [
  {
    btnText: "sidebar.about",
    btnURL: "/",
    iconURL: "string",
    active: true,
  },
  {
    btnText: "sidebar.team",
    btnURL: "/",
    iconURL: "string",
    active: true,
  },
  {
    btnText: "sidebar.resources",
    btnURL: "/",
    iconURL: "string",
    active: true,
  },
  {
    btnText: "sidebar.settings",
    btnURL: "/",
    iconURL: "string",
    active: true,
  },
  {
    btnText: "sidebar.task",
    btnURL: "/",
    iconURL: "string",
    active: false,
  },
  {
    btnText: "sidebar.discussion",
    btnURL: "/",
    iconURL: "string",
    active: false,
  },
]

defineProps<{
  name?: string;
  menuType?: "organization" | "event";
  logoUrl?: string;
}>();
</script>
