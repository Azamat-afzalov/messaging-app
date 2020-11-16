const express = require('express')
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server,{cors: true, credentials: ["http://localhost:4200"]});
const port = process.env.PORT || 3000;
let users = [];
let messages = [];

io.on('connection', (socket) => {
    const id = socket.id;
    users.push(id);
    io.emit('get-messages', messages);
    socket.on('new-message', (msg) => {
        console.log(msg);
        messages.push({title : msg, userId: id})
        io.emit('new-message', {title : msg, userId: id});
    });
    socket.on('online-users',() => {
        io.emit('online-users',users);
    })
    socket.on('disconnect',() => {
        users = users.filter(user => user.id !== id);
        io.emit('online-users',users);
        console.log(users);
    })
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
