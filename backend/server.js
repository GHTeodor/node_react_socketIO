const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const rooms = new Map();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors('*'))

app.get("/rooms/:roomId", function (req, res) {
    const {roomId} = req.params;

    const obj = rooms.has(roomId)
        ? {
            users: [...rooms.get(roomId).get('users').values()],
            messages: [...rooms.get(roomId).get('messages').values()],
        }
        : {users: [], messages: []};
    res.json(obj);
});

app.post("/rooms", (req, res) => {
    const {roomId, userName} = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(roomId,
            new Map([
                ['users', new Map()],
                ['messages', []]
            ]));
        console.log(rooms.keys());
    }
    res.sendStatus(200);
});

io.on('connection', (socket) => {
    socket.on("ROOM:JOIN", ({roomId, userName}) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);

        const users = [...rooms.get(roomId).get('users').values()];
        socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
    });

    socket.on("ROOM:NEW_MESSAGE", ({roomId, userName, text}) => {
        const obj = {
            userName,
            text
        };
        rooms.get(roomId).get('messages').push(obj);
        socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
    });

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
            }
        });
    });

    console.log('Socket connected', socket.id);
});

server.listen(5200, "localhost", (err) => {
    if (err) throw Error(err);
    console.log(`Server works on http://localhost:5200`);
});
