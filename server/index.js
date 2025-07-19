const db = require("./db");
const express = require("express");
const { ChatServer } = require("./lib/ChatServer");
const e = require("express");

const app = express();
const chat = new ChatServer({
  httpServer: app,
  baseUrl: "ws://localhost:8080",
  path: "/comments",
});

app.use(express.static("../client/dist"));

async function resolveComment(comment) {
  try {
    const user = await db.getUser(comment.user_id);

    comment = {
      ...comment,
      user: {
        image: { png: user.image_url, webp: "" },
        username: user.username,
      },
      createdAt: new Date(comment.created_at).getTime(),
    };

    if ("replying_to" in comment) {
      let username = await db.query(
        `SELECT username FROM users WHERE id=
          (SELECT user_id FROM comments WHERE id=$1)`,
        [comment.replying_to],
      ).rows[0][0];

      comment.replyingTo = username;
    } else {
      let replies = await db.getReplies(comment.id);
      comment.replies = await Promise.all(
        replies.map((reply) => resolveComment(reply)),
      );
    }
  } catch (e) {
    throw new Error(e);
  } finally {
    delete comment.replying_to;
    delete comment.user_id;
    delete comment.created_at;

    return comment;
  }
}

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
    chat.messages = messages;

    chat.init((httpServer) => {
      httpServer.listen(8080, () => {
        console.log("Running on port: 8080");
      });
    });
  })
  .catch(console.log);
