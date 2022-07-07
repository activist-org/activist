import Vue from "vue";
import VueRouter from "vue-router";

import ExampleComponent from "@/components/ExampleComponent.vue";

const routes = [{ path: "*", component: ExampleComponent }];

Vue.use(VueRouter);
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  mode: "history",
  routes,
});

export default router;
