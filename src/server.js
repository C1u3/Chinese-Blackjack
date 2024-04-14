const express = require("express");
const app = express();
const server = app.listen(3000)
const io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.send("hi");
})

io.on("connection", (socket) => {
  console.log("user connected");
});

app.use(express.static());