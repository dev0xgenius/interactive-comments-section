const db = require("../db");
const {
  addComment,
  addReply,
  deleteReply,
  editReply,
} = require("../db/queries");

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

    if ("comment_id" in comment) {
      comment.commentID = comment.comment_id;
      comment.replyingTo = comment.replying_to;
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
    delete comment.comment_id;

    return comment;
  }
}

function messageResolver(message) {
  message = JSON.parse(message);

  switch (message.type) {
    case "ADD_COMMENT":
      return new Promise((resolve, reject) => {
        addComment(message.data)
          .then(resolveComment)
          .then((data) => {
            message.data = data;
            resolve(JSON.stringify(message));
          })
          .catch(reject);
      });
    case "ADD_REPLY":
      return new Promise((resolve, reject) => {
        addReply(message.data)
          .then(resolveComment)
          .then((data) => {
            message.data = data;
            resolve(JSON.stringify(message));
          })
          .catch(reject);
      });
    case "DELETE_REPLY":
      return new Promise((resolve, reject) => {
        deleteReply(message.data).catch(reject);
        resolve(JSON.stringify(message));
      });
    case "EDIT_REPLY":
      return new Promise((resolve, reject) => [
        editReply(message.data)
          .then(resolveComment)
          .then((data) => {
            message.data = data;
            resolve(JSON.stringify(message));
          }),
      ]);
  }
}

module.exports = {
  messageResolver,
  resolveComment,
};
