<template>
  <div>
    Sign in page
    <input placeholder="Your Nickname" v-model="userName" />
    <button @click="signIn">Sign in</button>
  </div>
</template>

<script lang="ts">
import router from "@/router/index";
import store from "@/store/index";
import API from "@/services/apiService";
export default {
  data: function() {
    return {
      userName: ""
    };
  },
  methods: {
    signIn: function() {
      API.signIn(this.userName).then(res => {
        if (res.data.isUserExist) {
          alert(
            `User name ${this.userName} is taken. Please choose other name.`
          );
        } else {
          store.commit("signIn", this.userName);
          router.push("/chat-room-list");
        }
      });
    }
  }
};
</script>
