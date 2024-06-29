<!-- TODO: needs to handle focus / tab-to events, get rid of focus ring. -->
<template>
  <div>
    <NuxtLink
      @click="handleItemClick"
      class="flex rounded-md"
      :to="localePath(`/${configObject.path}`)"
    >
      <div
        class="group relative flex w-full items-center space-x-2 rounded-md px-2 py-1 hover:bg-light-highlight hover:dark:bg-dark-highlight"
      >
        <Icon
          :name="IconMap[configObject.iconName as keyof typeof IconMap]"
          size="1em"
          :alt="$t(`${configObject.displayName}`)"
        />
        <div>
          {{ $t(`${configObject.displayName}`) }}
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
    configObject.displayName = "_global.discussions";
    break;
  case "events":
    configObject.path = "events";
    configObject.iconName = "EVENT";
    configObject.displayName = "_global.events_lower";
    break;
  case "notifications":
    configObject.path = "notifications";
    configObject.iconName = "BELL";
    configObject.displayName = "_global.notifications";
    break;
  case "organizations":
    configObject.path = "organizations";
    configObject.iconName = "ORGANIZATION";
    configObject.displayName = "_global.organization-name";
    break;
  case "resources":
    configObject.path = "resources";
    configObject.iconName = "RESOURCE";
    configObject.displayName = "_global.resources_lower";
    break;
  case "upcoming-events":
    configObject.path = "upcoming-events";
    configObject.iconName = "EVENT";
    configObject.displayName = "_global.upcoming-events";
    break;
  default:
    configObject.path = "home";
    configObject.iconName = "HOME";
    configObject.displayName = "_global.home";
    break;
}
</script>
