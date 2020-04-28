import socketIOClient from "socket.io-client";
const socket = socketIOClient("https://chat-app-migu.herokuapp.com/");
export default socket;