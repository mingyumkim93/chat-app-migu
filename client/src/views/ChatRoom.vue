<template>
  <v-container fill-height>
    <v-row style="position:sticky; top:3%">
      <v-btn @click="leaveRoom" text>leave</v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          style="height:400px; display:flex; flex-direction:column-reverse; overflow:auto"
        >
          <v-card-text fluid>
            <div v-for="(message, index) in messages" :key="index">
              <div style="text-align:left">
                {{ message.sender }}: {{ message.text }}
              </div>
              <div style="text-align:right">
                {{ message.createdAt }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row style="position:sticky; bottom:3%">
      <v-text-field
        v-model="messageInput"
        @keydown.enter="sendMessage"
        autofocus
        color="black"
      ></v-text-field>
      <v-btn @click="sendMessage" text>send</v-btn>
    </v-row>
  </v-container>
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
      this.messages.push({ ...message, createdAt });
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
