const db = require("./db");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const { messageReducer, resolveComment } = require("./lib/messageResolver.js");
const { ChatServer } = require("./lib/ChatServer");

const { authRouter } = require("./routes/auth.js");

const PORT = process.env.PORT || 8080;
const app = express();

// TODO: Implement ping and pong requests for monitoring clients

const chat = new ChatServer({
    httpServer: app,
    path: "/comments",
    messageResolver: messageReducer,
});

app.use(express.json());

app.use(express.static("../client/dist"));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(authRouter);

app.get("/avatars/:avatar", (req, res) => {
    const { avatar } = req.params;
    const name = path.basename(avatar);
    const avatarsDir = path.join(__dirname, "avatars");

    res.sendFile(name, { root: avatarsDir }, (err) => {
        if (err) {
            console.log(`Error: ${err}`);
            res.status(500).end("Couldn't complete the request");
        }
    });
});

async function getChatMessages() {
    let comments;
    try {
        comments = await db.getComments();
        comments = await Promise.all(
            comments.map((comment) => resolveComment(comment)),
        );

        return comments;
    } catch (error) {
        console.log("Internal Error: ", error);
        throw new Error("Couldn't Fetch Messages");
    }
}

function startServer(messages) {
    chat.messages = messages.map((message) => ({
        type: "ADD_COMMENT",
        data: message,
    }));

    chat.init((httpServer) => {
        httpServer.listen(PORT, () => console.log(`Running on PORT: ${PORT}`));
    });
}

getChatMessages()
    .then(startServer)
    .catch((err) => console.log(err));
