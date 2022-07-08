import router from "@/router";
import store from "@/store";
import { createApp } from "vue";

import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

import App from "@/App.vue";
import "./registerServiceWorker";

createApp(App).use(router).use(store).mount("#app");
