const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const app = express();
const socket = require('socket.io');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/", userRoutes)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("err", err);
  });

  const server= app.listen(process.env.PORT || 6000, () => {
  console.log("servere is Running on ", process.env.PORT);
});



const io = socket(server, {
  cors: {
      origin: "http://localhost:3000",
      credentials: true,
  }
});
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
  })
  socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
          socket.to(sendUserSocket).emit('msg-receive', data.message);
      }
  })
})