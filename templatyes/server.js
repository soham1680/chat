const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const connectedUsers = new Map(); // Map to store connected users and their status

io.on('connection', (socket) => {
  console.log('A user connected');

  // When a user connects, add them to the connectedUsers map with an "online" status
  connectedUsers.set(socket.id, { online: true });

  // Send the list of connected users to all clients
  io.emit('userList', Array.from(connectedUsers.keys()));

  socket.on('message', (message) => {
    io.emit('message', { sender: socket.id, message }); // Include sender's socket.id in the message
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // When a user disconnects, set their status to "offline"
    connectedUsers.set(socket.id, { online: false });
    io.emit('userList', Array.from(connectedUsers.keys()));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
