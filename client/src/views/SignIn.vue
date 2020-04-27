<template>
  <v-container fill-height>
    <v-row justify="center" class="row">
      <v-col align="center" sm="6" class="col">
        <v-text-field
          class="centeredInput"
          color="black"
          autofocus
          placeholder="User name"
          v-model="userName"
          @keydown.enter="signIn"
        ></v-text-field>
        <v-btn @click="signIn" text>Sign in</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="emptyUserNameDialog" max-width="350">
      <v-card>
        <v-card-title class="headline">
          User name can't be empty!
        </v-card-title>
        <v-card-text>
          Please input user name.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="emptyUserNameDialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="invaildUserNamedialog" max-width="350">
      <v-card>
        <v-card-title class="headline"> {{ userName }} is taken! </v-card-title>
        <v-card-text>
          Please input other user name.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="invaildUserNamedialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import router from "@/router/index";
import store from "@/store/index";
import API from "@/services/apiService";
import Vue from "vue";
export default Vue.extend({
  data: function() {
    return {
      userName: "",
      emptyUserNameDialog: false,
      invaildUserNamedialog: false
    };
  },
  methods: {
    signIn(): void {
      if (this.userName !== "Admin") {
        if (this.userName !== "") {
          API.signIn(this.userName).then(res => {
            if (res.data.isUserExist) {
              this.invaildUserNamedialog = true;
            } else {
              store.commit("signIn", this.userName);
              router.push("/chat-room-list");
            }
          });
        } else {
          this.emptyUserNameDialog = true;
        }
      } else {
        //if userName === "Admin"
        alert("You can't use the name!");
      }
    }
  }
});
</script>

<style scoped>
.centeredInput >>> input {
  text-align: center;
}
.centeredInput {
  width: 50%;
  padding-top: 30%;
}
.row {
  height: 80%;
}
.col {
  height: 100%;
  border:black solid thin;
}
</style>
