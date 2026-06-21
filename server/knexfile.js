const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

module.exports = {
    development: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.join(__dirname, "db/migrations"),
        },
    },
    production: {
        client: "pg",
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        },
        migrations: {
            directory: path.join(__dirname, "db/migrations"),
        },
        pool: { min: 2, max: 10 },
    },
};
