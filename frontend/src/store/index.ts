import Vue from "vue";
import Vuex from "vuex";

import auth from "@/store/modules/auth";
import users from "@/store/services/users";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    users,
    auth,
  },
});

export default store;
