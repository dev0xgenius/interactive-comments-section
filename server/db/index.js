const uuid = require("uuid");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
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

const getComments = () => {
    return new Promise((resolve, reject) => {
        let tables = ["comments"];
        pool.query(
            `
      SELECT 
        ${tables[0]}.id,${tables[0]}.user_id, 
        ${tables[0]}.score, ${tables[0]}.content,
        ${tables[0]}.created_at 
       FROM comments;
    `
        )
            .then((comments) => resolve(comments.rows))
            .catch(reject);
    });
};

const getUser = (userId) => {
    return new Promise((resolve, reject) => {
        if (!uuid.validate(userId)) {
            const err = new Error("User doesn't exist", {
                cause: "Invalid User ID",
            });
            reject(err);
        }

        pool.query(`SELECT * FROM users WHERE id=$1`, [userId])
            .then((data) => resolve(data.rows[0]))
            .catch(reject);
    });
};

const getReplies = (commentId) => {
    return new Promise((resolve, reject) => {
        if (!uuid.validate(commentId))
            reject(
                new Error("User doesn't exist", { cause: "Invalid User ID" })
            );

        pool.query(`SELECT * FROM replies WHERE comment_id=$1`, [commentId])
            .then((data) => resolve(data.rows))
            .catch(reject);
    });
};

module.exports = {
    query,
    getComments,
    getUser,
    getReplies,
};
