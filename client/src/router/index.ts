import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import SignIn from "@/views/SignIn.vue";
import ChatRoomList from "@/views/ChatRoomList.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import CreateRoom from "@/views/CreateRoom.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "SignIn",
    component: SignIn
  },
  {
    path: "/chat-room-list",
    name: "ChatRoomList",
    component: ChatRoomList
  },
  {
    path: "/chat-room/:id",
    name: "ChatRoom",
    component: ChatRoom
  },
  {
    path: "/create-room",
    name: "CreateRoom",
    component: CreateRoom
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
