<template>
    <ModalBase>
        <template #normalDisplay>
            <BtnAction 
                @click="openShareModal" 
                class="hidden md:block w-max" 
                :cta="true"
                label="components.btn-action.share-event" 
                fontSize="sm" 
                leftIcon="bi:box-arrow-up" 
                iconSize="1.25em"
                ariaLabel="components.btn-action.share-event-aria-label" />
        </template>
        <template #modalDisplay>
            <DialogTitle class="font-display flex justify-between">
                <p class="text-3xl md:responsive-h2 font-bold">
                    {{ $t("components.modal-share.header") }}
                </p>
            </DialogTitle>
            <div
                class="flex flex-col items-center md:grid md:grid-cols-2 md:grid-rows-1 pb-6 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-14 lg:pr-8">
                <div class="items-center space-y-4 text-left col-span-2 pt-2 font-medium">
                    <s-telegram @popup-close="onClose" @popup-open="onOpen" @popup-block="onBlock" @popup-focus="onFocus"
                        :window-features="windowFeatures" :share-options="shareOptions"
                        :use-native-behavior="useNativeBehavior" :native-behavior-options="nativeBehaviorOptions">
                        <!-- icon component -->
                    </s-telegram>
                </div>
            </div>
        </template>
    </ModalBase>
</template>

<script setup lang="ts">
import type { BtnAction } from "~/types/btn-props";
import ModalBase from "~/components/modal/ModalBase.vue";
import { STelegram } from 'vue-socials';
console.log("hello");

// defineProps<{
// cta: BtnAction["cta"];
// label: BtnAction["label"];
// ariaLabel: BtnAction["ariaLabel"];
// }>();

const isOpen = ref(false);

const openShareModal = () => {
    isOpen.value = true;
};

const closeShareModal = () => {
    isOpen.value = false;
}

const windowFeatures = {};
const shareOptions = {
    url: 'https://github.com/',
    text: 'Text',
};

const useNativeBehavior = false;

const nativeBehaviorOptions = {
    onClose: () => { },
    onOpen: () => { },
    onBlock: () => { },
    onFocus: () => { },
};
</script>

<!-- <script> -->
export default {
  name: 'STelegramSharing',
  components: { STelegram },
}
<!-- </script> -->