import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
const app = express();

const PORT = 3001;

// app.use(express.static(path.join(__dirname, "/build/")));
app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
function rand() {
  return Math.floor(Math.random() * 6) + 1;
}
io.on("connection", (socket) => {
  console.log(socket.id, "user connected");
  socket.on("reqTurn", (data) => {
    console.log(data, "reqTurn");
    const room = JSON.parse(data).room;
    io.to(room).emit("playerTurn", data);
  });

  socket.on("create", (room) => {
    socket.join(room);
  });

  socket.on("join", (room) => {
    socket.join(room);

    io.emit("opponent_joined");
  });

  socket.on("reqRestart", (data) => {
    const room = JSON.parse(data).room;
    io.to(room).emit("restart");
  });
  socket.on("clickLeft", (data) => {
    console.log("click left", data);
    const count = rand();
    io.emit("responceLeft", count);
  });
  socket.on("clickRight", (data) => {
    const count = rand();
    io.emit("responceRight", count);
  });
});

server.listen(3001, (error) => {
  if (error) console.log(error, "err");
  else {
    console.log(` server  is running`);
  }
});
