const { createServer } = require("http");
const { WebSocket, WebSocketServer } = require("ws");

class ChatServer {
    #socket;
    #server;

    constructor({ httpServer, messageResolver, path = "/chat" }) {
        this.#socket = new WebSocketServer({ noServer: true });
        this.#server = createServer(httpServer);

        this.messageResolver = messageResolver;
        this.messages = [];

        this.#server.on("upgrade", (req, socket, head) => {
            const pathname = req.url;

            if (pathname === path) {
                this.#socket.handleUpgrade(req, socket, head, (client) => {
                    this.#socket.emit("connection", client, req);
                });
            } else {
                socket.destroy();
            }
        });

        this.#server.on("error", (err) => {
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
            console.log("Connection Closed");
        });
    }

    init(callback) {
        this.#socket.on("connection", this.#connectionHandler.bind(this));
        callback(this.#server);
    }

    async broadcastMessage(data, client = undefined) {
        const broadcastToAll = (message) => {
            for (const client of this.#socket.clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            }
        };

        try {
            let resolvedMessage = await this.messageResolver(data);
            broadcastToAll(resolvedMessage);

            this.messages = this.messages.concat(JSON.parse(resolvedMessage));
        } catch (error) {
            this.#server.emit("error", error, client);
        }
    }
}

module.exports = {
    ChatServer,
};
