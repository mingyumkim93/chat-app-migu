import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: "",
  },
  mutations: {
    signIn(state, payload: string): void{
      state.user = payload;
    },
    signOut(state): void{
      state.user = ""
    }
  },
  actions: {},
  modules: {}
});
