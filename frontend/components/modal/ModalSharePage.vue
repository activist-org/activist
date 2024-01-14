<!-- Brief note to self: Refactor code to minimize duplication/redundancy. Add CSS styling to align with Figma design. Add support for the export default names and components. Confirm verbiage we'd like to use in the various share options i.e body of messages i.e email, sms, etc-->
<template>
    <ModalBase>
        <template #normalDisplay>
            <BtnAction @click="openShareModal" class="hidden md:block w-max" :cta="true"
                label="components.btn-action.share-event" fontSize="sm" leftIcon="bi:box-arrow-up" iconSize="1.25em"
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
                    <div class="flex space-x-2 lg:space-x-3">
                        <s-telegram @popup-close="onClose" @popup-open="onOpen" @popup-block="onBlock"
                            @popup-focus="onFocus" :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior" :native-behavior-options="nativeBehaviorOptions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M16 .5C7.437.5.5 7.438.5 16S7.438 31.5 16 31.5c8.563 0 15.5-6.938 15.5-15.5S24.562.5 16 .5m7.613 10.619l-2.544 11.988c-.188.85-.694 1.056-1.4.656l-3.875-2.856l-1.869 1.8c-.206.206-.381.381-.781.381l.275-3.944l7.181-6.488c.313-.275-.069-.431-.482-.156l-8.875 5.587l-3.825-1.194c-.831-.262-.85-.831.175-1.231l14.944-5.763c.694-.25 1.3.169 1.075 1.219z" />
                            </svg>
                        </s-telegram>
                        <s-twitter @popup-close="onClose" @popup-open="onOpen" @popup-block="onBlock" @popup-focus="onFocus"
                            :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior">
                            <!-- your icon component -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M31.937 6.093a13.359 13.359 0 0 1-3.765 1.032a6.603 6.603 0 0 0 2.885-3.631a13.683 13.683 0 0 1-4.172 1.579a6.56 6.56 0 0 0-11.178 5.973c-5.453-.255-10.287-2.875-13.52-6.833a6.458 6.458 0 0 0-.891 3.303a6.555 6.555 0 0 0 2.916 5.457a6.518 6.518 0 0 1-2.968-.817v.079a6.567 6.567 0 0 0 5.26 6.437a6.758 6.758 0 0 1-1.724.229c-.421 0-.823-.041-1.224-.115a6.59 6.59 0 0 0 6.14 4.557a13.169 13.169 0 0 1-8.135 2.801a13.01 13.01 0 0 1-1.563-.088a18.656 18.656 0 0 0 10.079 2.948c12.067 0 18.661-9.995 18.661-18.651c0-.276 0-.557-.021-.839a13.132 13.132 0 0 0 3.281-3.396z" />
                            </svg>
                        </s-twitter>
                        <s-email :share-options="shareOptions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M32 6v20c0 1.135-.865 2-2 2h-2V9.849l-12 8.62l-12-8.62V28H2c-1.135 0-2-.865-2-2V6c0-.568.214-1.068.573-1.422A1.973 1.973 0 0 1 2 4h.667L16 13.667L29.333 4H30c.568 0 1.068.214 1.427.578c.359.354.573.854.573 1.422" />
                            </svg>
                        </s-email>
                        <Icon name="bi:qr-code-scan" size="2em" :alt="$t('components.modal-qr-code.img-alt-text')" />
                    </div>
                    <div class="flex space-x-2 lg:space-x-3">
                        <s-mastodon :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                            @popup-block="onBlock" @popup-focus="onFocus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M30.921 10.505c0-6.943-4.547-8.975-4.547-8.975C24.082.473 20.145.03 16.051-.001h-.099C11.863.03 7.925.472 5.635 1.53c0 0-4.553 2.032-4.553 8.975c0 1.588-.031 3.489.021 5.505c.167 6.792 1.245 13.479 7.521 15.14c2.896.767 5.38.928 7.38.819c3.631-.204 5.667-1.297 5.667-1.297l-.12-2.636s-2.593.819-5.505.719c-2.885-.099-5.932-.307-6.396-3.853a7.018 7.018 0 0 1-.067-.995s2.832.692 6.427.859c2.192.099 4.249-.129 6.344-.38c4.005-.473 7.5-2.948 7.937-5.203c.687-3.552.629-8.677.629-8.677zm-5.364 8.948h-3.328v-8.161c0-1.719-.724-2.595-2.172-2.595c-1.599 0-2.401 1.037-2.401 3.084v4.469h-3.312v-4.469c0-2.047-.803-3.084-2.401-3.084c-1.448 0-2.172.876-2.172 2.595v8.156H6.443v-8.401c0-1.719.437-3.083 1.317-4.093c.907-1.011 2.089-1.532 3.563-1.532c1.704 0 2.995.657 3.849 1.969L16 8.782l.828-1.391c.855-1.312 2.145-1.969 3.849-1.969c1.473 0 2.661.521 3.568 1.532c.875 1.011 1.312 2.375 1.312 4.093z" />
                            </svg>
                        </s-mastodon>
                        <s-facebook-messenger :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                            @popup-block="onBlock" @popup-focus="onFocus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M0 15.521C0 6.599 6.984 0 16 0s16 6.599 16 15.521c0 8.917-6.984 15.521-16 15.521c-1.615 0-3.172-.214-4.625-.615a1.266 1.266 0 0 0-.854.068l-3.188 1.401a1.282 1.282 0 0 1-1.802-1.135l-.094-2.854a1.281 1.281 0 0 0-.422-.906A15.192 15.192 0 0 1-.001 15.522zm11.094-2.922l-4.693 7.469c-.469.703.427 1.521 1.094 1l5.052-3.828a.944.944 0 0 1 1.161 0l3.729 2.802a2.41 2.41 0 0 0 3.469-.641l4.693-7.469c.469-.703-.427-1.505-1.094-1l-5.052 3.828a.923.923 0 0 1-1.146 0l-3.734-2.802a2.398 2.398 0 0 0-3.479.641" />
                            </svg>
                        </s-facebook-messenger>
                        <s-facebook-workplace :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                            @popup-block="onBlock" @popup-focus="onFocus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M32 16c0-8.839-7.167-16-16-16C7.161 0 0 7.161 0 16c0 7.984 5.849 14.604 13.5 15.803V20.626H9.437v-4.625H13.5v-3.527c0-4.009 2.385-6.223 6.041-6.223c1.751 0 3.584.312 3.584.312V10.5h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-.713 4.625H18.5v11.177C26.145 30.603 32 23.983 32 15.999z" />
                            </svg>
                        </s-facebook-workplace>
                        <s-sms :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                            @popup-block="onBlock" @popup-focus="onFocus">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <path fill="currentColor"
                                    d="M16 27.885h12.698c.797 0 1.458-.448 1.458-1v-2.557c-.333.333-.859.542-1.458.542H3.307c-.594 0-1.125-.208-1.464-.542v2.557c0 .547.656 1 1.464 1zm0 1.938h13.922c1.146 0 2.078-.688 2.078-1.526c0-.068-.01-.135-.021-.198L29.838 5.417c-.068-.531-.474-.953-.927-1.125l1.62 19.203v3.391c0 .76-.818 1.38-1.839 1.38H3.307c-1.01 0-1.839-.625-1.839-1.38v-3.391l1.62-19.203c-.453.177-.859.599-.927 1.125L.02 28.089a.848.848 0 0 0-.021.203c0 .839.927 1.531 2.073 1.531zm12.51-25.87l-.036-.422c0-.026 0-.047-.005-.078l-.01-.094c-.083-.672-.635-1.188-1.443-1.188H4.98c-.802 0-1.354.51-1.438 1.182l-.005.099l-.005.078l-.042.422l-1.635 19.547c0 .547.651 1 1.453 1h25.396c.802 0 1.453-.453 1.458-1zm-7.583 12.406c-.354.932-1.167 1.599-2.057 2c-.969.448-2.047.62-3.109.635a13.708 13.708 0 0 1-3.354-.359c-.557-.125-1.13-.276-1.656-.505c-.474-.208-.859-.677-.849-1.208c.01-.536.396-.99.891-1.182c.516-.208 1.01-.12 1.516.057a9.57 9.57 0 0 0 3.495.51c.672-.021 1.849-.38 1.661-1.422c-.042-.234-.224-.557-.458-.776c-.188-.182-.573-.359-.823-.427c-.552-.151-1.12-.26-1.677-.385c-1.13-.245-1.729-.432-2.729-1.042c-.88-.521-1.073-.859-1.208-1.651c-.177-1.031.328-1.854 1.161-2.479c1.859-1.411 3.641-1.365 5.839-.964c.542.104 1.188.193 1.661.479c.464.281.729.849.526 1.38c-.188.5-.667.573-1.182.521c-.552-.063-.781-.208-1.302-.307c-1.099-.198-1.5-.365-2.557-.068c-.417.12-.984.521-.771 1.042c.177.438.839.578 1.234.682c1.083.292 1.932.625 3.01.943c1.01.292 1.776.854 2.406 1.745c.563.792.682 1.885.344 2.792z" />
                            </svg>
                        </s-sms>
                    </div>
                </div>
            </div>
        </template>
    </ModalBase>
