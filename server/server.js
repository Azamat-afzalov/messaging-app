const express = require('express')
const app = express();

const http = require('http');
const server = http.Server(app);
const socketIO = require('socket.io');

const io = socketIO(server,{
    cors: true,
    credentials: ["http://localhost:4200"]
});
const port = process.env.PORT || 3000;
let numUsers = 0;
let messages = [];

io.on('connection', (socket) => {
    let addUser = false;
    
    socket.on('new message', (msg) => {
        // console.log('new message', msg)
        messages.push({
            message : msg,
            username: socket.username
        });
        io.emit('new message', {
            message : msg, 
            username: socket.username
        });
    });
    socket.on('add-user', (username) => {
        if(addUser) return;
        socket.username = username;
        ++numUsers;
        addUser = true;
        socket.emit('login', {
            numUsers : numUsers,
            messages : messages
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    })
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
        username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
        username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addUser) {
        --numUsers;
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
        });
        }
    });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
