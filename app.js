var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app);

var io = require("socket.io")(server);
var path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var name;
io.on("connection", (socket) => {
  socket.on("joining message", (username) => {
    name = username;
    io.emit("chat message", username + " has joined the chat");
  });
  console.log("new user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("chat message", `---${name} left the chat---`);
  });
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg); //sending message to all except the sender
  });
  //   typing event
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
  console.log(name);
});

server.listen(3000, () => {
  console.log("Server listening on :3000");
});
