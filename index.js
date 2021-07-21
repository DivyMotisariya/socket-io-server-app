const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);

io.on("connect", (socket) => {
  console.log("New user connected", socket.id);

  socket.on("changeName", (data) => {
    socket.username = data.username;
    socket.emit("changeName", socket.username)
  })

  socket.on("changeRoom", (data) => {
    socket.roomname = data.roomname;
    socket.join(socket.roomname);
    socket.emit("changeRoom", socket.roomname);
  })

  socket.on("message", (data) => {
    // send to all sockets except sender socket
    socket.to(socket.roomname).emit("message", { username: socket.username, msg: data.msg });

    // send to all sockets
    // socket.emit("message", data);
  });

  socket.on('disconnect', (msg) => {
    console.log("User Disconnected", socket.id, msg);
  })
});