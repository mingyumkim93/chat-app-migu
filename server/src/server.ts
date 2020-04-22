import express, {Application, Request, Response} from 'express';
import bodyParser from 'body-parser';
import * as socket from 'socket.io';
const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let i = 0;
interface room { id : number, roomName: string, attendees: Array<string>}
let rooms: Array<room> = [];
let loggedInUsers: Array<string> = [];

app.get('/', (req: Request, res: Response): void => {
    res.send("hello!");
});

app.get('/api/rooms', (req: Request, res: Response): void => {
    res.send(rooms);
    console.log("rooms fetch")
});

app.post('/api/room', (req: Request, res: Response): void => {
    //prevent making same name room.
    const isRoomExist = rooms.find(room => room.roomName === req.body.roomName);
    if(isRoomExist)
        res.send({isRoomTaken: true});
    else{
        rooms.push({id:++i, roomName:req.body.roomName, attendees:[]});
        res.send({roomId : i});
    }
});

app.post('/api/signIn',(req: Request, res: Response): void => {
    const isUserExist = loggedInUsers.find(user => user === req.body.userName);
    if(isUserExist)
        res.send({isUserExist: true});
    else{
        loggedInUsers.push(req.body.userName);
        res.send({isUserExist: false});
    }
});

app.post('/api/signOut',(req: Request, res: Response): void => {
    const isUserExist = loggedInUsers.find(user => user === req.body.userName);
    if(isUserExist){
        loggedInUsers.splice(req.body.user, 1);
        res.sendStatus(200);
    }
    else res.sendStatus(400);
});

const server = app.listen(5000);
const io = socket.listen(server);
io.on("connection", (socket) => {
    console.log("new client connected", socket.id);
    socket.on("disconnect", () => console.log("connection disconnected", socket.id));
    socket.on('join', ({roomName, user}) => {
        const room = rooms.find(room => room.roomName === roomName);
        if(room) {
            room.attendees.push(user);
            socket.join(roomName);
            socket.broadcast.emit("attendeesChangedToNotZero", room);
        }
    });
    socket.on('leave', ({roomId, user}) => {
        const roomUserLeaves = rooms.find(room => room.id === roomId); 
        if(roomUserLeaves){
            //make attendees array that remains after the user left
            const remainingAttendees = roomUserLeaves.attendees.filter(attendee=>attendee!==user);
            roomUserLeaves.attendees = remainingAttendees;
            socket.leave(roomUserLeaves.roomName);
            //nobody left 
            if(roomUserLeaves.attendees.length===0)
            {
                console.log("room became empty")
                // make array of rooms after removing the empty room
                const updatedRooms = rooms.filter(roomBeforeUpdate => roomBeforeUpdate!==roomUserLeaves);
                rooms = updatedRooms;
                socket.broadcast.emit("attendeesChangedToZero", roomUserLeaves);
            }
            else{
                socket.broadcast.emit("attendeesChangedToNotZero", roomUserLeaves);
            }
        }
    })
    socket.on('message', message => {
        const room = socket.rooms[Object.keys(socket.rooms)[1]]
        socket.broadcast.to(room).emit("message", {...message, createdAt:new Date()}); 
    });
    socket.on("roomtest", ()=>console.log(socket.rooms))
});