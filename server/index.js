const { messageResolver, resolveComment } = require("./lib/messageResolver.js");
const { ChatServer } = require("./lib/ChatServer");
const app = express();

const chat = new ChatServer(
    {
        httpServer: app,
        baseUrl: "ws://localhost:8080",
        path: "/comments",
    },

    messageResolver,
);

function resolveChatMessages() {
    return new Promise((resolve, reject) => {
        db.getComments().then((comments) => {
            let resolvedComments = Promise.all(
                comments.map((comment) => resolveComment(comment)),
            );

            resolvedComments.then(resolve).catch(reject);
        });
    });
}

resolveChatMessages()
    .then((messages) => {
        chat.messages = messages.map((message) => ({
            type: "ADD_COMMENT",
            data: message,
        }));

        chat.init((httpServer) => {
            httpServer.listen(PORT, () => {
                console.log(`Running on port: ${PORT}`);
            });
        });
    })
    .catch((reason) => {
        app.emit("error", reason);
    });
