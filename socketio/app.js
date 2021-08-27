const { Socket } = require("socket.io");

const localhost100 = [];
for (let i = 0; i < 10; i++) {
  localhost100.push("http://localhost:300" + i);
}

const io = require("socket.io")(8900, {
  cors: {
    origin: localhost100,
  },
});
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  //when ceonnect
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  console.log(users);
  //send and get message
  socket.on(
    "sendMessage",
    ({ senderId, receiverId, text, chatId, imageUrl }) => {

      const user = getUser(receiverId);

      if (user == undefined) {
        const reportError = getUser(senderId);
        io.to(reportError.socketId).emit("Error", {
          msg: "User disconected",
        });
        return;
      }

      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        imageUrl,
      });
      
      io.to(user.socketId).emit("getNotification", {
        senderId,
        text,
        chatId,
        type: 0,
      });
    }
  );
  socket.on("sendNoficiation", ({ senderId, receiverId, text, type }) => {
    const user = getUser(receiverId);
    if (user == undefined) {
      const reportError = getUser(senderId);
      io.to(reportError.socketId).emit("Error", {
        msg: "Korisnik nije na vezi",
      });
      return;
    }
    io.to(user.socketId).emit("getNotification", {
      senderId,
      text,
      type,
    });
  });
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
