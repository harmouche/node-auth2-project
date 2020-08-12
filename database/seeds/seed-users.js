exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const users = [
    {
      name: "admin", // will get id 1
    },
    {
      name: "user", // will get id 2
    },
  ];

  return knex("users")
    .insert(users)
    .then(() => console.log("\n== Seed data for users table added. ==\n"));
};
