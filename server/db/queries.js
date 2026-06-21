const { db } = require("./index");
const { v4: uuid } = require("uuid");

async function addComment(comment) {
    let { userID, content, score } = comment;
    try {
        const [row] = await db("comments")
            .insert({ user_id: userID, content, score })
            .returning("*");
        return row;
    } catch (e) {
        throw e;
    }
}

async function addReply(reply) {
    let { replyingTo } = reply;

    try {
        const [row] = await db("replies")
            .insert({
                id: reply.id,
                user_id: reply.userID,
                replying_to: reply.commentID,
                content: reply.content,
                score: reply.score,
            })
            .returning("*");

        row.replyingTo = await getUsernameFromCommentId(row.replying_to);
        row.replyingTo = `${row.replyingTo}, ${replyingTo}`;
        return row;
    } catch (e) {
        throw e;
    }
}

async function getUsernameFromCommentId(id) {
    const result = await db("comments")
        .join("users", "comments.user_id", "users.id")
        .where("comments.id", id)
        .select("users.username")
        .first();

    return result?.username;
}

function handleDelete({ id }) {
    return !uuid.validate(id) ? deleteReply(id) : deleteComment(id);
}

async function repliesExist(commentID) {
    const [row] = await db("replies")
        .where({ replying_to: commentID })
        .count()
        .first();

    return !!row?.count;
}

async function deleteComment(id) {
    try {
        const exists = await repliesExist(id);
        if (exists) {
            await db("replies").where({ replying_to: id }).del();
        }
        const [deleted] = await db("comments")
            .where({ id })
            .del()
            .returning("*");
        return deleted;
    } catch (e) {
        console.log("FAILED TO DELETE COMMENT");
        throw e;
    }
}

async function deleteReply(id) {
    try {
        const [deleted] = await db("replies")
            .where({ id })
            .del()
            .returning("*");
        return deleted;
    } catch (e) {
        console.log("FAILED TO DELETE REPLY");
        throw e;
    }
}

async function editReply(data) {
    let { id } = data;

    const ALLOWED_COLUMNS = { content: true, score: true };
    let column_name = data.content ? "content" : "score";
    column_name = ALLOWED_COLUMNS[column_name] ? column_name : "content";
    let column_value = data.content ? String(data.content) : Number(data.score);

    try {
        const table = !uuid.validate(id) ? "replies" : "comments";
        const selectColumns =
            table === "replies"
                ? ["id", column_name, "replying_to"]
                : ["id", column_name];

        const [row] = await db(table)
            .where({ id })
            .update({ [column_name]: column_value })
            .returning(selectColumns);

        return row;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    addComment,
    addReply,
    deleteReply,
    handleDelete,
    editReply,
};
