<template>
  <v-container fill-height>
    <v-row class="first-row">
      <v-col sm="3">
        <v-btn @click="moveToCreateRoomListPage" text>Room List</v-btn>
      </v-col>
    </v-row>
    <v-row class="second-row">
      <v-col align="center">
        <v-text-field
          class="centeredInput"
          color="black"
          autofocus
          @keydown.enter="createRoom"
          placeholder="Room name"
          v-model="roomName"
        ></v-text-field>
        <v-btn @click="createRoom" text>Create room</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import API from "../services/apiService";
import router from "../router/index";
import socket from "../services/socket";
import store from "../store/index";
import Vue from "vue";
export default Vue.extend({
  data: function() {
    return {
      roomName: ""
    };
  },
  methods: {
    moveToCreateRoomListPage(): void {
      router.push("/chat-room-list");
    },
    createRoom(): void {
      API.createChatRoom(this.roomName).then(res => {
        if (res.data.isRoomTaken)
          alert(
            //because socket's room name can't be same. (if socket's room name uses other paramater, there can be same named room)
            `Room name: ${this.roomName} is taken. Please choose other name.`
          );
        else {
          const roomId = res.data.roomId;
          router.push(`/chat-room/${roomId}`);
          socket.emit("join", {
            roomName: this.roomName,
            user: store.state.user
          });
        }
      });
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
}
.first-row {
  height: 5%;
}
.second-row {
  height: 50%;
}
</style>
