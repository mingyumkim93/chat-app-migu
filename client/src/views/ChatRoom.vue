<template>
  <div>
    <div v-for="(message, index) in messages" :key="index">
      {{ message.sender }} : {{ message.text }} {{ message.createdAt }}
    </div>
    <input v-model="messageInput" />
    <button @click="sendMessage">send</button>
    <button @click="leaveRoom">leave</button>
  </div>
</template>

<script lang="ts">
import socket from "@/services/socket";
import store from "@/store/index";
import router from "@/router/index";
export default {
  data: function() {
    return {
      messageInput: "",
      messages: []
    };
  },
  methods: {
    sendMessage: function() {
      const message = { sender: store.state.user, text: this.messageInput };
      socket.emit("message", message);
      const now = new Date();
      const createdAt = now
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);
      this.messages.push({ ...message, createdAt});
      this.messageInput = "";
    },
    leaveRoom: function() {
      const roomId = parseInt(window.location.pathname.split("/")[2]);
      socket.emit("leave", { roomId, user: store.state.user });
      router.push("/chat-room-list");
    }
  },
  mounted() {
    socket.on("message", message => {
      message = {
        ...message,
        createdAt: message.createdAt.replace("T", " ").slice(0, 19)
      };
      this.messages.push(message);
    });
  },
  created() {
    window.addEventListener("beforeunload", this.leaveRoom);
  }
};
</script>
