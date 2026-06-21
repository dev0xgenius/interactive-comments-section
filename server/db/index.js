const db = require("./knex");

const getComments = async () => {
    try {
        const comments = await db("comments").select(
            "id",
            "user_id",
            "score",
            "content",
            "created_at",
        );
        return comments;
    } catch (error) {
        throw `Failed to get comments: ${error}`;
    }
};

const getUser = async (userId) => {
    const { v4: uuid } = require("uuid");
    if (!uuid.validate(userId)) {
        throw new Error("User doesn't exist", {
            cause: "Invalid User ID",
        });
    }

    const user = await db("users").where({ id: userId }).first();
    return user || false;
};

const getReplies = async (commentId) => {
    const { v4: uuid } = require("uuid");
    if (!uuid.validate(commentId)) {
        throw new Error("Invalid Comment ID", { cause: "Invalid User ID" });
    }

    const rows = await db("replies").where({ replying_to: commentId });
    return rows.map((row) => ({ ...row }));
};

const getUsernameFromCommentId = async (id) => {
    const result = await db("comments")
        .join("users", "comments.user_id", "users.id")
        .where("comments.id", id)
        .select("users.username")
        .first();

    return result?.username;
};

module.exports = {
    db,
    getComments,
    getUser,
    getReplies,
    getUsernameFromCommentId,
};
