<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
  >
    <div class="relative flex w-full flex-col md:flex-row">
      <div class="flex w-full justify-center md:w-fit">
        <NuxtLink
          v-if="organization || group || event || user"
          :to="localePath(linkUrl)"
          :aria-label="$t(ariaLabel)"
        >
          <div
            v-if="organization || group || event"
            class="h-min w-max rounded-md border border-section-div bg-layer-0"
          >
            <img
              v-if="organization && imageUrl"
              class="rounded-md"
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              :src="imageUrl"
              :alt="
                $t(
                  'i18n.components.card_search_result.organization_img_alt_text'
                ) +
                ' ' +
                organization.name
              "
            />
            <img
              v-if="group && imageUrl"
              class="rounded-md"
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              :src="imageUrl"
              :alt="
                $t('i18n.components.card_search_result.group_img_alt_text') +
                ' ' +
                group.name
              "
            />
            <div
              v-else-if="(organization || group) && !imageUrl"
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center text-primary-text"
            >
              <Icon :name="IconMap.ORGANIZATION" class="h-[75%] w-[75%]" />
            </div>
            <div
              v-else-if="event"
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center"
            >
              <ImageEvent
                v-if="event && eventType"
                :eventType="eventType"
                :imgUrl="imageUrl"
                :alt="
                  $t('i18n.components.card_search_result.event_img_alt_text', {
                    entity_name: name,
                  })
                "
              />
            </div>
          </div>
          <div
            v-if="user && !imageUrl"
            class="w-fit rounded-full border border-section-div bg-layer-0"
          >
            <div
              v-if="!imageUrl"
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center fill-primary-text"
            >
              <Icon class="h-[75%] w-[75%]" :name="IconMap.PERSON" />
            </div>
          </div>
        </NuxtLink>
        <a
          v-else-if="resource"
          :href="linkUrl"
          target="_blank"
          :aria-label="$t(ariaLabel)"
        >
          <div class="h-min rounded-md border border-section-div bg-layer-0">
            <div
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center fill-primary-text"
            >
              <Icon :name="IconMap.RESOURCE" class="h-[75%] w-[75%]" />
            </div>
          </div>
        </a>
      </div>
      <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
        <div class="-mb-2 flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <NuxtLink
              v-if="organization || group || event || user"
              :to="localePath(linkUrl)"
              :aria-label="$t(ariaLabel)"
            >
              <h3 class="font-bold">
                {{ name }}
              </h3>
            </NuxtLink>
            <a
              v-else-if="resource"
              :href="linkUrl"
              target="_blank"
              :aria-label="$t(ariaLabel)"
            >
              <h3 class="font-bold">
                {{ name }}
              </h3>
            </a>
            <MenuSearchResult
              v-if="organization"
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :organization="organization"
            />
            <MenuSearchResult
              v-if="group"
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :group="group"
            />
            <MenuSearchResult
              v-if="event"
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :event="event"
            />
            <MenuSearchResult
              v-if="resource"
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :resource="resource"
            />
            <MenuSearchResult
              v-if="user"
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :user="user"
            />
          </div>
          <div
            v-if="aboveMediumBP"
            class="flex items-center space-x-3 lg:space-x-5"
          >
            <MetaTagLocation v-if="location" :location="location" />
            <MetaTagVideo
              v-else-if="onlineLocation"
              :link="onlineLocation"
              label="i18n.components.card_search_result.view_video"
            />
            <MetaTagDate v-if="event && event.id != ''" :date="date" />
          </div>
        </div>
        <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
          <div
            v-if="!aboveMediumBP"
            class="flex items-center justify-center space-x-4"
          >
            <MetaTagLocation v-if="location" :location="location" />
            <MetaTagVideo
              v-if="onlineLocation"
              :link="onlineLocation"
              label="i18n.components.card_search_result.view_video"
            />
            <MetaTagDate v-if="event && event.id != ''" :date="date" />
          </div>
          <div
            class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
          >
            <MetaTagOrganization
              v-if="!isReduced"
              v-for="(o, i) in organizations"
              :key="i"
              class="pt-2"
              :organization="o"
            />
            <!-- <MetaTagMembers
              :members="members"
              label="i18n.components.card_search_result.members"
            />
            <MetaTagSupporters
              :supporters="supporters"
              label="i18n.components.card_search_result.supporters_lower"
            />
            <MetaTagStars
              :stars="stars"
              label="i18n.components.card_search_result.label"
            /> -->
          </div>
        </div>
        <!-- <div v-if="!isReduced" class="flex justify-center md:justify-start">
          <ShieldTopic v-for="(t, i) in topics" :key="i" :topic="t" />
        </div> -->
        <NuxtLink
          v-if="entityName"
          :to="localePath(linkUrl)"
          class="text-distinct-text hover:text-primary-text"
          :aria-label="$t(ariaLabel)"
        >
          @{{ entityName }}
        </NuxtLink>
        <p
          class="justify-center md:justify-start md:px-0 md:py-0"
          :class="{
            'line-clamp-3': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced,
          }"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/auth/user";
import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { Resource } from "~/types/content/resource";
import type { Event } from "~/types/events/event";

import { useLinkURL } from "~/composables/useLinkURL";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
  isReduced?: boolean;
  isPrivate?: boolean;
}>();

