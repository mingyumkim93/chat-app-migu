<template>
  <div>
    Create chat room
    <button @click="moveToCreateRoomListPage">Room List</button>
    <input placeholder="Room name" v-model="roomName" />
    <button @click="createRoom">Create room</button>
  </div>
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
