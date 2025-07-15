const { Pool } = require("pg");

const pool = new Pool({
  user: "john",
  host: "localhost",
  database: "commentdb",
  password: "johndoe",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
});

const query = async (text, params) => {
  return await pool.query(text, params);
};

const getComments = () =>
  new Promise(async (resolve, reject) => {
    try {
      const comments = await pool.query("SELECT * FROM comments;");
      resolve(comments.rows);
    } catch (e) {
      reject(e);
    }
  });

module.exports = {
  query,
  getComments,
};
