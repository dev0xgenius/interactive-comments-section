const path = require("path");
const knex = require("knex");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const db = knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
});

module.exports = db;
