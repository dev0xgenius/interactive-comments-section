const { getComments } = require("./db");
const express = require("express");
const { ChatServer } = require("./lib/ChatServer");

const app = express();
const chat = new ChatServer(app, "ws://localhost:8080", "/comments");

getComments().then((comments) => (chat.messages = comments));

chat.init((httpServer) => {
  httpServer.listen(8080, () => {
    console.log("Running on port: 8080");
  });
});
