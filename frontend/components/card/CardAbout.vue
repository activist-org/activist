  <template>
  <div class="px-6 py-5 card-style">
    <div class="relative flex-col w-full gap-5">
      <div
        class="absolute right-0 flex items-center justify-center w-10 h-10 border-2 rounded-md bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div sm:w-16 sm:h-16 text-light-text dark:text-dark-text"
      >
        <Icon name="bi:qr-code-scan" size="3em" alt="QR code scanning icon" />
      </div>
      <div class="flex-col space-y-3">
        <div class="flex items-center gap-5">
          <h3 class="text-left responsive-h3 font-display">{{ $t("components.card.card-about.title") }}</h3>
          <Icon name="bi:pencil-square" size="1.2em" />
        </div>
        <div v-if="event" class="flex-col space-y-3">
          <TopicMarker :topic="event.topic" class="" />
          <div class="flex items-center gap-3">
            <div
              class="flex items-center justify-center w-6 h-6 rounded-md fill-light-text dark:fill-dark-text"
            >
              <Icon name="IconOrganization" size="1.75em" />
            </div>
            <p class="font-semibold">{{ event.organizer }}</p>
          </div>
          <div class="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>{{ event.inPersonLocation }}</p>
            </div>
            <div class="flex items-center gap-3">
              <Icon name="bi:calendar-plus" size="1.2em" />
              <p>{{ event.date }}</p>
            </div>
          </div>
          <div>
            <p class="line-clamp-2">{{ event.description }}</p>
            <button
              class="mt-2 font-semibold text-light-link-text dark:text-dark-link-text"
            >
              {{ $t("components.card.card-about.full-text") }}
            </button>
          </div>
        </div>
        <div v-if="organization">
          <div class="flex flex-col mb-3 gap-5 sm:items-center sm:flex-row">
            <TopicMarker :topic="organization.topic" class="" />
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>{{ organization.location }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="bi:people" size="1.2em" />
              <p>{{ organization.members }}</p>
            </div>
          </div>
          <div>
            <p class="line-clamp-3">{{ organization.description }}</p>
            <button
              class="mt-2 font-semibold text-light-link-text dark:text-dark-link-text"
            >
              Click for full text
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~~/types/event";
import type { Organization } from "~~/types/organization";

defineProps<{
  aboutType: "organization" | "event";
  organization?: Organization;
  event?: Event;
}>();
</script>
