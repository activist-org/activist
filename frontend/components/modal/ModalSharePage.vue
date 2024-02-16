<template>
    <ModalBase>
        <template #normalDisplay>
            <BtnAction class="hidden md:block w-max" :cta=props.cta :label=props.label :aria-label=props.ariaLabel
                fontSize="sm" leftIcon="bi:box-arrow-up" iconSize="1.25em" />
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
                            <SocialMediaShareIcon
                                icon-path="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM8.28672 5.90599C7.50861 6.22963 5.95346 6.8995 3.6213 7.91558C3.2426 8.06618 3.04421 8.21351 3.02615 8.35757C2.99563 8.60103 3.30052 8.6969 3.71569 8.82745C3.77216 8.8452 3.83068 8.8636 3.89067 8.8831C4.29913 9.01588 4.84859 9.17121 5.13423 9.17738C5.39334 9.18298 5.68253 9.07616 6.0018 8.85692C8.18081 7.38603 9.30563 6.64258 9.37625 6.62655C9.42607 6.61524 9.49511 6.60102 9.54188 6.6426C9.58866 6.68418 9.58406 6.76291 9.57911 6.78404C9.5489 6.9128 8.35212 8.02543 7.73279 8.60121C7.53971 8.78071 7.40276 8.90804 7.37476 8.93712C7.31204 9.00226 7.24812 9.06388 7.18669 9.1231C6.80722 9.48891 6.52265 9.76324 7.20245 10.2112C7.52913 10.4265 7.79055 10.6045 8.05134 10.7821C8.33616 10.9761 8.62023 11.1695 8.98778 11.4105C9.08142 11.4718 9.17086 11.5356 9.25796 11.5977C9.58942 11.834 9.88721 12.0463 10.2551 12.0124C10.4689 11.9928 10.6897 11.7918 10.8018 11.1923C11.0668 9.77545 11.5878 6.70567 11.7082 5.44069C11.7187 5.32986 11.7055 5.18802 11.6948 5.12576C11.6842 5.06349 11.6619 4.97478 11.581 4.90911C11.4851 4.83133 11.3371 4.81493 11.2709 4.8161C10.9701 4.8214 10.5084 4.98192 8.28672 5.90599Z"
                                fill-color="black" text="Telegram"
                                style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word" />
                        </s-telegram>
                        <s-twitter @popup-close="onClose" @popup-open="onOpen" @popup-block="onBlock" @popup-focus="onFocus"
                            :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior">
                            <SocialMediaShareIcon
                                icon-path="M5.02601 15C11.0636 15 14.3673 9.99705 14.3673 5.66585C14.3673 5.5251 14.3673 5.38435 14.3609 5.2436C15.0012 4.78297 15.5582 4.20079 16 3.54183C15.411 3.80413 14.7771 3.97687 14.1112 4.06004C14.7899 3.65699 15.3085 3.01083 15.5582 2.24311C14.9244 2.62057 14.2201 2.88927 13.471 3.03642C12.8691 2.39665 12.0176 2 11.0764 2C9.26451 2 7.79192 3.47146 7.79192 5.28199C7.79192 5.53789 7.82393 5.7874 7.87515 6.03051C5.14766 5.89616 2.72749 4.58465 1.10764 2.60138C0.825931 3.0876 0.665866 3.65059 0.665866 4.25197C0.665866 5.39075 1.2485 6.39518 2.12565 6.98376C1.58784 6.96457 1.08203 6.81742 0.640256 6.57431C0.640256 6.58711 0.640256 6.5999 0.640256 6.61909C0.640256 8.20571 1.77351 9.53642 3.27171 9.83711C2.9964 9.91388 2.70828 9.95226 2.40736 9.95226C2.19608 9.95226 1.9912 9.93307 1.79272 9.89469C2.20888 11.1998 3.42537 12.1467 4.85954 12.1722C3.73269 13.0551 2.31773 13.5797 0.781113 13.5797C0.518608 13.5797 0.256102 13.5669 0 13.5349C1.44698 14.4562 3.17567 15 5.02601 15Z"
                                fill-color=" black" text="@activist_org"
                                style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word" />
                        </s-twitter>
                        <s-email :share-options="shareOptions">
                            <SocialMediaShareIcon
                                icon-path="M0 4C0 2.89543 0.895431 2 2 2H14C15.1046 2 16 2.89543 16 4V12C16 13.1046 15.1046 14 14 14H2C0.895431 14 0 13.1046 0 12V4ZM2 3C1.44772 3 1 3.44772 1 4V4.2169L8 8.4169L15 4.2169V4C15 3.44772 14.5523 3 14 3H2ZM15 5.3831L10.2919 8.20794L15 11.1052V5.3831ZM14.9662 12.2586L9.32583 8.7876L8 9.5831L6.67417 8.7876L1.03376 12.2586C1.14774 12.6855 1.53715 13 2 13H14C14.4628 13 14.8523 12.6855 14.9662 12.2586ZM1 11.1052L5.70808 8.20794L1 5.3831V11.1052Z"
                                fill-color=" black" text="Email"
                                style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word" />
                        </s-email>
                        <ModalBase>
                            <template #normalDisplay>
                                <div
                                    style="width: 100%; height: 100%; justify-content: flex-start; align-items: center; gap: 12px; display: inline-flex">
                                    <div style="width: 28px; height: 28px; position: relative">
                                        <Icon name="bi:qr-code-scan" size="2em"
                                            :alt="$t('components.modal-qr-code.img-alt-text')" />
                                    </div>
                                    <div class="flex space-x-2 lg:space-x-3">
                                        View QR code
                                    </div>
                                </div>
                            </template>
                            <template #modalDisplay>
                                <ModalQRCode v-if=props.organization :entityName=props?.organization?.name />
                                <ModalQRCode v-if=props.event :entityName=props?.event?.name />
                            </template>
                        </ModalBase>
                    </div>
                    <div class="flex space-x-2 lg:space-x-3">
                        <s-mastodon :window-features="windowFeatures" :share-options="shareOptions"
                            :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                            @popup-block="onBlock" @popup-focus="onFocus">
                            <SocialMediaShareIcon
                                icon-path="M11.1909 12.1951C13.2058 11.9557 14.9602 10.7205 15.1807 9.59184C15.5281 7.81389 15.4994 5.25305 15.4994 5.25305C15.4994 1.78217 13.2139 0.764795 13.2139 0.764795C12.0615 0.23818 10.0826 0.0167234 8.02678 0H7.97627C5.92041 0.0167234 3.94286 0.23818 2.79039 0.764795C2.79039 0.764795 0.504754 1.78217 0.504754 5.25305C0.504754 5.46347 0.503661 5.68479 0.502523 5.91519C0.499363 6.55506 0.495857 7.26496 0.514458 8.00596C0.597458 11.4003 1.13991 14.7456 4.2941 15.5762C5.74843 15.9592 6.99707 16.0394 8.0027 15.9844C9.82637 15.8838 10.8501 15.3369 10.8501 15.3369L10.79 14.0204C10.79 14.0204 9.48674 14.4292 8.02314 14.3794C6.57306 14.3299 5.04223 14.2238 4.8077 12.4524C4.78604 12.2968 4.77521 12.1304 4.77521 11.9557C4.77521 11.9557 6.19869 12.3019 8.0027 12.3841C9.10579 12.4345 10.1403 12.3198 11.
                        1909 12.1951ZM12.8034 9.72502H11.13V5.64588C11.13 4.786 10.7664 4.34955 10.039 4.34955C9.23486 4.34955 8.83182 4.86729 8.83182 5.89104V8.12379H7.16825V5.89104C7.16825 4.86729 6.76512 4.34955 5.96093 4.34955C5.2336 4.34955 4.86997 4.786 4.86997 5.64588V9.72502H3.19653V5.52235C3.19653 4.66342 3.41634 3.98086 3.85785 3.47588C4.31314 2.9709 4.90939 2.71204 5.64955 2.71204C6.5059 2.71204 7.15439 3.03952 7.58317 3.69458L7.99999 4.38981L8.4169 3.69458C8.84559 3.03952 9.49409 2.71204 10.3505 2.71204C11.0906 2.71204 11.6868 2.9709 12.1422 3.47588C12.5836 3.98086 12.8034 4.66342 12.8034 5.52235V9.72502Z"
                                fill-color="black" text="Mastodon"
                                style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word" />
                        </s-mastodon>
                        <!-- <s-facebook-messenger :window-features="windowFeatures" :share-options="shareOptions" -->
                        <!-- :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen" -->
                        <!-- @popup-block="onBlock" @popup-focus="onFocus"> -->
                        <!-- <SocialMediaShareIcon -->
                        <!-- icon-path="M0 7.76C0 3.30112 3.49336 0 8 0C12.5066 0 16 3.30112 16 7.76C16 12.2189 12.5066 15.52 8 15.52C7.19053 15.52 6.41392 15.4131 5.68424 15.2125C5.5424 15.1734 5.39157 15.1845 5.25696 15.2438L3.66907 15.9448C3.25371 16.1282 2.78485 15.8328 2.77093 15.3789L2.72736 13.9558C2.722 13.7805 2.64312 13.6166 2.51245 13.4997C0.95584 12.1076 0 10.0923 0 7.76ZM5.54604 6.3011L3.19604 10.0294C2.97052 10.3872 3.41033 10.7904 3.74724 10.5348L6.27153 8.61899C6.44228 8.48939 6.67825 8.4887 6.84972 8.61731L8.71884 10.0192C9.27969 10.4398 10.0802 10.2921 10.454 9.69902L12.804 5.97067C13.0295 5.61286 12.5897 5.20966 12.2528 5.46534L9.72849 7.3811C9.55772 7.5107 9.32177 7.51139 9.15028 7.38275L7.28121 5.98094C6.72033 5.5603 5.91985 5.70798 5.54604 6.3011Z" -->
                        <!-- fill-color="black" text="Messenger" -->
                        <!-- style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word" /> -->
                        <!-- </s-facebook-messenger> -->
                        <!-- <s-facebook :href=getCurrentUrl() @popup-close="onClose" @popup-open="onOpen" @popup-block="onBlock" -->
                        <!-- @popup-focus="onFocus" :window-features="windowFeatures" :share-options="shareOptions" -->
                        <!-- :use-native-behavior="useNativeBehavior" :native-behavior-options="nativeBehaviorOptions"> -->
                        <!-- <SocialMediaShareIcon -->
                        <!-- icon-path="M16 8.0486C16 3.60314 12.418 -0.000610352 7.99949 -0.000610352C3.58095 -0.000610352 -0.000976562 3.60314 -0.000976562 8.0486C-0.000976562 12.0662 2.92468 15.3962 6.74942 16V10.3753H4.71805V8.0486H6.74942V6.27526C6.74942 4.25792 7.94383 3.14361 9.77132 3.14361C10.6466 3.14361 11.5622 3.30082 11.5622 3.30082V5.28168H10.5534C9.55951 5.28168 9.24957 5.90215 9.24957 6.53869V8.0486H11.4684L11.1137 10.3753H9.24957V16C13.0743 15.3962 16 12.0662 16 8.0486Z" -->
                        <!-- fill-color=" black" text="Facebook" -->
                        <!-- style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word" /> -->
                        <!-- </s-facebook> -->                                  
                        <div @click="copyToClipboard(props?.event?.name ? props?.event?.name : props?.organization?.name ? props?.organization?.name : '', getCurrentUrl())"
                            class="cursor-pointer"
                            style="width: 100%; height: 100%; justify-content: flex-start; align-items: center; gap: 12px; display: inline-flex">
                            <div style="width: 28px; height: 28px; position: relative">
                                <svg v-if="!contentCopied" width="32" height="32" viewBox="0 0 16 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4.71488 6.54244L3.34312 7.9142C2.17155 9.08577 2.17155 10.9853 3.34312 12.1568C4.51469 13.3284 6.41419 13.3284 7.58576 12.1568L9.41419 10.3284C10.5858 9.15684 10.5858 7.25735 9.41419 6.08577C9.16625 5.83784 8.88572 5.64237 8.58638 5.49938L7.99998 6.08578C7.939 6.14675 7.88754 6.21365 7.8456 6.28461C8.16104 6.37499 8.45862 6.54442 8.70708 6.79288C9.48813 7.57393 9.48813 8.84026 8.70708 9.62131L6.87866 11.4497C6.09761 12.2308 4.83128 12.2308 4.05023 11.4497C3.26918 10.6687 3.26918 9.40236 4.05023 8.62131L4.84283 7.8287C4.73064 7.40858 4.68799 6.97375 4.71488 6.54244Z"
                                        fill="black" />
                                    <path
                                        d="M6.58576 4.67156C5.41419 5.84313 5.41419 7.74263 6.58576 8.9142C6.8337 9.16214 7.11424 9.3576 7.41358 9.5006L8.18917 8.72501C7.86083 8.63732 7.55046 8.46468 7.29287 8.2071C6.51182 7.42605 6.51182 6.15972 7.29287 5.37867L9.1213 3.55024C9.90235 2.76919 11.1687 2.76919 11.9497 3.55024C12.7308 4.33129 12.7308 5.59762 11.9497 6.37867L11.1571 7.17128C11.2693 7.5914 11.312 8.02623 11.2851 8.45754L12.6568 7.08577C13.8284 5.9142 13.8284 4.01471 12.6568 2.84313C11.4853 1.67156 9.58576 1.67156 8.41419 2.84313L6.58576 4.67156Z"
                                        fill="black" />
                                </svg>
                                <svg v-if="contentCopied" xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-copy-check" width="32" height="32"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="#00b341" fill="none"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                                    <path
                                        d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                                    <path d="M11 14l2 2l4 -4" />
                                </svg>
                            </div>
                            <div
                                style="color: rgba(0, 0, 0, 0.85); font-size: 20px; font-family: Red Hat Text; font-weight: 600; word-wrap: break-word">
                                Copy
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ModalBase>
</template>

