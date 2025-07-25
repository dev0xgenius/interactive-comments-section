const db = require("./index.js");

async function addComment(comment) {
  let { userID, content, score } = comment;
  try {
    let result = await db.query(
      "INSERT INTO comments(user_id,content,score) VALUES($1,$2,$3) RETURNING *",
      [userID, content, score],
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
      INSERT INTO replies(id,user_id,comment_id,replying_to,content,score) 
      VALUES($1,$2,$3,$4,$5,$6) RETURNING *
    `,
      [
        reply.id,
        reply.userID,
        reply.commentID,
        replyingTo,
        reply.content,
        reply.score,
      ],
    );

    return result.rows[0];
  } catch (e) {
    throw e;
  }
}

async function deleteReply(reply) {
  let { id } = reply;
  try {
    typeof id == "number"
      ? await db.query("DELETE FROM replies WHERE id=$1", [id])
      : await db.query("DELETE FROM comments WHERE id=$1", [id]);
  } catch (e) {
    throw e;
  }
}

async function editReply(data) {
  let { id } = data;
  let column_name = data.content ? "content" : "score";
  let column_value = data.content || data.score;

  try {
    let result =
      typeof id == "number"
        ? await db.query(
            `UPDATE replies SET "${column_name}"=$1 WHERE id=$2 RETURNING "${column_name}",id`,
            [column_value, id],
          )
        : await db.query(
            `UPDATE comments SET "${column_name}"=$1 WHERE id=$2 RETURNING "${column_name}",id `,
            [column_value, id],
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
  editReply,
};
