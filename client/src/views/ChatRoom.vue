<template>
  <v-container fill-height>
    <v-row class="first-row">
      <v-btn @click="leaveRoom" text>leave</v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="card">
          <v-card-text fluid>
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="message.sender"
            >
              <p class="chatbox-left">
                {{ message.sender }}: {{ message.text }}
              </p>
              <p class="chatbox-right">
                {{ message.createdAt }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="third-row">
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
import socket from "../services/socket";
import store from "../store/index";
import router from "../router/index";
import Vue from "vue";

interface Message {
  sender: string;
  text: string;
  createdAt?: string;
}
export default Vue.extend({
  data: function() {
    return {
      messageInput: "",
      messages: [] as Array<Message>
    };
  },
  methods: {
    sendMessage(): void {
      if(this.messageInput !== ""){
      const message = { sender: store.state.user, text: this.messageInput };
      socket.emit("message", message);
      const createdAt = this.getLocalDateString();
      this.messages.push({ ...message, createdAt });
      this.messageInput = "";
      }
    },
    leaveRoom(): void {
      const roomId = parseInt(router.currentRoute.params.id);
      socket.emit("leave", { roomId, user: store.state.user });
      router.push("/chat-room-list");
    },
    getLocalDateString(): string {
      const d = new Date();
      const dformat =
        [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
        " " +
        [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
      return dformat;
    }
  },
  mounted() {
    socket.on("message", (message: Message) => {
      message = {
        ...message,
        createdAt: this.getLocalDateString()
      };
      this.messages.push(message);
    });
  },
  created() {
    window.addEventListener("beforeunload", this.leaveRoom);
  }
});
</script>

<style scoped>
.Admin {
  color: red;
}
.first-row {
  position: sticky;
  top: 3%;
}
.card {
  height: 400px;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
}
.chatbox-left {
  text-align: left;
  float: left;
  width: 60%;
}
.chatbox-right {
  text-align: right;
  float: right;
  width: 40%;
}
.third-row {
  position: sticky;
  bottom: 3%;
}
</style>