<script setup lang="ts">
import type { BtnAction } from "~/types/btn-props";
import ModalBase from "~/components/modal/ModalBase.vue";
import { STelegram, STwitter, SEmail, SMastodon, SFacebookMessenger, SFacebook, SSms } from 'vue-socials';
import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";
import SocialMediaShareIcon from "@/components/SocialMediaShareIcon.vue";

const props = defineProps<{
    cta: BtnAction["cta"];
    label: BtnAction["label"];
    ariaLabel: BtnAction["ariaLabel"];
    event?: Event;
    organization?: Organization;
    // group?: Group; // add group when we have it
}>();

const getEntityType = () => {
    if (props.event) {
        return setEntityInfo(props.event);
    } else if (props.organization) {
        return setEntityInfo(props.organization);
    }
};

const setEntityInfo = (data: typeof props.event | typeof props.organization) => {
    if (!data) return;
    return {
        subject: `Share ${data.name}!`,
        body: `Check out ${data.name}!`,
        url: getCurrentUrl(),
        text: `Check out ${data.name}!`,
    };
};

// function to grab the url to the base id of the event/org/group
const getCurrentUrl = () => {
    const url = window.location.href;
    return url.substring(0, url.lastIndexOf("/"));
};

const shareOptions = {
    url: getCurrentUrl() || "https://activist.org/en",
    text: getEntityType()?.text || "Check this out!",
    hashtags: ['activism', 'organizing'],
    via: 'activist_org',
    mail: '',
    cc: [''],
    bcc: [''],
    subject: getEntityType()?.subject || "Share this!",
    body: `${getEntityType()?.body}   ${getEntityType()?.url}` || "Check this out!",
    redirectUri: 'https://www.domain.com/',
    domain: 'https://mas.to',
    // appId: 842766727626496, Facebook Messenger App ID
};

const useNativeBehavior = false;
const contentCopied = ref(false);

// No specific actions should be taken on these events, but we can customize the behavior if needed
const nativeBehaviorOptions = {
    onClose: () => { },
    onOpen: () => { },
    onBlock: () => { },
    onFocus: () => { },
};

const windowFeatures = {};

const copyToClipboard = async (name: string, url: string) => {
    try {
        await navigator.clipboard.writeText(`${name} ${url}`);
        contentCopied.value = true;
        setTimeout(() => { contentCopied.value = false }, 3000)
    } catch (error) {
        console.error(`Could not copy text: ${error}`);
        contentCopied.value = false;
    };
};

</script>