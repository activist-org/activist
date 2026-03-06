<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardAbout>
    <ModalQRCodeBtn
      v-if="group && !expandText"
      :group="group"
      reason-for-suggesting=""
      type="icon"
    />
    <button
      v-if="expandText"
      @click="
        emit('expand-reduce-text');
        expand_reduce_text();
      "
      class="absolute right-0 rounded-full p-1 text-distinct-text focus-brand hover:text-primary-text"
      data-testid="collapse-text-icon-button"
    >
      <Icon class="h-10 w-10" :name="IconMap.CIRCLE_X_FILL" />
    </button>
    <div class="flex-col space-y-3">
      <div class="flex items-center gap-5">
        <h3 class="text-left font-display">
          {{ $t("i18n._global.about") }}
        </h3>
        <IconEdit
          v-if="userIsSignedIn"
          @click="openModalTextGroup"
          @keydown.enter="openModalTextGroup"
          data-testid="icon-edit"
        />
      </div>
      <div class="flex-col space-y-3">
        <!-- <div class="flex items-center gap-3">
            <ShieldTopic v-for="(t, i) in group.topics" :key="i" :topic="t" />
          </div> -->
        <div class="flex items-center gap-3">
          <MetaTagLocation
            v-if="group?.location"
            :location="group.location.addressOrName.split(',')[0] ?? ''"
          />
          <!-- <MetaTagMembers
              :members="group.members.length"
              :label="$t('i18n.components.card.about._global.members_lower')"
            /> -->
        </div>
        <div>
          <p
            ref="description"
            :class="{
              'line-clamp-5': !expandText,
            }"
          >
            {{ group?.texts[0]?.description }}
          </p>
          <div class="flex justify-center">
            <button
              v-if="!expandText && descriptionExpandable"
              @click="
                emit('expand-reduce-text');
                expand_reduce_text();
              "
              :aria-label="
                $t('i18n.components.card.about._global.full_text_aria_label')
              "
              class="mt-1 font-semibold text-link-text focus-brand"
              data-testid="expand-text-button"
            >
              {{ $t("i18n.components.card.about._global.full_text") }}
            </button>
            <button
              v-else-if="descriptionExpandable"
              @click="
                emit('expand-reduce-text');
                expand_reduce_text();
              "
              :aria-label="
                $t('i18n.components.card.about._global.reduce_text_aria_label')
              "
              class="mt-1 font-semibold text-link-text focus-brand"
              data-testid="collapse-text-button"
            >
              {{ $t("i18n.components.card.about._global.reduce_text") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </CardAbout>
</template>

<script setup lang="ts">
const { openModal: openModalTextGroup } = useModalHandlers("ModalTextGroup");

const { userIsSignedIn } = useUser();

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);

const description = ref();
const descriptionExpandable = ref(false);

function setDescriptionExpandable(): void {
  descriptionExpandable.value =
    description.value.scrollHeight > description.value.clientHeight
      ? true
      : false;
}

onMounted(() => {
  window.addEventListener("resize", setDescriptionExpandable);
  setDescriptionExpandable();
});

onUnmounted(() => {
  window.removeEventListener("resize", setDescriptionExpandable);
});

const emit = defineEmits(["expand-reduce-text"]);
const expandText = ref(false);

function expand_reduce_text() {
  expandText.value = !expandText.value;
}
</script>
