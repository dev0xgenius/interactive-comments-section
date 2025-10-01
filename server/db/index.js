const path = require("path");
const uuid = require("uuid");
const { Pool } = require("pg");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: {
    //     rejectUnauthorized: false,
    // },
});

pool.on("error", (err, client) => {
    console.log(
        `A flabbergasting error has occured. Error: ${err}. 
        Na ${JSON.stringify(client)} cause am`
    );
    process.exit(-1);
});

const query = async (text, params) => {
    return await pool.query(text, params);
};

const getComments = async () => {
    try {
        let comments = await pool.query(
            `SELECT id,user_id,score,content,created_at FROM comments`
        );

        return comments.rows;
    } catch (error) {
        return error;
    }
};

const getUser = async (userId) => {
    try {
        if (!uuid.validate(userId)) {
            throw new Error("User doesn't exist", {
                cause: "Invalid User ID",
            });
        }

        const queryResult = await pool.query(
            `SELECT * FROM users WHERE id=$1`,
            [userId]
        );

        const user = queryResult.rows[0] || false;
        return user;
    } catch (err) {
        return err;
    }
};

const getReplies = (commentId) => {
    return new Promise((resolve, reject) => {
        if (!uuid.validate(commentId))
            reject(
                new Error("User doesn't exist", { cause: "Invalid User ID" })
            );

        pool.query(`SELECT * FROM replies WHERE replying_to=$1`, [commentId])
            .then((data) => resolve(data.rows))
            .catch(reject);
    });
};

const getUsernameFromCommentId = async (id) => {
    const usernameQuery = await pool.query(
        "SELECT username FROM users WHERE id=(SELECT user_id FROM comments WHERE id=$1)",
        [id]
    );

    let { username } = usernameQuery.rows[0];
    return username;
};

module.exports = {
    query,
    getComments,
    getUser,
    getReplies,
    getUsernameFromCommentId,
};
