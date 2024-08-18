const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const res = require("express/lib/response");
const { chats } = require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:3000", "https://text-flow-dev.vercel.app"],
};
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ---- Deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
// ---- Deployment

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id), console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing")); //initialising socket for typing on
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing")); // initialising socket fot typing stop
  socket.on("new message", (newMessageRecieved) => {
    // console.log("newMessageRecieved"+newMessageRecieved);
    var chat = newMessageRecieved.chat;
    // console.log("logging the chat here", chat);
    if (!chat.users) return console.log("not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
