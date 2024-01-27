import { STelegram } from 'vue-socials'

import type { Event } from "~/types/event";
import type { Organization } from "~/types/organization";

export const entityProps = defineProps<{
    organization?: Organization;
    event?: Event;
    // group?: Group; // add group when we have it
}>();

const contentCopied = ref(false);

const checkEntityType = () => {
    if (entityProps.event) {
        return setData(entityProps.event);
    } else if (entityProps.organization) {
        return setData(entityProps.organization);
    }
    // add group when we have it
};

// function to grab the url to the base id of the event/org/group
const getCurrentUrl = () => {
    const url = window.location.href;
    return url.substring(0, url.lastIndexOf("/"));
};

const setData = (data: Event | Organization) => {
    return {
        subject: `Share ${data.name}!`,
        body: `Check out ${data.name}!`,
        url: getCurrentUrl(),
        text: `Check out ${data.name}!`,
    };
};

export const copyToClipboard = (name: string, url: string) => {
    navigator.clipboard.writeText(`${name} ${url}`)
    .then(() => {
        console.log(`Copied text to clipboard: ${name} ${url}`);
        contentCopied.value = true;
        setTimeout(() => { contentCopied.value = false }, 5000)
    })
    .catch((error) => {
        console.error(`Could not copy text: ${error}`);
        contentCopied.value = false;
    });
};

export default {
  name: 'STelegramSharing',
  
  components: { STelegram },
  
  data() {
    return {
        windowFeatures: {},
        shareOptions: {
        url: checkEntityType()?.url || "https://activist.org/en",
        text: checkEntityType()?.text || "Check this out!",
        hashtags: ['activism', 'organizing'],
        via: 'activist_org',
        mail: '',
        cc: [''],
        bcc: [''],
        subject: checkEntityType()?.subject || "Share this!",
        body: `${checkEntityType()?.body}   ${checkEntityType()?.url}` || "Check this out!",
        redirectUri: 'https://www.domain.com/',
        appId: 123456789,
        to: undefined,
        number: '+1(312)758-7765',
    },  
    useNativeBehavior: false
    // {
    //   windowFeatures: {},
    //   shareOptions: {
        // url: 'https://github.com/',
        // text: 'Text',
    //   },
    //   useNativeBehavior: false,
    // }
  }
},
  
  methods: {
    onClose() {},
    onOpen() {},
    onBlock() {},
    onFocus() {},
  }
};

// <!-- <script> -->
// <!-- // import { defineComponent } from "vue"; -->
// <!-- //  -->
// <!-- // export default defineComponent({ -->
    // <!-- // components: { -->
        // <!-- //  STelegram,  -->
    // <!-- // }, -->
    // <!-- // setup() { -->
        // <!-- // return { -->
            // <!-- // ...data(), -->
            // <!-- // ...nativeBehaviorOptions, -->
        // <!-- // }; -->
    // <!-- // }, -->
// <!-- // }); -->
// <!-- </script> -->
// <!-- <script> -->
// <!-- export default { -->
//   <!-- name: 'STelegramSharing', -->
//   <!-- components: { STelegram }, -->
//   <!-- name: 'STwitterSharing', -->
//   <!-- components: { STwitter }, -->
//   <!-- name: 'SEmailSharing', -->
//   <!-- components: { SEmail }, -->
//   <!-- name: 'SMastodonSharing', -->
//   <!-- components: { SMastodon }, -->
//   <!-- name: 'SFacebookMessengerSharing', -->
//   <!-- components: { SFacebookMessenger }, -->
//   <!-- name: 'SFacebookWorkplaceSharing', -->
//   <!-- components: { SFacebookWorkplace }, -->
//   <!-- name: 'SSmsSharing', -->
//   <!-- components: { SSms }, -->
// <!-- } -->
// <!-- </script> -->
// <!-- :cta=props.cta :label=props.label :aria-label=props.ariaLabel  -->
