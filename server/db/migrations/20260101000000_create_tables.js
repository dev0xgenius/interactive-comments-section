exports.up = async function (knex) {
    await knex.raw("CREATE SCHEMA IF NOT EXISTS auth");

    await knex.schema.withSchema("auth").createTable("auth", (table) => {
        table.string("username", 32);
        table.text("token");
    });

    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("username", 32);
        table.string("password_hash");
        table.text("image_url");
    });

    await knex.schema.createTable("comments", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("user_id").references("id").inTable("users");
        table.text("content");
        table.integer("score");
        table.timestamptz("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("replies", (table) => {
        table.increments("id").primary();
        table.uuid("user_id").references("id").inTable("users");
        table.uuid("replying_to").references("id").inTable("comments");
        table.text("content");
        table.integer("score");
        table.timestamptz("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("replies");
    await knex.schema.dropTableIfExists("comments");
    await knex.schema.dropTableIfExists("users");
    await knex.schema.withSchema("auth").dropTableIfExists("auth");
};
