<template>
  <v-container fill-height>
    <v-row style="height:5%">
      <v-col sm="3">
        <v-btn @click="moveToCreateRoomListPage" text>Room List</v-btn>
      </v-col>
    </v-row>
    <v-row style="height:50%">
      <v-col align="center">
        <v-text-field
          style="width:50%"
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
import API from "@/services/apiService";
import router from "@/router/index";
import socket from "@/services/socket";
import store from "@/store/index";
export default {
  data: function() {
    return {
      roomName: "",
      roomId: undefined
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
          this.roomId = res.data.roomId;
          socket.emit("join", {
            roomName: this.roomName,
            user: store.state.user
          });
          router.push(`/chat-room/${this.roomId}`);
        }
      });
    }
  }
};
</script>

<style scoped>
.centeredInput >>> input {
  text-align: center;
}
</style>
