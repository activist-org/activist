<template>
  <div>
    <NuxtLink
      @click="handleItemClick"
      class="focus-brand flex rounded-md"
      :to="localePath(`/${configObject.path}`)"
    >
      <div
        class="group relative flex w-full items-center space-x-2 rounded-md px-2 py-1 hover:bg-light-highlight hover:dark:bg-dark-highlight"
      >
        <Icon
          :name="IconMap[configObject.iconName as keyof typeof IconMap]"
          size="1em"
          :alt="$t(`_global.${configObject.displayName}`)"
        />
        <div>
          {{ $t(`_global.${configObject.displayName}`) }}
          <span
            class="link-text invisible absolute right-3 w-16 group-hover:visible"
          >
            {{ $t("components.modal-command-palette.jump-to") }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();

const props = defineProps<{
  itemType:
    | "home"
    | "upcoming-events"
    | "notifications"
    | "discussions"
    | "organizations"
    | "resources"
    | "events";
}>();

const emit = defineEmits(["itemClicked"]);
const handleItemClick = () => {
  emit("itemClicked");
};

const configObject = {
  path: "",
  iconName: "",
  displayName: "",
};

switch (props.itemType) {
  case "discussions":
    configObject.path = "discussions";
    configObject.iconName = "DISCUSSION";
    configObject.displayName = "discussions";
    break;
  case "events":
    configObject.path = "events";
    configObject.iconName = "EVENT";
    configObject.displayName = "events_lower";
    break;
  case "notifications":
    configObject.path = "notifications";
    configObject.iconName = "BELL";
    configObject.displayName = "notifications";
    break;
  case "organizations":
    configObject.path = "organizations";
    configObject.iconName = "ORGANIZATION";
    configObject.displayName = "organization-name";
    break;
  case "resources":
    configObject.path = "resources";
    configObject.iconName = "RESOURCE";
    configObject.displayName = "resources_lower";
    break;
  case "upcoming-events":
    configObject.path = "upcoming-events";
    configObject.iconName = "EVENT";
    configObject.displayName = "upcoming-events";
    break;
  default:
    configObject.path = "home";
    configObject.iconName = "HOME";
    configObject.displayName = "home";
    break;
}
</script>
