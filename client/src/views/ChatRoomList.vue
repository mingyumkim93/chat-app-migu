<template>
  <v-container fill-height>
    <v-app-bar app>
      <v-btn @click="moveToCreateRoomPage" text>Create Room</v-btn>
      <v-btn @click="signOut" text>Sign out</v-btn>
    </v-app-bar>
    <v-row>
      <h1 v-if="rooms.length === 0">There is no chat room available</h1>
      <v-col v-for="(room, index) in rooms" :key="index" sm="3">
        <v-card>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">
              {{ room.roomName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ room.attendees.length }} attending
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-card-actions>
            <v-btn @click="joinRoom(room.id, room.roomName)">Join</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import API from "../services/apiService";
import router from "../router/index";
import store from "../store/index";
import socket from "../services/socket";
import Vue from "vue";
interface Room {
  id: number;
  roomName: string;
  attendees: Array<string>;
}
export default Vue.extend({
  data: function() {
    return {
      rooms: [] as Array<Room>
    };
  },
  methods: {
    signOut(): void {
      API.signOut(store.state.user).then(res => {
        if (res.status === 200) {
          store.commit("signOut");
          router.push("/");
        } else {
          alert("Something went wrong!");
        }
      });
    },
    moveToCreateRoomPage(): void {
      router.push("/create-room");
    },
    joinRoom(id: number, roomName: string): void {
      socket.emit("join", { roomName, user: store.state.user });
      router.push(`/chat-room/${id}`);
    }
  },
  mounted() {
    API.getChatRooms()
      .then(res => {this.rooms = res.data; console.log(res.data)})
      .catch(err => alert(err));
    socket.on("attendeesChangedToNotZero", (room: Room) => {
      const existRoom = this.rooms.find(
        (existingRoom: Room) => existingRoom.id === room.id
      );
      // a existing room's attendees updated
      if (existRoom) {
        const index = this.rooms.findIndex((roomInRooms: Room) => {
          return roomInRooms.id === room.id;
        });
        this.rooms[index].attendees = room.attendees;
      }
      // a new room has just made
      else this.rooms.push(room);
    });

    socket.on("attendeesChangedToZero", (room: Room) => {
      // remove the room from rooms array
      const roomWillBeRemoved = this.rooms.find(
        (roomInRooms: Room) => roomInRooms.id === room.id
      );
      if (roomWillBeRemoved) {
        const index: number = this.rooms.indexOf(roomWillBeRemoved);
        this.rooms.splice(index, 1);
      }
    });
  },
  created() {
    window.addEventListener("beforeunload", this.signOut);
  }
});
</script>
