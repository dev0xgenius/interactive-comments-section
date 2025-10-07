const db = require("./index.js");

async function addComment(comment) {
    let { userID, content, score } = comment;
    try {
        let result = await db.query(
            "INSERT INTO comments(user_id,content,score) VALUES($1,$2,$3) RETURNING *",
            [userID, content, score]
        );
        return result.rows[0];
    } catch (e) {
        throw e;
    }
}

async function addReply(reply) {
    let { replyingTo } = reply;

    try {
        let result = await db.query(
            `
      INSERT INTO replies(id,user_id,replying_to,content,score) 
      VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
            [
                reply.id,
                reply.userID,
                reply.commentID,
                reply.content,
                reply.score,
            ]
        );

        result = result.rows[0];
        result.replyingTo = await db.getUsernameFromCommentId(
            result.replying_to
        );

        result.replyingTo = `${result.replyingTo}, ${replyingTo}`;
        console.log(result.replyingTo);

        return result;
    } catch (e) {
        throw e;
    }
}

function handleDelete({ id }) {
    return typeof id == "number" ? deleteReply(id) : deleteComment(id);
}

async function repliesExist(commentID) {
    let result = await db.query(
        "SELECT COUNT(*) FROM replies WHERE replying_to=$1",
        [commentID]
    );

    return !!result.rows[0];
}

async function deleteComment(id) {
    try {
        repliesExist(id) && (await deleteReplies(id));
        const deletedComment = await db.query(
            "DELETE FROM comments WHERE id=$1 RETURNING *",
            [id]
        );

        return deletedComment.rows[0];
    } catch (e) {
        console.log("FAILED TO DELETE COMMENT");
        throw e;
    }
}

async function deleteReplies(commentID) {
    try {
        await db.query("DELETE FROM replies WHERE replying_to=$1", [commentID]);
    } catch (e) {
        console.log("FAILED TO DELETE REPLIES ON COMMENT: ", commentID);
        throw e;
    }
}

async function deleteReply(id) {
    try {
        const deletedReply = await db.query(
            "DELETE FROM replies WHERE id=$1 RETURNING *",
            [id]
        );

        return deletedReply.rows[0];
    } catch (e) {
        console.log("FAILED TO DELETE REPLY");
        throw e;
    }
}

async function editReply(data) {
    let { id } = data;

    let column_name = data.content ? "content" : "score";
    let column_value = data.content ? String(data.content) : Number(data.score);

    try {
        let result =
            typeof id == "number"
                ? await db.query(
                      `UPDATE replies SET "${column_name}"=$1 WHERE id=$2 RETURNING "${column_name}",id,replying_to`,
                      [column_value, id]
                  )
                : await db.query(
                      `UPDATE comments SET "${column_name}"=$1 WHERE id=$2 RETURNING "${column_name}",id`,
                      [column_value, id]
                  );

        return result.rows[0];
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