const aboveMediumBP = useBreakpoint("md");

const i18n = useI18n();
const localePath = useLocalePath();
const { linkUrl } = useLinkURL(props);

const ariaLabel = computed<string>(() => {
  if (props.organization) {
    return i18n.t(
      "i18n.components._global.navigate_to_organization_aria_label"
    );
  } else if (props.group) {
    return i18n.t("i18n.components._global.navigate_to_group_aria_label");
  } else if (props.event) {
    return i18n.t(
      "i18n.components.card_search_result.navigate_to_event_aria_label"
    );
  } else if (props.resource) {
    return i18n.t(
      "i18n.components.card_search_result.navigate_to_resource_aria_label"
    );
  } else if (props.user) {
    return i18n.t(
      "i18n.components.card_search_result.navigate_to_user_aria_label"
    );
  } else {
    return "";
  }
});

const date = computed<string>(() => {
  if (props.event && props.event.startTime) {
    return props.event.startTime.split("T")[0];
  } else if (props.resource && props.resource.creationDate) {
    return props.resource.creationDate.split("T")[0];
  } else {
    return "";
  }
});

const description = computed<string>(() => {
  if (props.organization && props.organization.texts.description) {
    return props.organization.texts.description;
  } else if (props.group && props.group.texts.description) {
    return props.group.texts.description;
  } else if (props.event && props.event.texts.description) {
    return props.event.texts.description;
  } else if (props.resource && props.resource.description) {
    return props.resource.description;
  } else if (props.user && props.user.description) {
    return props.user.description;
  } else {
    return "";
  }
});

const eventType = computed<"action" | "learn">(() => {
  if (props.event) {
    return props.event.type;
  } else {
    return "learn";
  }
});

// Organization icon URL does not need to be prefixed with the backend URL.
// However, event icon URL does.
// This is because orgs use regular img tags and events use the ImageEvent component.
// It looks like ImageEvent is better at displaying images.
const imageUrl = computed<string>(() => {
  if (props.organization && props.organization.iconUrl?.fileObject) {
    return `${props.organization.iconUrl.fileObject}`;
  } else if (props.group && props.group.iconUrl?.fileObject) {
    return props.group.iconUrl.fileObject;
  } else if (props.event && props.event.iconUrl?.fileObject) {
    return `${BASE_BACKEND_URL_NO_V1}${props.event.iconUrl.fileObject}`;
  } else if (props.user && props.user.iconUrl?.fileObject) {
    return props.user.iconUrl.fileObject;
  } else {
    return "";
  }
});

const location = computed<string>(() => {
  if (props.organization && props.organization.location) {
    return props.organization.location.displayName.split(",")[0];
  } else if (props.group && props.group.location) {
    return props.group.location.displayName.split(",")[0];
  } else if (props.event && props.event.offlineLocation) {
    return props.event.offlineLocation.displayName.split(",")[0];
    // } else if (props.resource && props.resource.location) {
    //   return props.resource.location.displayName.split(",")[0];
  } else if (props.user && props.user.location) {
    return props.user.location;
  } else {
    return "";
  }
});

// const members = computed<number>(() => {
//   if (props.organization && props.organization.members) {
//     return props.organization.members.length;
//   } else if (props.group && props.group.members) {
//     return props.group.members.length;
//   } else {
//     return 0;
//   }
// });

const name = computed<string>(() => {
  if (props.organization) {
    return props.organization.name;
  } else if (props.group) {
    return props.group.name;
  } else if (props.event) {
    return props.event.name;
  } else if (props.resource) {
    return props.resource.name;
  } else if (props.user) {
    return props.user.name;
  } else {
    return "";
  }
});

const entityName = computed<string>(() => {
  if (props.organization) {
    return props.organization.orgName;
  } else if (props.group) {
    return props.group.groupName;
  } else {
    return "";
  }
});

const onlineLocation = computed<string>(() => {
  if (props.event && props.event.onlineLocationLink) {
    return props.event.onlineLocationLink;
  } else {
    return "";
  }
});

const organizations = computed<Organization[]>(() => {
  if (props.event) {
    return [props.event.orgs];
  } else if (props.resource) {
    return [props.resource.org];
  } else {
    return [];
  }
});

// const stars = computed<number>(() => {
//   if (props.resource && props.resource.starers) {
//     return props.resource.starers.length;
//   } else {
//     return "";
//   }
// });

// const supporters = computed<number>(() => {
//   if (props.organization && props.organization.supporters) {
//     return props.organization.supporters.length;
//   } else if (props.group && props.group.supporters) {
//     return props.group.supporters.length;
//   } else if (props.event && props.event.supporters) {
//     return props.event.supporters.length;
//   } else if (props.user && props.user.supporters) {
//     return props.user.supporters.length;
//   } else {
//     return 0;
//   }
// });

// const topics = computed<string[]>(() => {
//   if (props.organization) {
//     return props.organization.topics;
//   } else if (props.group) {
//     return props.group.topics;
//   } else if (props.event) {
//     return props.event.topics;
//   } else if (props.resource && props.resource.topics) {
//     return props.resource.topics;
//   } else if (props.user && props.user.topics) {
//     return props.user.topics;
//   } else {
//     return [""];
//   }
// });
</script>
