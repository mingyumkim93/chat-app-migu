import axios from 'axios';

export default {
    getChatRooms: async function(){
        const res = await axios.get("/api/rooms");
        return res;
    },
    createChatRoom: async function(roomName : string){
        const res = await axios.post("/api/room", {roomName});
        return res;
    },
    signIn: async function(userName: string){
        const res = await axios.post("/api/signIn",{userName});
        return res;
    },
    signOut: async function(userName: string){
        const res = await axios.post("/api/signOut",{userName});
        return res;
    },
}