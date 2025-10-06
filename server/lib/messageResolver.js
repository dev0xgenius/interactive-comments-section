const db = require("../db");

const {
    addComment,
    handleDelete,
    addReply,
    editReply,
} = require("../db/queries");

async function resolveComment(comment) {
    let resolvedComment;
    try {
        const user = await db.getUser(comment.user_id);
        resolvedComment = {
            ...comment,
            user: {
                image: { png: user.image_url, webp: "" },
                username: user.username,
            },
            createdAt: new Date(comment.created_at).getTime(),
        };

        if ("replying_to" in comment) {
            resolvedComment.replyingTo = await db.getUsernameFromCommentId(
                comment.replying_to
            );
            resolvedComment.commentID = resolvedComment.replying_to;
        } else {
            let replies = await db.getReplies(comment.id);

            resolvedComment.replies = await Promise.all(
                replies.map((reply) => resolveComment(reply))
            );
        }
    } catch (e) {
        console.log("Resolve Issue: ", e);
        throw new Error("Error Resolving Comments");
    }

    delete resolvedComment.created_at;
    delete resolvedComment.user_id;
    delete resolvedComment.replying_to;

    return resolvedComment;
}

async function handleMessage(
    getMessage,
    decode = (message) => message,
    errMsg = "An error occured while trying to process the message"
) {
    try {
        let message = await Promise.resolve(getMessage());
        const decodedMessage = await Promise.resolve(decode(message));

        return JSON.stringify(decodedMessage);
    } catch (error) {
        console.log(error);
        throw new Error(errMsg);
    }
}

class MessageHandler {
    constructor(decoder, handler) {
        this.decoder = decoder;
        this.handler = handler;

        this.cases = new Map();
    }

    async handle(message) {
        for (let [type, action] of this.cases) {
            if (message.type === type) {
                message.data = await this.handler(
                    () => action(message.data),
                    this.decoder
                );
            }
        }

        return JSON.stringify(message);
    }

    register(caseIdentifier, action) {
        this.cases.set(caseIdentifier, action);
    }

    unregister(caseIdentifier) {
        this.cases.delete(caseIdentifier);
    }
}

let chatHandler = new MessageHandler(resolveComment, handleMessage);

chatHandler.register("ADD_COMMENT", addComment);
chatHandler.register("DELETE_REPLY", handleDelete);
chatHandler.register("ADD_REPLY", addReply);
chatHandler.register("EDIT_REPLY", editReply);

async function messageReducer(message) {
    message = JSON.parse(message);

    switch (message.type) {
        case "chat":
            return await chatHandler.handle(message.payload);
        default:
            console.log("Message could not be resolved");
    }
}

module.exports = {
    messageReducer,
    resolveComment,
};
