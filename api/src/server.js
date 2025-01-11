const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://jjlba.azurewebsites.net/",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("createRoom", (roomId) => {
    rooms.set(roomId, { admin: socket.id, users: new Map(), votes: new Map() });
    socket.join(roomId);
    console.log(`Room created: ${roomId}`);
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms.has(roomId)) {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  socket.on("join", ({ username, room }) => {
    if (rooms.has(room)) {
      rooms.get(room).users.set(socket.id, username);
      io.to(room).emit("userJoined", { username, room });
      console.log(`${username} joined room: ${room}`);
      setVote(socket, 0, room);
    }
  });

  function setVote(socket, points, room) {
    const username = rooms.get(room).users.get(socket.id);
    rooms.get(room).votes.set(username, points);
    const votes = Array.from(rooms.get(room).votes, ([user, vote]) => ({
      username: user,
      vote,
    }));
    io.to(room).emit("voteUpdate", { room, votes });
    console.log(
      `Default vote received in room ${room}: ${username} - ${points}`
    );
  }

  socket.on("vote", ({ points, room }) => {
    if (rooms.has(room)) {
      setVote(socket, points, room);
      console.log(`Vote received in room ${room}: - ${points}`);
    }
  });

  socket.on("showVotes", (room) => {
    if (rooms.has(room) && rooms.get(room).admin === socket.id) {
      io.to(room).emit("showVotes", room);
      console.log(`Votes revealed in room: ${room}`);
    }
  });

  socket.on("hideVotes", (room) => {
    if (rooms.has(room) && rooms.get(room).admin === socket.id) {
      io.to(room).emit("hideVotes", room);
      console.log(`Votes hidden in room: ${room}`);
    }
  });

  socket.on("clearVotes", (room) => {
    if (rooms.has(room) && rooms.get(room).admin === socket.id) {
      rooms.get(room).votes.forEach((value, key) => {
        rooms.get(room).votes.set(key, 0);
      });
      const votes = Array.from(rooms.get(room).votes, ([user, vote]) => ({
        username: user,
        vote,
      }));
      console.log(votes);
      io.to(room).emit("voteUpdate", { room, votes });
      io.to(room).emit("hideVotes", room);
      console.log(`Votes cleared & hidden in room: ${room}`);
    }
  });

  socket.on("disconnect", () => {
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        const username = room.users.get(socket.id);
        room.users.delete(socket.id);
        room.votes.delete(username);
        io.to(roomId).emit("userLeft", { username, room: roomId });
        console.log(`${username} left room: ${roomId}`);
      }
      if (room.admin === socket.id) {
        // Handle admin disconnection (e.g., assign new admin or close room)
        console.log(`Admin left room: ${roomId}`);
      }
    });
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