</template>

<script setup lang="ts">
import type { BtnAction } from "~/types/btn-props";
import ModalBase from "~/components/modal/ModalBase.vue";
import { STelegram, STwitter, SEmail, SMastodon, SFacebookMessenger, SFacebookWorkplace, SSms } from 'vue-socials';
console.log("hello");

const isOpen = ref(false);

const openShareModal = () => {
    isOpen.value = true;
};

const closeShareModal = () => {
    isOpen.value = false;
}

const windowFeatures = {};
const shareOptions = {
    url: 'https://activist.org/',
    text: '',
    hashtags: ['activist', 'activism'],
    via: 'twitterdev', // replace with Activist's twitter handle
    mail: 'google@gmail.com',
    cc: [''],
    bcc: [''],
    subject: 'Share this site!',
    body: 'Check out this site! https://activist.org/',
    domain: 'https://mas.to',
    redirectUri: 'https://www.domain.com/',
    appId: 123456789,
    to: undefined,
    number: '+1(999)999-99-99',
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
<!-- export default { -->
  <!-- name: 'STelegramSharing', -->
  <!-- components: { STelegram }, -->
  <!-- name: 'STwitterSharing', -->
  <!-- components: { STwitter }, -->
  <!-- name: 'SEmailSharing', -->
  <!-- components: { SEmail }, -->
  <!-- name: 'SMastodonSharing', -->
  <!-- components: { SMastodon }, -->
  <!-- name: 'SFacebookMessengerSharing', -->
  <!-- components: { SFacebookMessenger }, -->
  <!-- name: 'SFacebookWorkplaceSharing', -->
  <!-- components: { SFacebookWorkplace }, -->
  <!-- name: 'SSmsSharing', -->
  <!-- components: { SSms }, -->
<!-- } -->
<!-- </script> -->