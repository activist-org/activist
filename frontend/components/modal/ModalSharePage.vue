<template>
    <ModalBase>
        <template #modalDisplay>
            <DialogTitle class="font-display flex justify-between">
                <p class="text-3xl md:responsive-h2 font-bold">
                    {{ $t("Share this page") }}
                </p>
            </DialogTitle>
            <div
                class="flex flex-col items-center md:grid md:grid-cols-2 md:grid-rows-1 pb-6 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-14 lg:pr-8">
                <div class="items-center space-y-4 text-left col-span-2 pt-2 font-medium">
                    <s-telegram
                        @popup-close="onClose"
                        @popup-open="onOpen"
                        @popup-block="onBlock"
                        @popup-focus="onFocus"
                        :window-features="windowFeatures"
                        :share-options="shareOptions"
                        :use-native-behavior="useNativeBehavior"
                        :native-behavior-options="nativeBehaviorOptions"
                    >
                        <!-- icon component -->
                    </s-telegram>
                </div>
            </div>
        </template>
    </ModalBase>
</template>

<script setup lang="ts">
import { STelegram } from 'vue-socials';
const windowFeatures = {};
const shareOptions = {
    url: 'https://github.com/',
    text: 'Text',
};

const useNativeBehavior = false;

const nativeBehaviorOptions = {
     onClose: () => {},
      onOpen: () => {},
      onBlock: () => {},
      onFocus: () => {},
    };
</script>

<script>
export default {
  name: 'STelegramSharing',
  components: { STelegram },
}
</script>