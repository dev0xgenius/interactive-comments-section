const { createServer } = require("http");
const { WebSocket, WebSocketServer } = require("ws");

class ChatServer {
  #socket;
  #server;

  // baseUrl should contain the port number
  // use process.env.PORT or custom port e.g 8080
  constructor({ httpServer, baseUrl, path = "/chat" }, messageResolver) {
    this.#socket = new WebSocketServer({ noServer: true });
    this.#server = createServer(httpServer);
    this.messageResolver = messageResolver;

    this.messages = [];

    this.#server.on("upgrade", (req, socket, head) => {
      const { pathname } = new URL(req.url, baseUrl);

      if (pathname === path) {
        this.#socket.handleUpgrade(req, socket, head, (client) => {
          this.#socket.emit("connection", client, req);
        });
      } else {
        socket.destroy();
      }
    });

    this.#server.on("error", (err, client) => {
      console.log(client);
      console.log(err);
    });
  }

  #connectionHandler(client, req) {
    client.send(JSON.stringify(this.messages), (err) => {
      if (!err) console.log("Message Sent");
      else req.emit("error", new Error(err));
    });

    client.on("message", (data) => {
      this.broadcastMessage(data, client);
    });

    client.on("error", (err) => this.#server.emit("error", err, this));

    client.on("close", () => {
      console.log("connection closed");
    });
  }

  init(callback) {
    this.#socket.on("connection", this.#connectionHandler.bind(this));
    callback(this.#server);
  }

  broadcastMessage(data, client = undefined) {
    const onError = (err) => {
      if (err) this.#server.emit("error", err, client);
    };

    const broadcastToAll = (message) => {
      for (const client of this.#socket.clients)
        if (client.readyState === WebSocket.OPEN) client.send(message, onError);
    };

    this.messageResolver(data)
      .then((resolvedMessage) => {
        broadcastToAll(resolvedMessage);
        this.messages = this.messages.concat(JSON.parse(resolvedMessage));
      })
      .catch(onError);
  }
}

module.exports = {
  ChatServer,
};
